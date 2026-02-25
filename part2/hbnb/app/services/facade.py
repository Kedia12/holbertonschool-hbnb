from app.persistence.repository import InMemoryRepository
from app.models.user import User
from app.models.amenity import Amenity

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    # ---------------- USERS ----------------
    def create_user(self, user_data: dict) -> User:
        email = user_data.get("email")

        # validation email
        if not email or "@" not in email:
            raise ValueError("Invalid email")

        existing = self.get_user_by_email(email)
        if existing:
            raise ValueError("Email already registered")

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
            if "@" not in new_email:
                raise ValueError("Invalid email")

            existing = self.get_user_by_email(new_email)
            if existing and existing.id != user_id:
                raise ValueError("Email already registered")

        user.update(user_data)
        return user

    # ---------------- AMENITIES ----------------
    def create_amenity(self, amenity_data: dict) -> Amenity:
        name = amenity_data.get("name")
        if not name:
            raise ValueError("Name is required")

        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id: str):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id: str, amenity_data: dict):
        amenity = self.get_amenity(amenity_id)
        if not amenity:
            return None

        amenity.update(amenity_data)
        return amenity

    # ---------------- REVIEWS ----------------
    def create_review(self, review_data):
        text = review_data.get("text")
        user_id = review_data.get("user_id")
        place_id = review_data.get("place_id")

        if not text:
            raise ValueError("Review text is required")
        if not user_id or not place_id:
            raise ValueError("user_id and place_id are required")

        return self.review_repo.add(review_data)

    def get_review(self, review_id):
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def update_review(self, review_id, data):
        review = self.get_review(review_id)
        if not review:
            return None
        return self.review_repo.update(review_id, data)

    def delete_review(self, review_id):
        return self.review_repo.delete(review_id)