import React, { useState, useEffect } from 'react';
import { amenityAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiAlertCircle } from 'react-icons/fi';

export const AdminAmenitiesPage = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAmenity, setNewAmenity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchAmenities = async () => {
      setLoading(true);
      try {
        const response = await amenityAPI.getAllAmenities();
        setAmenities(response.data);
      } catch (err) {
        setError('Failed to fetch amenities');
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  const handleAddAmenity = async (e) => {
    e.preventDefault();
    if (!newAmenity.trim()) return;

    setSubmitting(true);
    try {
      const response = await amenityAPI.createAmenity({ name: newAmenity });
      setAmenities([...amenities, response.data]);
      setNewAmenity('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create amenity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAmenity = async (amenityId) => {
    if (window.confirm('Delete this amenity?')) {
      try {
        // await amenityAPI.deleteAmenity(amenityId); // When endpoint available
        setAmenities(amenities.filter(a => a.id !== amenityId));
      } catch (err) {
        setError('Failed to delete amenity');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <FiAlertCircle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Admin Only</h2>
          <p className="text-gray-600">You need to be logged in as an admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Amenities</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Amenity</h2>
          <form onSubmit={handleAddAmenity} className="flex gap-2">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="e.g., WiFi, Pool, Kitchen..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold disabled:opacity-50"
            >
              <FiPlus /> Add
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <FiLoader className="animate-spin text-purple-600 text-4xl" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              {amenities.length === 0 ? (
                <p className="text-center text-gray-600">No amenities yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 flex justify-between items-center"
                    >
                      <span className="font-semibold text-gray-900">{amenity.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {/* edit handler */}}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAmenity(amenity.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
