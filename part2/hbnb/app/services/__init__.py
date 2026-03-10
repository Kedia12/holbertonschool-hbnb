# hbnb/app/services/__init__.py

from app.persistence.repository import InMemoryRepository
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity
from app.services.facade import HBnBFacade

# Create repository instances
user_repo = UserRepository()
place_repo = PlaceRepository()
amenity_repo = AmenityRepository()
review_repo = ReviewRepository()

# Create the facade instance with all repositories
facade_instance = HBnBFacade(
    user_repo=user_repo,
    place_repo=place_repo,
    amenity_repo=amenity_repo,
    review_repo=review_repo
)
