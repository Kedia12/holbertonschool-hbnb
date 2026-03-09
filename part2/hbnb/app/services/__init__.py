from app.repositories.place_repo import PlaceRepository
from app.services.facade import HBnBFacade

place_repo = PlaceRepository()
facade_instance = HBnBFacade(place_repo)
