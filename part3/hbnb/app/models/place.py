#!/usr/bin/python3
from app.models.base_model import BaseModel


class Place(BaseModel):
    """Place model (in-memory for now)."""

    def __init__(self, title: str, owner_id: str, **kwargs):
        super().__init__()
        self.title = title
        self.owner_id = owner_id

        # Optional fields (safe defaults)
        self.description = kwargs.get("description")
        self.price = kwargs.get("price")
        self.latitude = kwargs.get("latitude")
        self.longitude = kwargs.get("longitude")

    def to_dict(self):
        data = super().to_dict()
        data.update({
            "title": self.title,
            "owner_id": self.owner_id,
            "description": self.description,
            "price": self.price,
            "latitude": self.latitude,
            "longitude": self.longitude,
        })
        return data
