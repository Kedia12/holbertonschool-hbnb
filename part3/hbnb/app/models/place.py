from app.extensions import db
from app.models.base_model import BaseModel, ValidationError

place_amenity = db.Table(
    "place_amenity",
    db.Column("place_id", db.String(36), db.ForeignKey("places.id"), primary_key=True),
    db.Column("amenity_id", db.String(36), db.ForeignKey("amenities.id"), primary_key=True),
)

class Place(BaseModel):
    __tablename__ = "places"

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    owner_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    reviews = db.relationship("Review", backref="place", lazy=True, cascade="all, delete-orphan")
    amenities = db.relationship(
        "Amenity",
        secondary=place_amenity,
        lazy="subquery",
        backref=db.backref("places", lazy=True)
    )

    def __init__(self, title, description, price, latitude, longitude, owner_id=None):
        if not title:
            raise ValidationError("title is required")
        if price is None:
            raise ValidationError("price is required")
        if latitude is None:
            raise ValidationError("latitude is required")
        if longitude is None:
            raise ValidationError("longitude is required")
        if not owner_id:
            raise ValidationError("owner_id is required")

        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner_id = owner_id