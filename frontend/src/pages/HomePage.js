import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { placeAPI } from '../api';
import { FiMapPin, FiDollarSign, FiLoader } from 'react-icons/fi';

export const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ minPrice: 0, maxPrice: 10000 });

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await placeAPI.getAllPlaces();
        setPlaces(response.data);
      } catch (err) {
        const status = err.response?.status;
        const apiMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message;
        setError(`Failed to fetch places${status ? ` (${status})` : ''}: ${apiMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter(
    (place) => place.price >= filter.minPrice && place.price <= filter.maxPrice
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to HBnB</h1>
          <p className="text-xl opacity-90">Discover amazing places to stay around the world</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Places</h2>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                min="0"
                value={filter.minPrice}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    minPrice: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
                  })
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="$0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                value={filter.maxPrice}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    maxPrice: e.target.value === '' ? Number.MAX_SAFE_INTEGER : parseInt(e.target.value, 10),
                  })
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="$10000"
              />
            </div>
            <div className="flex items-end">
              <span className="text-sm text-gray-600">
                Showing {filteredPlaces.length} places
              </span>
            </div>
          </div>
        </div>

        {/* Places Grid */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <FiLoader className="animate-spin text-purple-600 text-4xl" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
        )}

        {!loading && filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No places found matching your criteria</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Link
              key={place.id}
              to={`/place/${place.id}`}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-48 flex items-center justify-center">
                <FiMapPin className="text-white text-6xl opacity-30" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600">
                  {place.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {place.description || 'Beautiful place to stay'}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-amber-500">
                    <FiDollarSign />
                    <span className="font-bold text-lg">{Number(place.price).toFixed(2)}/night</span>
                  </div>
                  <div className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    Host
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
