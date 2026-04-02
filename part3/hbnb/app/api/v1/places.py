from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services import facade_instance as facade

ns = Namespace("places", description="Place operations")

place_model = ns.model("Place", {
    "title": fields.String(required=True),
    "description": fields.String(required=False),
    "price": fields.Float(required=True),
    "latitude": fields.Float(required=True),
    "longitude": fields.Float(required=True),
})


def _serialize_place(place, include_details=False):
    payload = {
        "id": place.id,
        "title": place.title,
        "description": place.description,
        "price": place.price,
        "latitude": place.latitude,
        "longitude": place.longitude,
        "owner_id": place.owner_id,
    }

    if include_details:
        payload["host"] = {
            "id": place.owner.id if place.owner else place.owner_id,
            "first_name": place.owner.first_name if place.owner else None,
            "last_name": place.owner.last_name if place.owner else None,
            "email": place.owner.email if place.owner else None,
        }
        payload["amenities"] = [{
            "id": amenity.id,
            "name": amenity.name,
        } for amenity in place.amenities]
        payload["reviews"] = [{
            "id": review.id,
            "place_id": review.place_id,
            "user_id": review.user_id,
            "text": review.text,
            "rating": review.rating,
            "user": {
                "id": review.author.id if review.author else review.user_id,
                "first_name": review.author.first_name if review.author else None,
                "last_name": review.author.last_name if review.author else None,
                "email": review.author.email if review.author else None,
            },
        } for review in place.reviews]

    return payload

@ns.route("/")
class PlaceList(Resource):
    # PUBLIC
    def get(self):
        places = facade.list_places()
        return [_serialize_place(place) for place in places], 200

    # AUTH REQUIRED
    @jwt_required()
    @ns.expect(place_model, validate=True)
    def post(self):
        current_user = get_jwt_identity()

        data = ns.payload
        data["owner_id"] = current_user

        place = facade.create_place(data)
        return _serialize_place(place), 201


@ns.route("/<place_id>")
class PlaceResource(Resource):
    # PUBLIC
    def get(self, place_id):
        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404
        return _serialize_place(place, include_details=True), 200

    @jwt_required()
    @ns.expect(place_model, validate=True)
    def put(self, place_id):
        current_user = get_jwt_identity()
        claims = get_jwt() or {}
        is_admin = claims.get("is_admin", False)

        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404

        if not is_admin and place.owner_id != current_user:
            return {"error": "Unauthorized action"}, 403

        updated = facade.update_place(place_id, ns.payload)
        return _serialize_place(updated), 200
