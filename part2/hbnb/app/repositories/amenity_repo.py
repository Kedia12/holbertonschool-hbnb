class AmenityRepository:
    def __init__(self):
        self.amenities = {}

    def add(self, amenity):
        self.amenities[amenity.id] = amenity

    def get(self, amenity_id):
        return self.amenities.get(amenity_id)

    def get_all(self):
        return list(self.amenities.values())

    def update(self, amenity_id, data):
        amenity = self.get(amenity_id)
        if amenity:
            for k, v in data.items():
                setattr(amenity, k, v)
        return amenity
