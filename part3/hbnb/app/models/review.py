from app.models.base_model import BaseModel, ValidationError

class Review(BaseModel):
    def __init__(self, place_id: str, user_id: str, text: str, rating: int = 5):
        super().__init__()
        self.place_id = place_id
        self.user_id = user_id
        self.text = text
        self.rating = rating

        self.validate()

    def validate(self):
        if not self.place_id:
            raise ValidationError("place_id is required")
        if not self.user_id:
            raise ValidationError("user_id is required")
        if not self.text or not isinstance(self.text, str):
            raise ValidationError("text is required")

        try:
            rating = int(self.rating)
        except Exception:
            raise ValidationError("rating must be an integer")

        if rating < 1 or rating > 5:
            raise ValidationError("rating must be between 1 and 5")

        self.rating = rating
        return True
