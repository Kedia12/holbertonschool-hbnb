from app.persistence.repository import InMemoryRepository


class HBnBFacade:
    def __init__(self):
        self.user_repository = InMemoryRepository()
        self.amenity_repository = InMemoryRepository()
        self.place_repository = InMemoryRepository()

    # USERS
    def create_user(self, user_data):
        return self.user_repository.add(user_data)

    def get_user(self, user_id):
        return self.user_repository.get(user_id)

    def get_all_users(self):
        return self.user_repository.get_all()

    def update_user(self, user_id, data):
        return self.user_repository.update(user_id, data)

    # AMENITIES
    def create_amenity(self, amenity_data):
        return self.amenity_repository.add(amenity_data)

    def get_amenity(self, amenity_id):
        return self.amenity_repository.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repository.get_all()

    def update_amenity(self, amenity_id, data):
        return self.amenity_repository.update(amenity_id, data)

    # PLACES
    def create_place(self, place_data):
        return self.place_repository.add(place_data)

    def get_place(self, place_id):
        return self.place_repository.get(place_id)

    def get_all_places(self):
        return self.place_repository.get_all()

    def update_place(self, place_id, data):
        return self.place_repository.update(place_id, data)
