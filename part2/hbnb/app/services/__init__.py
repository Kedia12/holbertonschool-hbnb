from app.repositories.user_repo import UserRepository
from app.repositories.place_repo import PlaceRepository
from app.repositories.amenity_repo import AmenityRepository
from app.repositories.review_repo import ReviewRepository
from app.services.facade import HBnBFacade

# Create repositories
user_repo = UserRepository()
place_repo = PlaceRepository()
amenity_repo = AmenityRepository()
review_repo = ReviewRepository()

# Create facade instance
facade_instance = HBnBFacade(
    place_repo=place_repo,
    user_repo=user_repo,
    amenity_repo=amenity_repo,
    review_repo=review_repo
)
