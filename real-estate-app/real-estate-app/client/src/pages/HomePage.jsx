import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HomePage.css';

function HomePage() {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearch = () => {
    const filtered = properties.filter((property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleAddPropertyClick = () => {
    if (!user) {
      toast.warning("Please sign in to add a property.");
      navigate("/signin");
    } else {
      navigate('/add-property');
    }
  };

  const handleUserIconClick = () => {
    if (!user) {
      toast.warning("Please sign in to view your properties.");
      navigate("/signin");
    } else {
      navigate('/my-properties');
    }
  };

  return (
    <div className="home-page-container">
      <ToastContainer />

      {/* Header */}
      <header className="header-bar">
        <div className="logo">🏠 GAPSY</div>
        <div className="header-actions">
          {user ? (
            <>
              <img
                src="/user logo.jpg"
                alt="User"
                className="user-icon"
                onClick={handleUserIconClick}
                title="My Properties"
              />
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup"><button className="auth-button">Sign Up</button></Link>
              <Link to="/signin"><button className="auth-button">Sign In</button></Link>
            </>
          )}
        </div>
      </header>

     {/* Search & Action Section */}
<section className="search-actions-section">
  <h1 className="page-title">Find Your Dream Home</h1>
  <p className="page-subtitle">Search luxury homes, modern villas, and more.</p>
  
  <div className="search-container">
    <input
      type="text"
      placeholder="Search properties..."
      value={searchTerm}
      onChange={handleSearchChange}
      list="property-suggestions"
    />
    <datalist id="property-suggestions">
      <option value="Chandrapur" />
      <option value="Wani" />
      <option value="Warora" />
      <option value="Nagpur" />
      <option value="Ballarshah" />
      <option value="Pune" />
    </datalist>

    <button onClick={handleSearch}>Search</button>
  </div>

  {user && (
    <button className="add-property-button" onClick={handleAddPropertyClick}>
      + Add Property
    </button>
  )}
</section>

      {/* Property List */}
      <section className="property-section">
        <h2>Available Properties</h2>
        <div className="properties-list">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property._id}
                className="property-card"
                onClick={() => {
                  if (user) {
                    navigate(`/property/${property._id}`);
                  } else {
                    toast.warn("Please sign in to view property details.");
                    setTimeout(() => navigate("/signin"), 2000);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={property.images && property.images.length > 0
                    ? `http://localhost:5000/uploads/${property.images[0]}`
                    : '/default-property.jpg'}
                  alt={property.title}
                  className="property-image"
                />
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p>{property.description}</p>
                  <p><strong>Price:</strong> ₹{property.price}</p>
                  <p><strong>Address:</strong> {property.address}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No properties match your search.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
