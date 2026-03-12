from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import facade_instance as facade

ns = Namespace("places", description="Place operations")

place_model = ns.model("Place", {
    "title": fields.String(required=True),
    "description": fields.String(required=False),
    "price": fields.Float(required=True),
    "latitude": fields.Float(required=True),
    "longitude": fields.Float(required=True),
})

@ns.route("/")
class PlaceList(Resource):
    # PUBLIC
    def get(self):
        places = facade.list_places()
        return [{
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "price": p.price,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "owner_id": p.owner_id,
        } for p in places], 200

    # AUTH REQUIRED
    @jwt_required()
    @ns.expect(place_model, validate=True)
    def post(self):
        current_user = get_jwt_identity()

        data = ns.payload
        data["owner_id"] = current_user  # force owner to logged-in user

        place = facade.create_place(data)
        return {
            "id": place.id,
            "title": place.title,
            "description": place.description,
            "price": place.price,
            "latitude": place.latitude,
            "longitude": place.longitude,
            "owner_id": place.owner_id,
        }, 201


@ns.route("/<place_id>")
class PlaceResource(Resource):
    # PUBLIC
    def get(self, place_id):
        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404
        return {
            "id": place.id,
            "title": place.title,
            "description": place.description,
            "price": place.price,
            "latitude": place.latitude,
            "longitude": place.longitude,
            "owner_id": place.owner_id,
        }, 200

    # AUTH REQUIRED + ownership check
    @jwt_required()
    @ns.expect(place_model, validate=True)
    def put(self, place_id):
        current_user = get_jwt_identity()
        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404
        if place.owner_id != current_user:
            return {"error": "Unauthorized action"}, 403

        updated = facade.update_place(place_id, ns.payload)
        return {
            "id": updated.id,
            "title": updated.title,
            "description": updated.description,
            "price": updated.price,
            "latitude": updated.latitude,
            "longitude": updated.longitude,
            "owner_id": updated.owner_id,
        }, 200
