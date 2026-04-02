-- seed.sql

PRAGMA foreign_keys = ON;

INSERT INTO users (
    id,
    first_name,
    last_name,
    email,
    password,
    is_admin
) VALUES (
    '36c9050e-ddd3-4c3b-9731-9f487208bbc1',
    'Admin',
    'HBnB',
    'admin@hbnb.io',
    '$2b$12$Wl9jwN9lH9lUZJEjAy527OpvlJO0QJ1MVTj2ir7BtvHIYKTqm9RJm',
    TRUE
);

INSERT INTO amenities (id, name) VALUES
('e2534720-c138-4ca5-a7f3-37409bf705b6', 'WiFi'),
('4e56164b-10ca-4f3c-9e82-d42d3d57f454', 'Swimming Pool'),
('9eb9fb6e-3636-4537-89d9-7f18621a34c4', 'Air Conditioning');
