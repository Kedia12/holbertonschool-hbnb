#!/usr/bin/python3
"""Amenity model for Part 3 (in-memory version, before SQLAlchemy)."""

from app.models.base_model import BaseModel


class Amenity(BaseModel):
    """Represents an amenity (e.g., Wi-Fi, Pool)."""

    def __init__(self, name: str, **kwargs):
        super().__init__(**kwargs)
        self.name = name

    def update(self, data: dict):
        """Update mutable fields."""
        if not data:
            return
        if "name" in data and data["name"] is not None:
            self.name = data["name"]
