from app.extensions import db
from app.models.base_model import BaseModel, ValidationError

class Review(BaseModel):
    __tablename__ = "reviews"

    text = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer, nullable=False, default=5)

    # No relationships yet; keep plain ids
    user_id = db.Column(db.String(36), nullable=True)
    place_id = db.Column(db.String(36), nullable=True)

    def __init__(self, text, rating=5, user_id=None, place_id=None):
        if not text:
            raise ValidationError("text is required")
        if rating is None or not (1 <= int(rating) <= 5):
            raise ValidationError("rating must be between 1 and 5")

        self.text = text
        self.rating = int(rating)
        self.user_id = user_id
        self.place_id = place_id