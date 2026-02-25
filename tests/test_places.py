import unittest
from app import create_app

class TestPlaceEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_get_places(self):
        response = self.client.get('/api/v1/places/')
        self.assertEqual(response.status_code, 200)

    def test_create_place_invalid_price(self):
        response = self.client.post('/api/v1/places/', json={
            "title": "Maison",
            "price": -10,
            "latitude": 45,
            "longitude": 2,
            "owner": "fake_id"
        })
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()