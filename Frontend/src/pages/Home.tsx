import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminProps {
  name: string;
  client_id: number;
}

const Home = () => {
  const [clientTotal, setClientTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [admins, setAdmins] = useState<AdminProps[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    employeeCount();
    AdminRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const server_URI = process.env.REACT_APP_API_URL;

  const AdminRecords = () => {
    let user = JSON.parse(localStorage.getItem('user') || "''")
    let userId = user.id
    axios.get(`${server_URI}auth/clients/all/${userId}`)
    .then(result => {
      if(result.data.Status) {
        setAdmins(result.data.Result)
        setClientTotal(result.data.Result.length)
      }
    })
    .catch(err => console.log(err))
  }

const employeeCount = () => {
  let user = JSON.parse(localStorage.getItem('user') || "''")
  let userId = user.id
  axios.get(`${server_URI}auth/employees/all/${userId}`)
  .then((result) => {
    if(result.data.Status){
      setEmployeeTotal(result.data.Result.length)
    }
  })
  .catch((e) => console.log(e))
}

  const handleEdit = (userId: number) => {
    navigate(`/dashboard/edit_client/${userId}`);
  }

  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Clients</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{clientTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
      </div>
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Clients</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              admins.map((a, i) => (
                <tr key={i}>
                  <td>{a.name}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(a.client_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-warning btn-sm" >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home;