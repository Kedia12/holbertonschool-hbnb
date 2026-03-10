from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("places", description="Place operations")

# Model pour Swagger
place_model = ns.model("Place", {
    "id": fields.String(readonly=True),
    "title": fields.String(required=True),
    "description": fields.String,
    "price": fields.Float(required=True),
    "latitude": fields.Float(required=True),
    "longitude": fields.Float(required=True),
    "owner_id": fields.String(required=True),
    "amenities": fields.List(fields.String)
})

# Routes pour les places
@ns.route("/")
class PlacesRoot(Resource):
    @ns.marshal_list_with(place_model)
    def get(self):
        """Lister toutes les places"""
        places = facade.get_all_places()
        return [p.to_dict() for p in places]

    @ns.expect(place_model)
    @ns.marshal_with(place_model, code=201)
    def post(self):
        """Créer une nouvelle place"""
        data = ns.payload
        new_place = facade.create_place(data)
        return new_place.to_dict(), 201