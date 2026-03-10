from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("reviews", description="Review operations")

review_model = ns.model("Review", {
    "text": fields.String(required=True),
    "rating": fields.Integer(required=True),
    "user_id": fields.String(required=True),
    "place_id": fields.String(required=True)
})

@ns.route("/")
class ReviewsRoot(Resource):
    @ns.marshal_list_with(review_model)
    def get(self):
        """Lister toutes les reviews"""
        reviews = facade.get_all_reviews()
        return [r.to_dict() for r in reviews], 200

    @ns.expect(review_model)
    @ns.marshal_with(review_model, code=201)
    def post(self):
        """Créer une nouvelle review"""
        data = ns.payload
        review = facade.create_review(data)
        return review.to_dict(), 201
