# app/__init__.py

from flask import Flask
from flask_restx import Api
from .api.v1.places import ns as places_ns
from .api.v1.users import ns as users_ns
from .api.v1.amenities import ns as amenities_ns
from .api.v1.reviews import ns as reviews_ns

def create_app():
    app = Flask(__name__)
    api = Api(app, prefix="/api/v1")
    
    api.add_namespace(users_ns)
    api.add_namespace(places_ns)
    api.add_namespace(amenities_ns)
    api.add_namespace(reviews_ns)
    
    return app
