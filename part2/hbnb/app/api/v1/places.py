from flask_restx import Namespace, Resource

ns = Namespace("places", description="Place operations")

@ns.route("/")
class PlacesRoot(Resource):
    def get(self):
        return {"message": "Places endpoint placeholder"}, 200
