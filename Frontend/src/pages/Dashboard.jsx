import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [newClientName, setNewClientName] = useState("");

  // Fetch all clients on component load
  useEffect(() => {
    // Simulate an API call with dummy data
    const dummyClients = [
      { id: 1, name: "Client One" },
      { id: 2, name: "Client Two" },
      { id: 3, name: "Client Three" },
    ];
    setClients(dummyClients);
  }, []);

  const handleAddClient = () => {
    if (!newClientName) return;

    const newClient = {
      id: clients.length + 1,
      name: newClientName,
    };
    setClients([...clients, newClient]);
    setNewClientName("");
  };

  const handleRemoveClient = (id) => {
    setClients(clients.filter((client) => client.id !== id));
  };

  return (
    <div>
      <Box>
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
                  <button onClick={() => handleRemoveClient(client.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default Dashboard;
