from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import facade_instance as facade

ns = Namespace("reviews", description="Review operations")

review_model = ns.model("Review", {
    "place_id": fields.String(required=True, description="Place ID"),
    "text": fields.String(required=True, description="Review text"),
    # Optional if your model supports it:
    # "rating": fields.Integer(required=False, description="Rating 1-5"),
})

@ns.route("/")
class ReviewList(Resource):
    @jwt_required()
    @ns.expect(review_model, validate=True)
    def post(self):
        """AUTH: Create a review (rules enforced)"""
        current_user = get_jwt_identity()
        data = ns.payload or {}
        place_id = data.get("place_id")

        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404

        # Rule 1: cannot review your own place
        if str(place.owner_id) == str(current_user):
            return {"error": "You cannot review your own place."}, 400

        # Rule 2: cannot review the same place twice
        existing = facade.get_review_by_user_and_place(current_user, place_id)
        if existing:
            return {"error": "You have already reviewed this place."}, 400

        # Force user_id from JWT
        data["user_id"] = current_user

        review = facade.create_review(data)
        return {"id": review.id, "message": "Review successfully created"}, 201

@ns.route("/<review_id>")
class ReviewResource(Resource):
    @jwt_required()
    def put(self, review_id):
        """AUTH: Update a review (only creator)"""
        current_user = get_jwt_identity()
        review = facade.get_review(review_id)

        if not review:
            return {"error": "Review not found"}, 404

        if str(review.user_id) != str(current_user):
            return {"error": "Unauthorized action"}, 403

        updated = facade.update_review(review_id, ns.payload or {})
        return updated.to_dict() if hasattr(updated, "to_dict") else updated, 200

    @jwt_required()
    def delete(self, review_id):
        """AUTH: Delete a review (only creator)"""
        current_user = get_jwt_identity()
        review = facade.get_review(review_id)

        if not review:
            return {"error": "Review not found"}, 404

        if str(review.user_id) != str(current_user):
            return {"error": "Unauthorized action"}, 403

        facade.delete_review(review_id)
        return {"message": "Review deleted"}, 200
