from app.models.base_model import BaseModel, ValidationError
from app.models.user import User
from app.models.place import Place


class Review(BaseModel):
    def __init__(self, text: str, rating: int, place: Place, user: User):
        super().__init__()
        self.text = text
        self.rating = int(rating)

        # Relationships
        self.place = place
        self.user = user

        self.validate()

        # Link review to place (relationship)
        self.place.add_review(self)

    def validate(self):
        if not self.text or not isinstance(self.text, str):
            raise ValidationError("text is required")

        if not (1 <= self.rating <= 5):
            raise ValidationError("rating must be between 1 and 5")

        if not isinstance(self.place, Place):
            raise ValidationError("place must be a Place instance")

        if not isinstance(self.user, User):
            raise ValidationError("user must be a User instance")

        return True

    def to_dict(self):
        base = super().to_dict()
        base.update({
            "text": self.text,
            "rating": self.rating,
            "place_id": getattr(self.place, "id", None),
            "user_id": getattr(self.user, "id", None),
        })
        return base

