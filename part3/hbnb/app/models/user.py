import re
from app.models.base_model import BaseModel, ValidationError
from app.extensions import bcrypt

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

class User(BaseModel):
    def __init__(self, first_name: str, last_name: str, email: str, password: str, is_admin: bool = False):
        super().__init__()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = bool(is_admin)

        self.password = None
        self.hash_password(password)

        self.validate()

    def hash_password(self, password: str):
        """Hashes the password before storing it."""
        if not password or not isinstance(password, str):
            raise ValidationError("password is required")
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def verify_password(self, password: str) -> bool:
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)

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
