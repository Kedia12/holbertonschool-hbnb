# HBnB Evolution — Part 2: Project Setup & Package Initialization

This part initializes the HBnB project structure using a layered architecture:
- **Presentation Layer**: `app/api/` (Flask-RESTx endpoints, versioned in `v1/`)
- **Business Logic Layer**: `app/models/` (domain entities) + `app/services/` (Facade)
- **Persistence Layer**: `app/persistence/` (in-memory repository, replaced by SQLAlchemy in Part 3)

## Structure
- `app/__init__.py`: Flask app factory (`create_app()`)
- `app/api/v1/`: API endpoint placeholders (users, places, reviews, amenities)
- `app/models/`: entity placeholders (User, Place, Review, Amenity)
- `app/services/facade.py`: `HBnBFacade` placeholder methods + repositories
- `app/services/__init__.py`: singleton `facade` instance
- `app/persistence/repository.py`: repository interface + `InMemoryRepository`
- `run.py`: app entry point
- `config.py`: configuration (development default)
- `requirements.txt`: project dependencies

## Install
```bash
pip install -r requirements.txt