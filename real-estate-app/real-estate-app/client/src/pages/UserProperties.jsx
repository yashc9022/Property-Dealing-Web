import React, { useState } from "react";
import axios from "axios";

const UserProperties = ({ properties }) => {
  const token = localStorage.getItem("token");

  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
  });

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Property deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("❌ Error deleting property:", error.response?.data || error.message);
      alert("Failed to delete property. Please try again.");
    }
  };

  const handleEditClick = (property) => {
    setEditingProperty(property._id);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price,
      address: property.address,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/properties/${editingProperty}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Property updated successfully!");
      setEditingProperty(null);
      window.location.reload();
    } catch (error) {
      console.error("❌ Error updating property:", error.response?.data || error.message);
      alert("Failed to update property. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
  };

  return (
    <div>
      <h2>My Listed Properties</h2>
      {properties.map((property) => (
        <div
          key={property._id}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "12px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {editingProperty === property._id ? (
            // ✏️ Edit Form
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                style={{ display: "block", marginBottom: "8px", width: "100%", padding: "8px" }}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                style={{ display: "block", marginBottom: "8px", width: "100%", padding: "8px" }}
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                style={{ display: "block", marginBottom: "8px", width: "100%", padding: "8px" }}
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                style={{ display: "block", marginBottom: "8px", width: "100%", padding: "8px" }}
              />

              {/* Update and Cancel Buttons */}
              <button
                onClick={handleUpdate}
                style={{
                  marginRight: "8px",
                  padding: "8px 12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#ccc",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            // 📄 Display Property Info
            <div>
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p><strong>Price:</strong> ${property.price}</p>
              <p><strong>Address:</strong> {property.address}</p>

              {/* Buttons */}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleEditClick(property)}
                  style={{
                    marginRight: "8px",
                    padding: "8px 12px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(property._id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserProperties;
