from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.place import Place


def main():
    app = create_app()

    with app.app_context():
        user = User.query.first()
        if not user:
            print("No users found. Register a user first.")
            return

        targets = [
            ("Budget Room 10", 10.0, 48.8566, 2.3522),
            ("Comfort Flat 50", 50.0, 48.8606, 2.2945),
            ("Premium Loft 120", 120.0, 48.8626, 2.3882),
        ]

        created = 0
        for title, price, lat, lon in targets:
            existing = Place.query.filter_by(title=title).first()
            if existing:
                continue

            place = Place(
                title=title,
                description=f"Description for {title}",
                price=price,
                latitude=lat,
                longitude=lon,
                owner_id=user.id,
            )
            db.session.add(place)
            created += 1

        db.session.commit()

        print(f"Created {created} new places.")
        print("Current places:")
        for place in Place.query.order_by(Place.price.asc()).all():
            print(f"- {place.title} | ${place.price:.0f} | id={place.id}")


if __name__ == "__main__":
    main()
