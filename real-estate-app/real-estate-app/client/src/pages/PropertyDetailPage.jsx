import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PropertyDetailPage.css';

function PropertyDetail() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { propertyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please sign in to view property details.");
      setTimeout(() => navigate("/signin"), 2000);
      return;
    }

    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperty(response.data);
      } catch (error) {
        toast.error("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${propertyId}/reviews`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchPropertyDetails();
    fetchReviews();
  }, [propertyId, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/properties/${propertyId}/reviews`, {
        userName,
        rating,
        comment,
      });
      toast.success("Review added!");
      setUserName('');
      setRating(5);
      setComment('');

      // Refresh reviews
      const res = await axios.get(`http://localhost:5000/api/properties/${propertyId}/reviews`);
      setReviews(res.data);
    } catch (error) {
      toast.error("Failed to add review.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div className="property-detail-container">
      <ToastContainer />
      <h2>{property.title}</h2>

      <div className="property-images">
        {property.images?.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:5000/uploads/${image}`}
            alt={`View ${index + 1}`}
            className="property-image"
          />
        ))}
      </div>

      <div className="property-info">
        <p><strong>Description:</strong> {property.description}</p>
        <p><strong>Price:</strong> ₹{property.price}</p>
        <p><strong>Address:</strong> {property.address}</p>
      </div>

      {property.contact && (
        <div className="contact-info">
          <h3>Contact Details</h3>
          <p><strong>Phone:</strong> {property.contact.phone}</p>
          <p><strong>Email:</strong> {property.contact.email}</p>
        </div>
      )}

      {/* Review Form */}
      <div className="review-section">
        <h3>Leave a Review</h3>
        <form onSubmit={handleReviewSubmit} className="review-form">
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
            ))}
          </select>
          <textarea
            placeholder="Your review (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>

      {/* Show Reviews */}
      <div className="reviews-display">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first!</p>
        ) : (
          reviews.map((r, idx) => (
            <div key={idx} className="review-box">
              <strong>{r.userName}</strong> - {r.rating}★
              <p>{r.comment}</p>
              <small>{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PropertyDetail;
