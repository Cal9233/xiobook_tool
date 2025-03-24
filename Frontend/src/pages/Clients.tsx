import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header/Header";
import Table, { TableColumn } from "../components/Table/Table";

interface ClientProps {
  client_id: number;
  name: string;
  company_name: string;
  phone_num: string;
}

const Client = () => {
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const user = JSON.parse(localStorage.getItem('user') || "{}");
  const userId = user.id;
  const server_URI = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const result = await axios.get(`${server_URI}auth/clients/all/${userId}`);
        
        if (result.data.Status) {
          setClients(result.data.Result);
          setError(null);
        } else {
          setError(result.data.Error || 'Failed to fetch clients');
          toast.error(result.data.Error || 'Failed to fetch clients');
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError('An error occurred while fetching clients');
        toast.error('An error occurred while fetching clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number, clientName: string) => {
    if (window.confirm(`Are you sure you want to delete ${clientName}? This will also delete all associated employees.`)) {
      try {
        const result = await axios.delete(`${server_URI}auth/delete_client/${id}`);
        
        if (result.data.Status) {
          setClients(prevClients => prevClients.filter(c => c.client_id !== id));
          toast.success('Client successfully deleted!');
        } else {
          toast.error(result.data.Error || 'Failed to delete client');
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error('An error occurred while deleting the client');
      }
    }
  };


  const columns: TableColumn<ClientProps>[] = [
    {
      header: 'Name',
      accessor: 'name'
    },
    {
      header: 'Company Name',
      accessor: 'company_name'
    },
    {
      header: 'Contact Number',
      accessor: 'phone_num'
    },
    {
      header: 'Actions',
      accessor: (client) => (
        <div className="btn-group" role="group">
          <Link
            to={`/dashboard/edit_client/${client.client_id}`}
            className="btn btn-outline-primary btn-sm"
          >
            Edit
          </Link>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              handleDelete(client.client_id, client.name);
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Header className="text-center" variant="h3">Client List</Header>
        <Link to="/dashboard/add_client" className="btn btn-success">
          Add Client
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : clients.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No clients found. Click "Add Client" to create your first client.
        </div>
      ) : (
        <div className="table-responsive">
          <Table<ClientProps>
            data={clients}
            columns={columns}
            keyField="client_id"
            isLoading={loading}
            error={error}
            emptyMessage="No clients found. Click 'Add Client' to create your first client."
            onRowClick={(client) => {
              // Optional: navigate to client details or perform other action on row click
              // navigate(`/dashboard/client/${client.client_id}`);
            }}
          />
        </div>
      )}
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Client;