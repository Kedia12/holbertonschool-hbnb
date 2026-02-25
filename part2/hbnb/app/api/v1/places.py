from flask import request
from flask_restx import Namespace, Resource

ns = Namespace("places", description="Place operations")


@ns.route("/")
class PlacesRoot(Resource):

    def get(self):
        """Lister toutes les places"""
        return {"message": "List of places (not implemented yet)"}, 200

    def post(self):
        """Créer une place"""
        data = request.json

        if not data:
            return {"error": "No input data provided"}, 400

        return {"message": "Place created (not implemented)", "data": data}, 201


@ns.route("/<string:place_id>")
class PlaceResource(Resource):

    def get(self, place_id):
        """Récupérer une place par ID"""
        return {"message": "Get place", "id": place_id}, 200

    def put(self, place_id):
        """Mettre à jour une place"""
        data = request.json

        if not data:
            return {"error": "No input data provided"}, 400

        return {"message": "Place updated", "id": place_id, "data": data}, 200