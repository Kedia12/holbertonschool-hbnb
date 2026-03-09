from app.repositories.user_repo import UserRepository
from app.repositories.place_repo import PlaceRepository
from app.repositories.amenity_repo import AmenityRepository
from app.repositories.review_repo import ReviewRepository
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
