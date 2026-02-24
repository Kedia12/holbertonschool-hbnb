from flask_restx import Namespace, Resource

ns = Namespace("amenities", description="Amenity operations")

@ns.route("/")
class AmenitiesRoot(Resource):
    def get(self):
        return {"message": "Amenities endpoint placeholder"}, 200
