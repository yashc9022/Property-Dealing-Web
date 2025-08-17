import React from 'react';

function AddProperty() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Add a New Property</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Property Title" className="w-full p-2 border border-gray-300 rounded" />
        <input type="text" placeholder="Location" className="w-full p-2 border border-gray-300 rounded" />
        <input type="number" placeholder="Price" className="w-full p-2 border border-gray-300 rounded" />
        <input type="file" className="w-full p-2 border border-gray-300 rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Add Property</button>
      </form>
    </div>
  );
}

export default AddProperty;
