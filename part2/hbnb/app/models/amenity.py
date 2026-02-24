from app.models.base_model import BaseModel, ValidationError


class Amenity(BaseModel):
    def __init__(self, name: str):
        super().__init__()
        self.name = name
        self.validate()

    def validate(self):
        if not self.name or not isinstance(self.name, str):
            raise ValidationError("name is required")
        if len(self.name) > 50:
            raise ValidationError("name must be <= 50 characters")
        return True

    def to_dict(self):
        base = super().to_dict()
        base.update({"name": self.name})
        return base

