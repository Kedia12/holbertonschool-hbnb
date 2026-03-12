from flask_restx import Namespace, Resource, fields
from app.services import facade_instance as facade

ns = Namespace("users", description="User operations")

user_model = ns.model("User", {
    "first_name": fields.String(required=True, description="First name of the user"),
    "last_name": fields.String(required=True, description="Last name of the user"),
    "email": fields.String(required=True, description="Email of the user"),
    "password": fields.String(required=True, description="User password"),
})

@ns.route("/")
class UserList(Resource):
    @ns.expect(user_model, validate=True)
    @ns.response(201, "User successfully created")
    @ns.response(400, "Email already registered")
    def post(self):
        data = ns.payload

        existing = facade.get_user_by_email(data["email"])
        if existing:
            return {"error": "Email already registered"}, 400

        user = facade.create_user(data)
        # Do NOT return password
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
