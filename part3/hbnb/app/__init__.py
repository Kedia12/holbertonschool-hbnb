from flask import Flask
from flask_restx import Api

from app.extensions import bcrypt, jwt

# Namespaces (your files use ns in places/users/reviews, and api in auth)
from app.api.v1.users import ns as users_ns
from app.api.v1.places import ns as places_ns
from app.api.v1.reviews import ns as reviews_ns
from app.api.v1.auth import api as auth_ns  # <-- IMPORTANT: your auth.py uses "api="

def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # JWT minimum config (required to avoid KeyError + runtime init errors)
    app.config["JWT_SECRET_KEY"] = "dev-secret-change-me"
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"

    # init extensions
    bcrypt.init_app(app)
    jwt.init_app(app)

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

    return app