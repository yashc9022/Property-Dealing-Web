import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is imported
import UserProperties from "./UserProperties";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the properties of the logged-in user
  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/properties/my-properties", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in header
          },
        });

        setProperties(response.data); // Update properties state
      } catch (error) {
        console.error("Error fetching properties:", error.response?.data || error.message);
      } finally {
        setLoading(false); // Stop loading after the fetch
      }
    };

    fetchUserProperties();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Properties</h1>
      {properties.length === 0 ? (
        <p>You have not uploaded any properties yet.</p>
      ) : (
        <UserProperties properties={properties} />
      )}
    </div>
  );
};

export default MyProperties;
