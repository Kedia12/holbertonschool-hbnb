from app.models.base_model import BaseModel, ValidationError

class Place(BaseModel):
    def __init__(self, title: str, price: float, latitude: float, longitude: float, owner_id: str, description: str = ""):
        super().__init__()
        self.title = title
        self.description = description or ""
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner_id = owner_id  # IMPORTANT: store owner as user id (string)

        self.validate()

    def validate(self):
        if not self.title or not isinstance(self.title, str):
            raise ValidationError("title is required")
        if len(self.title) > 100:
            raise ValidationError("title must be <= 100 characters")

        try:
            price = float(self.price)
        except Exception:
            raise ValidationError("price must be a number")
        if price <= 0:
            raise ValidationError("price must be > 0")
        self.price = price

        try:
            lat = float(self.latitude)
            lon = float(self.longitude)
        except Exception:
            raise ValidationError("latitude/longitude must be numbers")

        if not (-90.0 <= lat <= 90.0):
            raise ValidationError("latitude must be between -90 and 90")
        if not (-180.0 <= lon <= 180.0):
            raise ValidationError("longitude must be between -180 and 180")

        self.latitude = lat
        self.longitude = lon
        return True
