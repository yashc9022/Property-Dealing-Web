import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Optional: Your custom CSS

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      alert('Both fields are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log(data); // Add this line to log the server response

      if (res.ok && data.token) {  // Check if token is returned
        // ✅ Save user info and token to localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));  // Save user data
        localStorage.setItem('token', data.token);  // Save token to localStorage

        alert('✅ Sign in successful!');
        navigate('/');
      } else {
        alert(`❌ Sign in failed: ${data.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
