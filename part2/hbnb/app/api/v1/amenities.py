from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("amenities", description="Amenity operations")

amenity_model = ns.model("Amenity", {
    "name": fields.String(required=True, description="Name of the amenity")
})

@ns.route("/")
class AmenityList(Resource):
    @ns.expect(amenity_model, validate=True)
    @ns.response(201, "Amenity successfully created")
    @ns.response(400, "Invalid input data")
    def post(self):
        """Register a new amenity"""
        data = ns.payload
        amenity = facade.create_amenity(data)
        return {"id": amenity.id, "name": amenity.name}, 201

    @ns.response(200, "List of amenities retrieved successfully")
    def get(self):
        """Retrieve a list of all amenities"""
        amenities = facade.get_all_amenities()
        return [{"id": a.id, "name": a.name} for a in amenities], 200


@ns.route("/<amenity_id>")
class AmenityResource(Resource):
    @ns.response(200, "Amenity details retrieved successfully")
    @ns.response(404, "Amenity not found")
    def get(self, amenity_id):
        """Get amenity details by ID"""
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            return {"error": "Amenity not found"}, 404
        return {"id": amenity.id, "name": amenity.name}, 200

    @ns.expect(amenity_model, validate=True)
    @ns.response(200, "Amenity updated successfully")
    @ns.response(404, "Amenity not found")
    @ns.response(400, "Invalid input data")
    def put(self, amenity_id):
        """Update an amenity's information"""
        data = ns.payload
        updated = facade.update_amenity(amenity_id, data)
        if not updated:
            return {"error": "Amenity not found"}, 404
        return {"id": updated.id, "name": updated.name}, 200
