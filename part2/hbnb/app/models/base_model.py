import uuid
from datetime import datetime


class ValidationError(ValueError):
    """Raised when model validation fails."""
    pass


class BaseModel:
    def __init__(self):
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def save(self):
        """Update updated_at timestamp whenever the object is modified."""
        self.updated_at = datetime.now()

    def validate(self):
        """Override in child classes to enforce constraints."""
        return True

    def update(self, data: dict):
        """
        Update attributes based on dict, then validate and save.

        Repository.update() depends on this method existing.
        """
        for key, value in data.items():
            # Do not allow changing immutable fields
            if key in ("id", "created_at"):
                continue
            if hasattr(self, key):
                setattr(self, key, value)

        self.validate()
        self.save()

    def to_dict(self):
        """Useful later for API responses."""
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

