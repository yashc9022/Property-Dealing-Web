import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PropertyDetails.css';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/signin');
      return;
    }

    axios
      .get(`http://localhost:5000/api/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProperty(response.data);
      })
      .catch((err) => {
        console.error('Error fetching property:', err);
        setError('Failed to fetch property details');
      });
  }, [id, navigate]);

  if (error) return <div>{error}</div>;

  if (!property) return <div>Loading property...</div>;

  return (
    <div className="property-details-container">
      <h2>{property.title}</h2>

      <div className="property-images">
        {property.images.map((img, idx) => (
          <img
            key={idx}
            src={`http://localhost:5000/uploads/${img}`}
            alt={`property-${idx}`}
            className="property-image"
          />
        ))}
      </div>

      <div className="property-details">
        <p><strong>Description:</strong> {property.description}</p>
        <p><strong>Price:</strong> ₹{property.price}</p>
        <p><strong>Address:</strong> {property.address}</p>
        <p><strong>Phone:</strong> {property.contact?.phone}</p>
        <p><strong>Email:</strong> {property.contact?.email}</p>
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
}

export default PropertyDetails;
