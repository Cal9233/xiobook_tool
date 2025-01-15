import React from 'react';

const ClientInfo = ({ data }) => {
  return (
    <div>
      <h2>Client Information</h2>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Business Type:</strong> {data.businessType}</p>
      <p><strong>Employee Count:</strong> {data.employees.length}</p>
    </div>
  );
};

export default ClientInfo;