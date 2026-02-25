from flask import request
from flask_restx import Namespace, Resource
from app.business.facade import HBnBFacade

api = Namespace('places', description='Place operations')

facade = HBnBFacade()


@api.route('/')
class PlaceList(Resource):

    def get(self):
        places = facade.get_all_places()
        return places, 200

    def post(self):
        data = request.json

        if not data:
            return {"error": "No input data provided"}, 400

        # validation basique
        if "price" in data and data["price"] < 0:
            return {"error": "Price must be positive"}, 400

        if "latitude" in data and (data["latitude"] < -90 or data["latitude"] > 90):
            return {"error": "Latitude must be between -90 and 90"}, 400

        if "longitude" in data and (data["longitude"] < -180 or data["longitude"] > 180):
            return {"error": "Longitude must be between -180 and 180"}, 400

        place_id = facade.create_place(data)
        return {"id": place_id}, 201


@api.route('/<string:place_id>')
class PlaceResource(Resource):

    def get(self, place_id):
        place = facade.get_place(place_id)

        if not place:
            return {"error": "Place not found"}, 404

        return place, 200

    def put(self, place_id):
        data = request.json
        place = facade.get_place(place_id)

        if not place:
            return {"error": "Place not found"}, 404

        # validation
        if "price" in data and data["price"] < 0:
            return {"error": "Price must be positive"}, 400

        if "latitude" in data and (data["latitude"] < -90 or data["latitude"] > 90):
            return {"error": "Latitude must be between -90 and 90"}, 400

        if "longitude" in data and (data["longitude"] < -180 or data["longitude"] > 180):
            return {"error": "Longitude must be between -180 and 180"}, 400

        updated = facade.update_place(place_id, data)
        return updated, 200
