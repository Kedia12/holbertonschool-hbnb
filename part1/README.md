# HBnB Evolution — Part 1: Technical Documentation

This document describes the architecture and design of **HBnB Evolution**, a simplified AirBnB-like application.  
Part 1 focuses on **UML documentation** that will guide implementation in later parts.

---

## 1) Context and Objective

HBnB Evolution supports:
- **User Management**: register, update profile, delete; users may be admins
- **Place Management**: create/update/delete/list places; each place has an owner and amenities
- **Review Management**: create/update/delete/list reviews for places
- **Amenity Management**: create/update/delete/list amenities

All entities:
- have a unique `id`
- track `created_at` and `updated_at`

---

## 2) Architecture Overview (Layered + Facade)

The application uses a **three-layer architecture**:

### Presentation Layer
- Exposes API endpoints (and/or service methods)
- Validates request payloads at a basic level
- Delegates application use-cases to the **Facade**

### Business Logic Layer
- Contains domain models (`User`, `Place`, `Review`, `Amenity`)
- Enforces rules (ownership, relationships, constraints)
- Exposes a simplified API to the presentation layer via `HBnBFacade`

### Persistence Layer
- Provides repositories / DAOs for CRUD operations
- Responsible for storing/retrieving data from the database
- Database specifics are implemented in **Part 3**

---

## 3) High-Level Package Diagram (Facade Communication)

> Goal: show the three layers and how the **Facade pattern** provides a single entry point from Presentation to Business.

```mermaid
classDiagram
direction LR

namespace Presentation {
  class APIControllers {
    +POST /users
    +POST /places
    +POST /places/{id}/reviews
    +GET /places
  }
  class Services
}

namespace Business {
  class HBnBFacade {
    +register_user(data)
    +update_user(user_id, data)
    +delete_user(user_id)

    +create_place(owner_id, data)
    +update_place(place_id, data)
    +delete_place(place_id)
    +list_places(filters)

    +create_review(user_id, place_id, data)
    +update_review(review_id, data)
    +delete_review(review_id)
    +list_reviews_by_place(place_id)

    +create_amenity(data)
    +update_amenity(amenity_id, data)
    +delete_amenity(amenity_id)
    +list_amenities()
  }

  class DomainModels
}

namespace Persistence {
  class Repositories {
    +UserRepository
    +PlaceRepository
    +ReviewRepository
    +AmenityRepository
  }
  class Database
}

APIControllers --> HBnBFacade : calls use-cases
Services --> HBnBFacade : optional service layer
HBnBFacade --> Repositories : CRUD operations
Repositories --> Database : persistence


Notes

The Presentation layer should not access repositories directly.
The Facade centralizes use-cases and hides internal complexity.
Persistence is abstracted behind repositories, enabling DB swaps later.


4) Business Logic Layer — Detailed Class Diagram

Goal: define entities, core fields, and relationships.

KEY RELATIONSHIPS

* A User owns many Places (1..*)
* A Place has many Reviews (1..*)
* A User writes many Reviews (1..*)
* Place and Amenity are many-to-many




Notes / Business Rules Reflected

* Each entity inherits id, created_at, updated_at.
* Place.owner is represented by the User 1 --> * Place association.
* Review must always be linked to both a User and a Place.
* Place <-> Amenity is many-to-many (often a join table in persistence later).

5) Sequence Diagrams (API Calls)

The sequence diagrams show the flow between:
Client → Presentation → Facade (Business) → Repository (Persistence)

5.1 User Registration




5.2 Place Creation




5.3 Review Submission





5.4 Fetch List of Places






Notes

* The Presentation layer only orchestrates HTTP concerns (request/response).
* All domain decisions are centralized in the Facade + domain models.
* Repositories abstract storage and will later map to a real DB schema.

6) Data Persistence Notes (Part 3 Preview)

Persistence is intentionally abstract in Part 1.
Later (Part 3), repositories will be implemented with a chosen DB and ORM/queries:

* Entities map to tables
* Place <-> Amenity becomes a join table
* Foreign keys: place.owner_id, review.user_id, review.place_id

7) Summary

This document provides:

* A layered architecture blueprint using a Facade
* Domain models with clear relationships and audit fields
* API interaction flows via sequence diagrams

It serves as the foundation for implementation in later parts of the project.


AUTHORS 


● KEDIA IHOGOZA
● SOUMAYA BRAZI

HBnB Evolution - Holberton school
