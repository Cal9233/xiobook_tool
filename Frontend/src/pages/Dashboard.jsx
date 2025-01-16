import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [newClientName, setNewClientName] = useState('');

  // Fetch all clients on component load
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddClient = async () => {
    if (!newClientName) return;

    try {
      const response = await axios.post('http://localhost:5000/api/clients', { name: newClientName });
      setClients([...clients, response.data]);
      setNewClientName('');
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleRemoveClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error('Error removing client:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="New Client Name"
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
        />
        <button onClick={handleAddClient}>Add Client</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>
                <button onClick={() => handleRemoveClient(client.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;