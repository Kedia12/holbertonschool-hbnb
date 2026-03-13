from app.persistence.repository import InMemoryRepository
from app.persistence.user_repository import UserRepository
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity

class HBnBFacade:
    def __init__(self):
        self.user_repo = UserRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    # -------- Users --------
    def create_user(self, user_data: dict) -> User:
        user = User(**user_data)  # hashes password in model
        self.user_repo.add(user)
        return user

    def get_user(self, user_id: str):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email: str):
        return self.user_repo.get_user_by_email(email)

    def list_users(self):
        return self.user_repo.get_all()

    def update_user(self, user_id: str, data: dict):
        user = self.get_user(user_id)
        if not user:
            return None

        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        if "email" in data:
            user.email = data["email"]
        if "password" in data:
            user.hash_password(data["password"])

        return user

    # -------- Places --------
    def create_place(self, place_data: dict) -> Place:
        place = Place(**place_data)
        self.place_repo.add(place)
        return place

    def get_place(self, place_id: str):
        return self.place_repo.get(place_id)

    def list_places(self):
        return self.place_repo.get_all()

    def update_place(self, place_id: str, data: dict):
        place = self.get_place(place_id)
        if not place:
            return None
        place.update(data)
        return place

    # -------- Reviews --------
    def create_review(self, review_data: dict) -> Review:
        review = Review(**review_data)
        self.review_repo.add(review)
        return review

    def get_review(self, review_id: str):
        return self.review_repo.get(review_id)

    def update_review(self, review_id: str, data: dict):
        review = self.get_review(review_id)
        if not review:
            return None
        review.update(data)
        return review

    def delete_review(self, review_id: str):
        review = self.get_review(review_id)
        if not review:
            return None
        self.review_repo.delete(review_id)
        return review

    def list_reviews(self):
        return self.review_repo.get_all()

    def find_review_by_user_and_place(self, user_id: str, place_id: str):
        return next(
            (r for r in self.review_repo.get_all()
             if r.user_id == user_id and r.place_id == place_id),
            None
        )

    # -------- Amenities --------
    def create_amenity(self, amenity_data: dict) -> Amenity:
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id: str):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repo.get_all()

    def list_amenities(self):
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id: str, data: dict):
        amenity = self.get_amenity(amenity_id)
        if not amenity:
            return None
        amenity.update(data)
        return amenity
