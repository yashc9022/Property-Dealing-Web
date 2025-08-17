import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddProperty.css';

const AddProperty = () => {
  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    images: [], // Store multiple images
    phone: '',
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setPropertyData((prev) => ({
      ...prev,
      images: Array.from(e.target.files), // Store multiple files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !propertyData.title ||
      !propertyData.description ||
      !propertyData.price ||
      !propertyData.address ||
      propertyData.images.length === 0 ||
      !propertyData.phone ||
      !propertyData.email
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', propertyData.title);
    formData.append('description', propertyData.description);
    formData.append('price', propertyData.price);
    formData.append('address', propertyData.address);
    formData.append('phone', propertyData.phone);  // Include phone
    formData.append('email', propertyData.email);  // Include email

    // Append each image file
    propertyData.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Property successfully added!');
        setTimeout(() => {
          navigate('/my-properties');
        }, 2000);
      } else {
        toast.error('Failed to add property: ' + data.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="add-property-container">
      <h2>Add Property</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={propertyData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Property Description"
          value={propertyData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={propertyData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={propertyData.address}
          onChange={handleChange}
          required
        />
        
        {/* Allow Multiple Image Upload */}
        <input
          type="file"
          name="images"
          multiple
          onChange={handleImageChange}
          required
        />
        
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={propertyData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={propertyData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Property</button>
      </form>
    </div>
  );
};

export default AddProperty;
