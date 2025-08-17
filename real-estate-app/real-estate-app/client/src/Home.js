import React from 'react';

function Home() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Available Properties</h2>
      <div className="grid grid-cols-3 gap-6">
        {/* Property Cards */}
        <div className="bg-white p-4 rounded shadow">
          <img src="https://via.placeholder.com/150" alt="Property" className="mb-4" />
          <h3 className="font-semibold ">Property Title</h3>
          <p className="text-sm">Location: City, State</p>
          <p className="font-bold">$200,000</p>
        </div>
        {/* Add more property cards as needed */}
      </div>
    </div>
  );
}

export default Home;
