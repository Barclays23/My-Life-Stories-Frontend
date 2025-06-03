import React from "react";
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="summary-card rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl mt-2">120</p>
        </div>
        <div className="summary-card rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Books</h2>
          <p className="text-2xl mt-2">45</p>
        </div>
        <div className="summary-card rounded-lg p-4">
          <h2 className="text-xl font-semibold">Payments</h2>
          <p className="text-2xl mt-2">$2,300</p>
        </div>
        <div className="summary-card rounded-lg p-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-2xl mt-2">8</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
