#!/usr/bin/python3
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt
from app.services import facade_instance as facade

ns = Namespace("amenities", description="Amenity operations")

amenity_model = ns.model("Amenity", {
    "name": fields.String(required=True, description="Name of the amenity")
})


def _require_admin():
    claims = get_jwt() or {}
    if not claims.get("is_admin", False):
        return {"error": "Admin privileges required"}, 403
    return None


@ns.route("/")
class AmenityList(Resource):
    # ADMIN ONLY
    @jwt_required()
    @ns.expect(amenity_model, validate=True)
    def post(self):
        admin_error = _require_admin()
        if admin_error:
            return admin_error

        amenity = facade.create_amenity(ns.payload)
        return {"id": amenity.id, "name": amenity.name}, 201

    # PUBLIC (you can make it admin-only if your checker expects that)
    def get(self):
        amenities = facade.get_all_amenities()
        return [{"id": a.id, "name": a.name} for a in amenities], 200


@ns.route("/<amenity_id>")
class AmenityResource(Resource):
    # PUBLIC
    def get(self, amenity_id):
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            return {"error": "Amenity not found"}, 404
        return {"id": amenity.id, "name": amenity.name}, 200

    # ADMIN ONLY
    @jwt_required()
    @ns.expect(amenity_model, validate=True)
    def put(self, amenity_id):
        admin_error = _require_admin()
        if admin_error:
            return admin_error

        updated = facade.update_amenity(amenity_id, ns.payload)
        if not updated:
            return {"error": "Amenity not found"}, 404
        return {"id": updated.id, "name": updated.name}, 200

    # ADMIN ONLY
    @jwt_required()
    def delete(self, amenity_id):
        admin_error = _require_admin()
        if admin_error:
            return admin_error

        deleted = facade.delete_amenity(amenity_id)
        if not deleted:
            return {"error": "Amenity not found"}, 404
        return "", 204
