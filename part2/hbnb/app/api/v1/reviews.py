from flask import request
from flask_restx import Namespace, Resource
from app.services.facade import HBnBFacade

ns = Namespace("reviews", description="Review operations")

facade = HBnBFacade()


@ns.route("/")
class ReviewsRoot(Resource):

    def get(self):
        """Lister les reviews"""
        return facade.get_all_reviews(), 200

    def post(self):
        """Créer une review"""
        data = request.json

        if not data:
            return {"error": "No input data provided"}, 400

        if "text" not in data or not data["text"]:
            return {"error": "Review text is required"}, 400

        if "user_id" not in data or "place_id" not in data:
            return {"error": "user_id and place_id are required"}, 400

        review = facade.create_review(data)
        return {"id": review.id}, 201


@ns.route("/<string:review_id>")
class ReviewResource(Resource):

    def get(self, review_id):
        review = facade.get_review(review_id)

        if not review:
            return {"error": "Review not found"}, 404

        return review, 200

    def put(self, review_id):
        data = request.json
        review = facade.get_review(review_id)

        if not review:
            return {"error": "Review not found"}, 404

        updated = facade.update_review(review_id, data)
        return updated, 200

    def delete(self, review_id):
        result = facade.delete_review(review_id)

        if not result:
            return {"error": "Review not found"}, 404

        return {"message": "Review deleted"}, 200
