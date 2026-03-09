# app/repositories/place_repo.py

class PlaceRepository:
    def __init__(self):
        self.places = {}  # dictionnaire pour stocker les places
        self.next_id = 1

    def ad(self, place):
        place.id = self.next_id
        self.places[self.next_id] = place
        self.next_id += 1
        return place

    def get_all(self):
        return list(self.places.values())

    def get(self, place_id):
        return self.places.get(place_id)

    def update(self, place_id, data):
        place = self.places.get(place_id)
        if place:
            for key, value in data.items():
                setattr(place, key, value)
        return place
