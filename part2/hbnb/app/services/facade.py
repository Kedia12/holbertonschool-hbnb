from app.persistence.repository import InMemoryRepository
from app.models.user import User

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    def create_user(self, user_data: dict) -> User:
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id: str):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email: str):
        return self.user_repo.get_by_attribute("email", email)

    def list_users(self):
        return self.user_repo.get_all()

    def update_user(self, user_id: str, user_data: dict):
        user = self.get_user(user_id)
        if not user:
            return None

        new_email = user_data.get("email")
        if new_email and new_email != user.email:
            existing = self.get_user_by_email(new_email)
            if existing and existing.id != user_id:
                raise ValueError("Email already registered")

        user.update(user_data)
        return user
