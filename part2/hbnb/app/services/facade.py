from app.models.user import User
from app.models.place import Place
from app.models.amenity import Amenity

class HBnBFacade:
    def __init__(self, place_repo=None, user_repo=None, amenity_repo=None, review_repo=None):
        # Repositories
        self.place_repo = place_repo
        self.user_repo = user_repo
        self.amenity_repo = amenity_repo
        self.review_repo = review_repo

    # ---------------- PLACES ----------------
    def list_places(self):
        """Return a list of all places"""
        return self.place_repo.get_all() if self.place_repo else []

    def create_place(self, data: dict) -> Place:
        """
        Create a Place object from a dictionary and add it to the repository.
        data must contain: title, description, price, latitude, longitude, owner
        """
        owner_data = data.get("owner")
        owner = None
        if owner_data and isinstance(owner_data, dict):
            owner = User(**owner_data)

        place = Place(
            title=data.get("title") or data.get("name"),
            description=data.get("description", ""),
            price=float(data.get("price", 0)),
            latitude=float(data.get("latitude", 0.0)),
            longitude=float(data.get("longitude", 0.0)),
            owner=owner
        )

        if self.place_repo:
            self.place_repo.add(place)
        return place

    def get_place(self, place_id):
        """Return a single place by ID"""
        return self.place_repo.get(place_id) if self.place_repo else None

    def update_place(self, place_id, data: dict):
        """Update a place with new data"""
        if not self.place_repo:
            return None
        return self.place_repo.update(place_id, data)

    # ---------------- USERS ----------------
    def create_user(self, data: dict) -> User:
        """Create a new user and add to the repository"""
        email = data.get("email")
        if not email or "@" not in email:
            raise ValueError("Invalid email")

        existing = self.get_user_by_email(email)
        if existing:
            raise ValueError("Email already registered")

        user = User(**data)
        if self.user_repo:
            self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        """Return a user by ID"""
        return self.user_repo.get(user_id) if self.user_repo else None

    def get_user_by_email(self, email: str):
        """Return a user by email"""
        return self.user_repo.get_by_attribute("email", email) if self.user_repo else None

    def list_users(self):
        """Return all users"""
        return self.user_repo.get_all() if self.user_repo else []

    def update_user(self, user_id, data: dict):
        """Update an existing user"""
        if not self.user_repo:
            return None
        user = self.get_user(user_id)
        if not user:
            return None

        new_email = data.get("email")
        if new_email and new_email != user.email:
            if "@" not in new_email:
                raise ValueError("Invalid email")

            existing = self.get_user_by_email(new_email)
            if existing and existing.id != user_id:
                raise ValueError("Email already registered")

        user.update(data)
        return user

    # ---------------- AMENITIES ----------------
    def create_amenity(self, data: dict) -> Amenity:
        """Create a new amenity"""
        name = data.get("name")
        if not name:
            raise ValueError("Name is required")

        amenity = Amenity(**data)
        if self.amenity_repo:
            self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        """Return an amenity by ID"""
        return self.amenity_repo.get(amenity_id) if self.amenity_repo else None

    def get_all_amenities(self):
        """Return all amenities"""
        return self.amenity_repo.get_all() if self.amenity_repo else []

    def update_amenity(self, amenity_id, data: dict):
        """Update an existing amenity"""
        if not self.amenity_repo:
            return None
        amenity = self.get_amenity(amenity_id)
        if not amenity:
            return None
        amenity.update(data)
        return amenity

    # ---------------- REVIEWS ----------------
    def create_review(self, data: dict):
        """Create a new review"""
        text = data.get("text")
        user_id = data.get("user_id")
        place_id = data.get("place_id")

        if not text:
            raise ValueError("Review text is required")
        if not user_id or not place_id:
            raise ValueError("user_id and place_id are required")

        if self.review_repo:
            return self.review_repo.add(data)
        return None

    def get_review(self, review_id):
        """Return a review by ID"""
        return self.review_repo.get(review_id) if self.review_repo else None

    def get_all_reviews(self):
        """Return all reviews"""
        return self.review_repo.get_all() if self.review_repo else []

    def update_review(self, review_id, data: dict):
        """Update a review"""
        review = self.get_review(review_id)
        if not review:
            return None
        return self.review_repo.update(review_id, data) if self.review_repo else None

    def delete_review(self, review_id):
        """Delete a review by ID"""
        return self.review_repo.delete(review_id) if self.review_repo else None
