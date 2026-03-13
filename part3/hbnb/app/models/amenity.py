from app.extensions import db
from app.models.base_model import BaseModel, ValidationError

class Amenity(BaseModel):
    __tablename__ = "amenities"

    name = db.Column(db.String(100), nullable=False, unique=True)

    def __init__(self, name):
        if not name:
            raise ValidationError("name is required")
        self.name = name