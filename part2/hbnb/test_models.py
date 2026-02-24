from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity

def run_tests():
    owner = User(first_name="Alice", last_name="Smith", email="alice.smith@example.com")
    place = Place(
        title="Cozy Apartment",
        description="A nice place to stay",
        price=100,
        latitude=37.7749,
        longitude=-122.4194,
        owner=owner
    )

    wifi = Amenity(name="Wi-Fi")
    place.add_amenity(wifi)

    review = Review(text="Great stay!", rating=5, place=place, user=owner)

    assert owner.is_admin is False
    assert place.owner.email == "alice.smith@example.com"
    assert len(place.amenities) == 1
    assert len(place.reviews) == 1
    assert place.reviews[0].text == "Great stay!"
    print("All model tests passed!")

if __name__ == "__main__":
    run_tests()
