import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AddProperty from './pages/AddProperty';
import MyProperties from './pages/MyProperties';
import ProfilePage from './pages/ProfilePage';
import UserProperties from './pages/UserProperties';
import PropertyDetailPage from './pages/PropertyDetailPage'; // Import PropertyDetailPage
import PropertyDetails from './pages/PropertyDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user-properties" element={<UserProperties />} />
          <Route path="/property/:propertyId" element={<PropertyDetailPage />} /> {/* Corrected property detail route */}
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
