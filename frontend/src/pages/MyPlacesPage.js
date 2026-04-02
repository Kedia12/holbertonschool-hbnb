import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { placeAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiDollarSign, FiLoader } from 'react-icons/fi';

export const MyPlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const response = await placeAPI.getAllPlaces();
        // In a real app, would filter by current user
        setPlaces(response.data);
      } catch (err) {
        setError('Failed to fetch your places');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPlaces();
    }
  }, [token]);

  const handleDelete = async (placeId) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        // await placeAPI.deletePlace(placeId); // API call when endpoint is available
        setPlaces(places.filter(p => p.id !== placeId));
      } catch (err) {
        setError('Failed to delete place');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Places</h1>
          <Link
            to="/create-place"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold"
          >
            <FiPlus /> List New Place
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <FiLoader className="animate-spin text-purple-600 text-4xl" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {!loading && places.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't listed any places yet</p>
            <Link
              to="/create-place"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold"
            >
              <FiPlus /> Create Your First Listing
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-40 flex items-center justify-center">
                <FiMapPin className="text-white text-5xl opacity-30" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{place.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{place.description}</p>
                <div className="flex items-center gap-2 mb-4 text-purple-600 font-semibold">
                  <FiDollarSign /> {place.price}/night
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/place/${place.id}`}
                    className="flex-1 text-center bg-purple-100 text-purple-600 py-2 rounded-lg hover:bg-purple-200 font-medium"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => navigate(`/edit-place/${place.id}`)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 font-medium"
                  >
                    <FiEdit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(place.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 font-medium"
                  >
                    <FiTrash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
