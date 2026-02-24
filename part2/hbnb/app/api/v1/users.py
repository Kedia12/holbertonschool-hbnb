from flask_restx import Namespace, Resource

ns = Namespace("users", description="User operations")

@ns.route("/")
class UsersRoot(Resource):
    def get(self):
        return {"message": "Users endpoint placeholder"}, 200
