from flask import Flask
from flask_restx import Api
from flask_cors import CORS

from app.extensions import bcrypt, jwt, db

# Namespaces (your files use ns in places/users/reviews, and api in auth)
from app.api.v1.users import ns as users_ns
from app.api.v1.places import ns as places_ns
from app.api.v1.reviews import ns as reviews_ns
from app.api.v1.auth import api as auth_ns  # <-- IMPORTANT: your auth.py uses "api="
from app.api.v1.amenities import ns as amenities_ns  # <-- NEW: add amenities namespace

def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # JWT minimum config (required to avoid KeyError + runtime init errors)
    app.config["JWT_SECRET_KEY"] = "dev-secret-change-me"
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"

    # init extensions
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)

    # API (same style as part2)
    api = Api(
        app,
        prefix="/api/v1",
        version="1.0",
        title="HBnB API",
        description="HBnB Application API",
        doc="/",  # swagger at /api/v1/
    )

    # register namespaces
    api.add_namespace(users_ns)
    api.add_namespace(places_ns)
    api.add_namespace(reviews_ns)
    api.add_namespace(auth_ns)
    api.add_namespace(amenities_ns)

    return app