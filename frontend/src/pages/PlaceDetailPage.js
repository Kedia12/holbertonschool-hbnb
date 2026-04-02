import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { placeAPI, reviewAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { FiMapPin, FiDollarSign, FiStar, FiArrowLeft, FiEdit2, FiTrash2, FiLoader } from 'react-icons/fi';

export const PlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      try {
        const response = await placeAPI.getPlace(id);
        setPlace(response.data);
        // Mock reviews - in real app would fetch from API
        setReviews([
          {
            id: '1',
            user_id: 'user1',
            text: 'Amazing place! Very clean and comfortable.',
            rating: 5,
          },
          {
            id: '2',
            user_id: 'user2',
            text: 'Good location, friendly host.',
            rating: 4,
          },
        ]);
      } catch (err) {
        setError('Failed to load place details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await reviewAPI.createReview({
        place_id: id,
        text: newReview.text,
        rating: newReview.rating,
      });
      setNewReview({ text: '', rating: 5 });
      // Refetch reviews
      setReviews([
        ...reviews,
        {
          id: Date.now().toString(),
          user_id: 'current_user',
          text: newReview.text,
          rating: newReview.rating,
        },
      ]);
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FiLoader className="animate-spin text-purple-600 text-4xl" />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
        >
          <FiArrowLeft /> Back to Places
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
      </div>
    );
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <FiArrowLeft /> Back to Places
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-96 flex items-center justify-center">
            <FiMapPin className="text-white text-8xl opacity-20" />
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.title}</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <FiMapPin /> Lat: {place.latitude}, Lon: {place.longitude}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600 flex items-center gap-1">
                  <FiDollarSign /> {place.price}
                </div>
                <p className="text-gray-600">/night</p>
              </div>
            </div>

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {place.description || 'No description provided'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2 mt-2">
                  <FiStar className="text-amber-500" />
                  <span className="text-2xl font-bold">{avgRating}</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Owner ID</p>
                <p className="text-xl font-semibold text-gray-900 mt-2">{place.owner_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>

          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="mb-8 pb-8 border-b">
              <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                  <textarea
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                    rows="4"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user_id[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.user_id}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <FiStar key={i} className="text-amber-500 fill-amber-500" size={16} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-12">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
