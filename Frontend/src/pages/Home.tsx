import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table, { TableColumn }  from '../components/Table/Table';

interface AdminProps {
  name: string;
  client_id: number;
}

const Home = () => {
  const [clientTotal, setClientTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [admins, setAdmins] = useState<AdminProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setIsLoading(true);
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
      setIsLoading(false);
    })
    .catch(err => {
      console.log(err);
      setError('Failed to load client data');
      setIsLoading(false);
    })
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
    .catch((e) => {
      console.log(e);
      setError('Failed to load employee data');
    })
  }

  const handleEdit = (userId: number) => {
    navigate(`/dashboard/edit_client/${userId}`);
  }

  // Define table columns
  const columns: TableColumn<AdminProps>[] = [
    {
      header: 'Client Name',
      accessor: 'name',
    },
    {
      header: 'Action',
      accessor: (row) => (
        <>
          <button
            className="btn btn-info btn-sm me-2"
            onClick={() => handleEdit(row.client_id)}
          >
            Edit
          </button>
          <button
            className="btn btn-warning btn-sm"
          >
            Delete
          </button>
        </>
      ),
      id: 'actions',
    },
  ];

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
        <Table
          data={admins}
          columns={columns}
          keyField="client_id"
          isLoading={isLoading}
          error={error}
          emptyMessage="No clients available"
          tableClassName="table table-hover"
          headerClassName="table-light"
        />
      </div>
    </div>
  )
}

export default Home;