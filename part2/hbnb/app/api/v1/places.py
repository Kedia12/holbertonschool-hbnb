from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("places", description="Place operations")

place_model = ns.model(
    "Place",
    {
        "title": fields.String(required=True),
        "description": fields.String(required=False),
        "price": fields.Float(required=True),
        "latitude": fields.Float(required=True),
        "longitude": fields.Float(required=True),
        "owner_id": fields.String(required=True),
        "amenities": fields.List(fields.String),
    },
)


@ns.route("/")
class PlaceList(Resource):
    def get(self):
        """List all places"""
        places = facade.get_all_places()
        return [place.to_dict() for place in places], 200

    @ns.expect(place_model)
    def post(self):
        """Create a new place"""
        data = ns.payload
        try:
            place = facade.create_place(data)
        except ValueError as e:
            return {"error": str(e)}, 400
        return place.to_dict(), 201


@ns.route("/<place_id>")
class PlaceResource(Resource):
    def get(self, place_id):
        """Get place by ID"""
        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404
        return place.to_dict(), 200

    def put(self, place_id):
        """Update place"""
        data = ns.payload
        place = facade.update_place(place_id, data)
        if not place:
            return {"error": "Place not found"}, 404
        return place.to_dict(), 200