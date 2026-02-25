from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("places", description="Place operations")

place_model = ns.model("Place", {
    "title": fields.String(required=True),
    "description": fields.String,
    "price": fields.Float(required=True),
    "latitude": fields.Float(required=True),
    "longitude": fields.Float(required=True),
    "owner": fields.String(required=True)
})


@ns.route("/")
class PlacesRoot(Resource):

    def get(self):
        """Lister toutes les places"""
        places = facade.list_places()
        return [p.to_dict() for p in places], 200

    def post(self):
        """Créer une place"""
        data = ns.payload

        if data.get("price") is None or data["price"] <= 0:
            return {"error": "Price must be positive"}, 400

        new_place = facade.create_place(data)
        return new_place.to_dict(), 201