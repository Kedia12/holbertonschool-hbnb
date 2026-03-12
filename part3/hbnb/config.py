import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    DEBUG = False

    # JWT config (needed for @jwt_required)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

class DevelopmentConfig(Config):
    DEBUG = True

config = {
    "development": DevelopmentConfig,
    "default": DevelopmentConfig
}