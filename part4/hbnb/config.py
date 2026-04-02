import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    DEBUG = False

    # JWT config
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///development.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


config = {
    "development": DevelopmentConfig,
    "default": DevelopmentConfig
}
