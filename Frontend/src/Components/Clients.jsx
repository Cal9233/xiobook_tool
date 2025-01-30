import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Client = () => {
  const [client, setClient] = useState([]);
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  let userId = user.id;
  const server_URI = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${server_URI}auth/clients/all/${userId}`)
      .then((result) => {
        if (result.data.Status) {
          setClient(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [client]);

  const handleDelete = (id, clientName) => {
    if (window.confirm(`Are you sure you want to delete ${clientName}? This will also delete all associated employees.`)) {
      axios.delete(`${server_URI}auth/delete_client/`+id)
      .then(result => {
          if(result.data.Status) {
              // Update the client list without reloading the page
              setClient(client.filter(c => c.client_id !== id));
              toast.success('Client successfully deleted!');
          } else {
              toast.error(result.data.Error);
          }
      })
      .catch(error => {
          toast.error('An error occurred while deleting the client');
      });
    }
  } 
  
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Client List</h3>
      </div>
      <Link to="/dashboard/add_client" className="btn btn-success">
        Add Client
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company Name</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {client.map((e) => (
              <tr key={e.client_id}>
                <td>{e.name}</td>
                <td>{e.company_name}</td>
                <td>{e.phone_num}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_client/${e.client_id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.client_id, e.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Client;