#!/usr/bin/python3
from flask import Flask
from flask_restx import Api
from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.exceptions import Unauthorized

from app.extensions import bcrypt
from app.api.v1.users import ns as users_ns
from app.api.v1.auth import api as auth_ns
from app.api.v1.protected import api as protected_ns

jwt = JWTManager()


def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Use Flask SECRET_KEY to sign JWTs
    app.config["JWT_SECRET_KEY"] = app.config["SECRET_KEY"]

    # Initialize extensions
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Initialize API
    api = Api(
        app,
        version="1.0",
        title="HBnB API",
        description="HBnB Application API",
        doc="/api/v1/"
    )

    # Fix: Convert JWT "missing token" errors into proper HTTP responses (not 500)
    @api.errorhandler(NoAuthorizationError)
    def handle_no_auth_error(e):
        return {"error": "Missing or invalid Authorization header", "details": str(e)}, 401

    @api.errorhandler(Unauthorized)
    def handle_unauthorized(e):
        return {"error": "Unauthorized", "details": str(e)}, 401

    # Register namespaces
    api.add_namespace(users_ns, path="/api/v1/users")
    api.add_namespace(auth_ns, path="/api/v1/auth")
    api.add_namespace(protected_ns, path="/api/v1/protected")

    return app