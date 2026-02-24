from app.models.base_model import BaseModel, ValidationError
from app.models.user import User
from app.models.amenity import Amenity


class Place(BaseModel):
    def __init__(
        self,
        title: str,
        description: str,
        price: float,
        latitude: float,
        longitude: float,
        owner: User
    ):
        super().__init__()
        self.title = title
        self.description = description or ""
        self.price = float(price)
        self.latitude = float(latitude)
        self.longitude = float(longitude)

        # Relationships
        self.owner = owner
        self.reviews = []     # list[Review]
        self.amenities = []   # list[Amenity]

        self.validate()

    def validate(self):
        if not self.title or not isinstance(self.title, str):
            raise ValidationError("title is required")
        if len(self.title) > 100:
            raise ValidationError("title must be <= 100 characters")

        if self.price <= 0:
            raise ValidationError("price must be a positive value")

        if not (-90.0 <= self.latitude <= 90.0):
            raise ValidationError("latitude must be between -90.0 and 90.0")

        if not (-180.0 <= self.longitude <= 180.0):
            raise ValidationError("longitude must be between -180.0 and 180.0")

        if not isinstance(self.owner, User):
            raise ValidationError("owner must be a User instance")

        return True

    def add_review(self, review):
        # Avoid circular import issues by not importing Review at top
        self.reviews.append(review)
        self.save()

    def add_amenity(self, amenity: Amenity):
        if not isinstance(amenity, Amenity):
            raise ValidationError("amenity must be an Amenity instance")
        if amenity not in self.amenities:
            self.amenities.append(amenity)
            self.save()

    def remove_amenity(self, amenity: Amenity):
        if amenity in self.amenities:
            self.amenities.remove(amenity)
            self.save()

    def to_dict(self):
        base = super().to_dict()
        base.update({
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "owner_id": getattr(self.owner, "id", None),
            "amenities": [a.to_dict() for a in self.amenities],
            "reviews_count": len(self.reviews),
        })
        return base

