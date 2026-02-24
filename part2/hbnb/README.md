# HBnB Evolution — Part 2: Project Setup & Package Initialization

This part sets up a modular Flask project for **HBnB Evolution** using a layered architecture:
- **Presentation Layer**: Flask-RESTx API endpoints (`app/api/`)
- **Business Logic Layer**: Models + Facade (`app/models/`, `app/services/`)
- **Persistence Layer**: In-memory repository (`app/persistence/`) — will be replaced by SQLAlchemy in **Part 3**

---

## Project Structure

```text
hbnb/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── users.py
│   │       ├── places.py
│   │       ├── reviews.py
│   │       └── amenities.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── place.py
│   │   ├── review.py
│   │   └── amenity.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── facade.py
│   └── persistence/
│       ├── __init__.py
│       └── repository.py
├── run.py
├── config.py
├── requirements.txt
└── README.md
```

---

## Key Components

### Flask Application (`app/__init__.py`)
- Defines `create_app()` and initializes Flask-RESTx `Api`
- Registers API namespaces (users, places, reviews, amenities)

### In-Memory Repository (`app/persistence/repository.py`)
- Provides a generic repository interface (`Repository`)
- Implements `InMemoryRepository` for temporary storage during Part 2

### Facade (`app/services/facade.py` + `app/services/__init__.py`)
- `HBnBFacade` holds repositories for each entity type
- A singleton instance is created in `app/services/__init__.py`:
  - `facade = HBnBFacade()`

---

## Install & Run

From this directory (`part2/hbnb/`):

```bash
pip install -r requirements.txt
python run.py
```

Swagger UI (RESTx docs):

- http://127.0.0.1:5000/api/v1/