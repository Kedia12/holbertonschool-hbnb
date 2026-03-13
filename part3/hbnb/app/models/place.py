from app.extensions import db
from app.models.base_model import BaseModel, ValidationError

class Place(BaseModel):
    __tablename__ = "places"

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    # No relationship yet; keep plain owner reference if your app already uses it
    owner_id = db.Column(db.String(36), nullable=True)

    def __init__(self, title, description, price, latitude, longitude, owner_id=None):
        if not title:
            raise ValidationError("title is required")
        if price is None:
            raise ValidationError("price is required")
        if latitude is None:
            raise ValidationError("latitude is required")
        if longitude is None:
            raise ValidationError("longitude is required")

        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner_id = owner_id