import re
from app.models.base_model import BaseModel, ValidationError


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class User(BaseModel):
    def __init__(self, first_name: str, last_name: str, email: str, is_admin: bool = False):
        super().__init__()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = bool(is_admin)

        self.validate()

    def validate(self):
        if not self.first_name or not isinstance(self.first_name, str):
            raise ValidationError("first_name is required")
        if len(self.first_name) > 50:
            raise ValidationError("first_name must be <= 50 characters")

        if not self.last_name or not isinstance(self.last_name, str):
            raise ValidationError("last_name is required")
        if len(self.last_name) > 50:
            raise ValidationError("last_name must be <= 50 characters")

        if not self.email or not isinstance(self.email, str):
            raise ValidationError("email is required")
        if not EMAIL_RE.match(self.email):
            raise ValidationError("email format is invalid")

        return True

    def to_dict(self):
        base = super().to_dict()
        base.update({
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "is_admin": self.is_admin,
        })
        return base

