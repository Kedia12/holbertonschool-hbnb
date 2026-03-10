from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("places", description="Place operations")

# Model pour créer une place
place_model = ns.model("Place", {
    "title": fields.String(required=True),
    "description": fields.String,
    "price": fields.Float(required=True),
    "latitude": fields.Float(required=True),
    "longitude": fields.Float(required=True),
    "owner": fields.String(required=True)
})

# Model pour lier des amenities
amenity_list_model = ns.model("PlaceAmenities", {
    "amenities": fields.List(fields.String, required=True)
})

@ns.route("/")
class PlacesRoot(Resource):
    def get(self):
        """Lister toutes les places"""
        places = facade.get_all_places()
        return [p.to_dict() for p in places], 200

    def post(self):
        """Créer une place"""
        data = ns.payload
        new_place = facade.create_place(data)
        return new_place.to_dict(), 201

@ns.route("/<place_id>/amenities/")
class PlaceAmenities(Resource):
    @ns.expect(amenity_list_model)
    def post(self, place_id):
        """Associer une ou plusieurs amenities à une place"""
        data = ns.payload
        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404

        added_amenities = []
        for amenity_id in data.get("amenities", []):
            amenity = facade.get_amenity(amenity_id)
            if not amenity:
                return {"error": f"Amenity {amenity_id} not found"}, 404
            place.add_amenity(amenity)
            added_amenities.append(amenity.id)

        return {"id": place.id, "amenities": added_amenities}, 200