from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("reviews", description="Review operations")

# Model pour Swagger
review_model = ns.model("Review", {
    "id": fields.String(readonly=True),
    "text": fields.String(required=True),
    "rating": fields.Integer(required=True),
    "user_id": fields.String(required=True),
    "place_id": fields.String(required=True)
})

# Routes pour les reviews
@ns.route("/")
class ReviewsRoot(Resource):
    @ns.marshal_list_with(review_model)
    def get(self):
        """Lister toutes les reviews"""
        reviews = facade.get_all_reviews()
        return [r.to_dict() for r in reviews]

    @ns.expect(review_model)
    @ns.marshal_with(review_model, code=201)
    def post(self):
        """Créer une nouvelle review"""
        data = ns.payload
        new_review = facade.create_review(data)
        return new_review.to_dict(), 201