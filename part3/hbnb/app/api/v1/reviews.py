from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services import facade_instance as facade

ns = Namespace("reviews", description="Review operations")

review_model = ns.model("Review", {
    "place_id": fields.String(required=True),
    "text": fields.String(required=True),
    "rating": fields.Integer(required=False, description="1..5"),
})

update_review_model = ns.model("ReviewUpdate", {
    "text": fields.String(required=False),
    "rating": fields.Integer(required=False),
})

@ns.route("/")
class ReviewList(Resource):
    @jwt_required()
    @ns.expect(review_model, validate=True)
    def post(self):
        current_user = get_jwt_identity()
        data = ns.payload
        place_id = data["place_id"]

        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404

        if place.owner_id == current_user:
            return {"error": "You cannot review your own place"}, 400

        existing = facade.find_review_by_user_and_place(current_user, place_id)
        if existing:
            return {"error": "You have already reviewed this place"}, 400

        review_data = {
            "place_id": place_id,
            "user_id": current_user,
            "text": data["text"],
            "rating": data.get("rating", 5),
        }
        review = facade.create_review(review_data)
        return {
            "id": review.id,
            "place_id": review.place_id,
            "user_id": review.user_id,
            "text": review.text,
            "rating": review.rating,
        }, 201


@ns.route("/<review_id>")
class ReviewResource(Resource):
    @jwt_required()
    @ns.expect(update_review_model, validate=True)
    def put(self, review_id):
        current_user = get_jwt_identity()
        claims = get_jwt() or {}
        is_admin = claims.get("is_admin", False)

        review = facade.get_review(review_id)
        if not review:
            return {"error": "Review not found"}, 404

        if not is_admin and review.user_id != current_user:
            return {"error": "Unauthorized action"}, 403

        updated = facade.update_review(review_id, ns.payload)
        return {
            "id": updated.id,
            "place_id": updated.place_id,
            "user_id": updated.user_id,
            "text": updated.text,
            "rating": updated.rating,
        }, 200

    @jwt_required()
    def delete(self, review_id):
        current_user = get_jwt_identity()
        claims = get_jwt() or {}
        is_admin = claims.get("is_admin", False)

        review = facade.get_review(review_id)
        if not review:
            return {"error": "Review not found"}, 404

        if not is_admin and review.user_id != current_user:
            return {"error": "Unauthorized action"}, 403

        facade.delete_review(review_id)
        return {"message": "Review deleted successfully"}, 200
