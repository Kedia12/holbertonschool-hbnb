from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import facade_instance as facade

ns = Namespace("places", description="Place operations")

place_model = ns.model("Place", {
    "title": fields.String(required=True, description="Title of the place"),
    # Add more fields if your Place model supports them:
    # "description": fields.String(required=False),
    # "price": fields.Float(required=False),
    # "latitude": fields.Float(required=False),
    # "longitude": fields.Float(required=False),
})

@ns.route("/")
class PlaceList(Resource):
    def get(self):
        """PUBLIC: List all places"""
        places = facade.get_places()
        # If your facade returns objects, convert to dict if needed:
        return [p.to_dict() if hasattr(p, "to_dict") else p for p in places], 200

    @jwt_required()
    @ns.expect(place_model, validate=True)
    def post(self):
        """AUTH: Create a new place (owner is the logged-in user)"""
        current_user = get_jwt_identity()
        data = ns.payload or {}

        # Force owner_id from JWT (do not trust client input)
        data["owner_id"] = current_user

        place = facade.create_place(data)
        return {"id": place.id, "message": "Place successfully created"}, 201

@ns.route("/<place_id>")
class PlaceResource(Resource):
    def get(self, place_id):
        """PUBLIC: Get one place"""
        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404
        return place.to_dict() if hasattr(place, "to_dict") else place, 200

    @jwt_required()
    def put(self, place_id):
        """AUTH: Update a place (only owner)"""
        current_user = get_jwt_identity()
        place = facade.get_place(place_id)

        if not place:
            return {"error": "Place not found"}, 404

        if str(place.owner_id) != str(current_user):
            return {"error": "Unauthorized action"}, 403

        updated = facade.update_place(place_id, ns.payload or {})
        return updated.to_dict() if hasattr(updated, "to_dict") else updated, 200
