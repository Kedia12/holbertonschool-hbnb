from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("users", description="User operations")

user_model = ns.model("User", {
    "first_name": fields.String(required=True, description="First name of the user"),
    "last_name": fields.String(required=True, description="Last name of the user"),
    "email": fields.String(required=True, description="Email of the user"),
})

@ns.route("/")
class UserList(Resource):
    @ns.expect(user_model, validate=True)
    @ns.response(201, "User successfully created")
    @ns.response(400, "Invalid input or email already registered")
    def post(self):
        user_data = ns.payload

        try:
            existing_user = facade.get_user_by_email(user_data["email"])
            if existing_user:
                return {"error": "Email already registered"}, 400

            new_user = facade.create_user(user_data)
            return {
                "id": new_user.id,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "email": new_user.email,
            }, 201

        except ValueError as e:
            return {"error": str(e)}, 400

    @ns.response(200, "List of users retrieved successfully")
    def get(self):
        users = facade.list_users()
        return [
            {"id": u.id, "first_name": u.first_name, "last_name": u.last_name, "email": u.email}
            for u in users
        ], 200


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

    @ns.expect(user_model, validate=True)
    @ns.response(200, "User updated successfully")
    @ns.response(404, "User not found")
    @ns.response(400, "Email already registered")
    def put(self, user_id):
        user_data = ns.payload

        try:
            updated = facade.update_user(user_id, user_data)
        except ValueError as e:
            return {"error": str(e)}, 400

        if not updated:
            return {"error": "User not found"}, 404

        return {
            "id": updated.id,
            "first_name": updated.first_name,
            "last_name": updated.last_name,
            "email": updated.email,
        }, 200