from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt
from app.services import facade_instance as facade

ns = Namespace("users", description="User operations")

user_model = ns.model("User", {
    "first_name": fields.String(required=True, description="First name of the user"),
    "last_name": fields.String(required=True, description="Last name of the user"),
    "email": fields.String(required=True, description="Email of the user"),
    "password": fields.String(required=True, description="User password"),
})

user_update_model = ns.model("UserUpdate", {
    "first_name": fields.String(required=False, description="First name of the user"),
    "last_name": fields.String(required=False, description="Last name of the user"),
    "email": fields.String(required=False, description="Email of the user"),
    "password": fields.String(required=False, description="User password"),
})

def _require_admin():
    claims = get_jwt() or {}
    if not claims.get("is_admin", False):
        return {"error": "Admin privileges required"}, 403
    return None


@ns.route("/")
class UserList(Resource):
    @jwt_required()
    @ns.expect(user_model, validate=True)
    @ns.response(201, "User successfully created")
    @ns.response(400, "Email already registered")
    @ns.response(403, "Admin privileges required")
    def post(self):
        admin_error = _require_admin()
        if admin_error:
            return admin_error

        data = ns.payload
        existing = facade.get_user_by_email(data["email"])
        if existing:
            return {"error": "Email already registered"}, 400

        user = facade.create_user(data)
        return {"id": user.id, "message": "User successfully created"}, 201


@ns.route("/<user_id>")
class UserResource(Resource):
    @ns.response(200, "User details retrieved successfully")
    @ns.response(404, "User not found")
    def get(self, user_id):
        user = facade.get_user(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }, 200

    @jwt_required()
    @ns.expect(user_update_model, validate=True)
    @ns.response(200, "User updated successfully")
    @ns.response(400, "Email already registered")
    @ns.response(403, "Admin privileges required")
    @ns.response(404, "User not found")
    def put(self, user_id):
        admin_error = _require_admin()
        if admin_error:
            return admin_error

        user = facade.get_user(user_id)
        if not user:
            return {"error": "User not found"}, 404

        data = ns.payload
        email = data.get("email")
        if email:
            existing = facade.get_user_by_email(email)
            if existing and str(existing.id) != str(user_id):
                return {"error": "Email already registered"}, 400

        updated = facade.update_user(user_id, data)
        return {
            "id": updated.id,
            "first_name": updated.first_name,
            "last_name": updated.last_name,
            "email": updated.email,
            "message": "User updated successfully",
        }, 200
