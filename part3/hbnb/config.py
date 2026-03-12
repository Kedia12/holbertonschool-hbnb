class Config:
    DEBUG = False
    SECRET_KEY = "default_secret_key"

class DevelopmentConfig(Config):
    DEBUG = True
