#!/usr/bin/python3
from app.models.base_model import BaseModel


class Review(BaseModel):
    """Review model (in-memory for now)."""

    def __init__(self, place_id: str, user_id: str, text: str, **kwargs):
        super().__init__()
        self.place_id = place_id
        self.user_id = user_id
        self.text = text

        # Optional
        self.rating = kwargs.get("rating")

    def to_dict(self):
        data = super().to_dict()
        data.update({
            "place_id": self.place_id,
            "user_id": self.user_id,
            "text": self.text,
            "rating": self.rating,
        })
        return data
