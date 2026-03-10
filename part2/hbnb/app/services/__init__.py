# hbnb/app/services/__init__.py

from app.persistence.repository import InMemoryRepository
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity
from app.services.facade import HBnBFacade

# Create repository instances
user_repo = InMemoryRepository()
place_repo = InMemoryRepository()
amenity_repo = InMemoryRepository()
review_repo = InMemoryRepository()

# Create the facade instance with all repositories
facade_instance = HBnBFacade(
    user_repo=user_repo,
    place_repo=place_repo,
    amenity_repo=amenity_repo,
    review_repo=review_repo
)