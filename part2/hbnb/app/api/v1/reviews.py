from flask_restx import Namespace, Resource

ns = Namespace("reviews", description="Review operations")

@ns.route("/")
class ReviewsRoot(Resource):
    def get(self):
        return {"message": "Reviews endpoint placeholder"}, 200
