from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("places", description="Place operations")

place_model = ns.model("Place", {
    "title": fields.String(required=True),
    "description": fields.String,
    "price": fields.Float(required=True),
    "latitude": fields.Float(required=True),
    "longitude": fields.Float(required=True),
    "owner_id": fields.String(required=True),
    "amenities": fields.List(fields.String)
})

# ---------------- Routes pour les places ----------------
@ns.route("/")
class PlacesRoot(Resource):
    @ns.marshal_list_with(place_model)
    def get(self):
        """Lister toutes les places"""
        places = facade.get_all_places()
        return [p.to_dict() for p in places], 200

    @ns.expect(place_model)
    @ns.marshal_with(place_model, code=201)
    def post(self):
        """Créer une nouvelle place"""
        data = ns.payload
        new_place = facade.create_place(data)
        return new_place.to_dict(), 201

# ---------------- Routes pour gérer les amenities d'une place ----------------
@ns.route("/<string:place_id>/amenities/")
class PlaceAmenities(Resource):
    @ns.marshal_list_with(fields.String, envelope="amenities")
    def get(self, place_id):
        """Lister tous les amenities d'une place"""
        place = facade.get_place(place_id)
        if not place:
            ns.abort(404, "Place not found")
        return [a.to_dict()["id"] for a in place.amenities], 200

    @ns.expect(ns.model("AddAmenities", {"amenities": fields.List(fields.String)}))
    @ns.marshal_with(place_model)
    def post(self, place_id):
        """Ajouter des amenities à une place"""
        data = ns.payload
        amenities_ids = data.get("amenities", [])
        place = facade.get_place(place_id)
        if not place:
            ns.abort(404, "Place not found")
        for aid in amenities_ids:
            amenity = facade.get_amenity(aid)
            if not amenity:
                ns.abort(404, f"Amenity {aid} not found")
            place.add_amenity(amenity)
        return place.to_dict(), 200