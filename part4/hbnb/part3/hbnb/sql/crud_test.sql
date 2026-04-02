-- crud_test.sql

PRAGMA foreign_keys = ON;

-- READ admin
SELECT id, email, is_admin
FROM users
WHERE email = 'admin@hbnb.io';

-- READ amenities
SELECT * FROM amenities;

-- INSERT a normal user
INSERT INTO users (
    id, first_name, last_name, email, password, is_admin
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'John',
    'Doe',
    'john@example.com',
    '$2b$12$Wl9jwN9lH9lUZJEjAy527OpvlJO0QJ1MVTj2ir7BtvHIYKTqm9RJm',
    FALSE
);

-- INSERT a place
INSERT INTO places (
    id, title, description, price, latitude, longitude, owner_id
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Nice Studio',
    'City center',
    80.00,
    43.6045,
    1.4440,
    '11111111-1111-1111-1111-111111111111'
);

-- INSERT a review
INSERT INTO reviews (
    id, text, rating, user_id, place_id
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Very good stay',
    5,
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222'
);

-- LINK place to amenity
INSERT INTO place_amenity (place_id, amenity_id) VALUES
('22222222-2222-2222-2222-222222222222', 'e2534720-c138-4ca5-a7f3-37409bf705b6');

-- VERIFY links
SELECT p.title, a.name
FROM places p
JOIN place_amenity pa ON p.id = pa.place_id
JOIN amenities a ON a.id = pa.amenity_id;

SELECT r.text, r.rating, u.email, p.title
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN places p ON r.place_id = p.id;

-- UPDATE place price
UPDATE places
SET price = 95.00,
    updated_at = CURRENT_TIMESTAMP
WHERE id = '22222222-2222-2222-2222-222222222222';

-- VERIFY update
SELECT id, title, price
FROM places
WHERE id = '22222222-2222-2222-2222-222222222222';

-- DELETE review
DELETE FROM reviews
WHERE id = '33333333-3333-3333-3333-333333333333';

-- VERIFY delete
SELECT * FROM reviews
WHERE id = '33333333-3333-3333-3333-333333333333';
