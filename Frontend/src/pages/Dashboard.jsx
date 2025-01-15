import React, { useState } from 'react';
import axios from 'axios';
import ClientInfo from '../components/ClientInfo';
import EmployeeList from '../components/EmployeeList';

const Dashboard = () => {
  const [clientID, setClientID] = useState('');
  const [clientData, setClientData] = useState(null);

  const fetchClientData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clients/${clientID}`);
      setClientData(response.data);
    } catch (error) {
      console.error('Error fetching client data', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        type="text"
        placeholder="Enter Client ID"
        value={clientID}
        onChange={(e) => setClientID(e.target.value)}
      />
      <button onClick={fetchClientData}>Search</button>
      {clientData && (
        <>
          <ClientInfo data={clientData} />
          <EmployeeList employees={clientData.employees} />
        </>
      )}
    </div>
  );
};

export default Dashboard;