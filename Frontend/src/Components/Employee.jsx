import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeList = () => {
  const [groupedEmployees, setGroupedEmployees] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;
  let navigate = useNavigate()

  useEffect(() => {
    fetchData();
  }, [userId]);

  // Move fetchData outside useEffect so we can reuse it if needed
  const fetchData = async () => {
    try {
      const employeesResponse = await axios.get(`http://localhost:1337/auth/employees/all/${userId}`);
      const clientsResponse = await axios.get(`http://localhost:1337/auth/clients/all/${userId}`);
      
      if (employeesResponse.data.Status && clientsResponse.data.Status) {
        const initialGroups = {};
        
        clientsResponse.data.Result.forEach(client => {
          initialGroups[client.client_id] = {
            clientName: client.name || client.company_name,
            clientId: client.client_id,
            employees: []
          };
        });
        
        employeesResponse.data.Result.forEach(employee => {
          const clientId = employee.client_id;
          if (initialGroups[clientId]) {
            initialGroups[clientId].employees.push(employee);
          }
        });
        
        setGroupedEmployees(initialGroups);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Error loading employees");
    }
  };

  const handleDelete = async (id, employeeName) => {
    try {
      if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
        const result = await axios.delete(`http://localhost:1337/auth/delete_employee/${id}`);
        
        if (result.data.Status) {
          // Create new object with the employee removed
          const updatedGroups = {};
          
          // Loop through each client group
          Object.entries(groupedEmployees).forEach(([clientId, clientData]) => {
            updatedGroups[clientId] = {
              ...clientData,
              employees: clientData.employees.filter(emp => emp.employee_id !== id)
            };
          });
          
          setGroupedEmployees(updatedGroups);
          toast.success('Employee successfully deleted!');
        } else {
          toast.error(result.data.Error);
        }
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee");
    }
  };

  const handleEmployeePayments = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:1337/auth/employee_info/${employeeId}`);
      
      if (response.data.Status && response.data.Result) {
        // Use React Router navigation instead of window.location
        navigate(`/dashboard/calculator/${employeeId}`, {
          state: { employeeInfo: response.data.Result }
        });
      } else {
        navigate(`/dashboard/employeeform/${employeeId}`);
      }
    } catch (error) {
      console.error("Error checking employee info:", error);
      toast.error("Error checking employee payments data");
    }
  };
  

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Employee List by Client</h2>
      </div>

      <div className="client-groups">
        {Object.entries(groupedEmployees).map(([clientId, { clientName, employees }]) => (
          <div key={clientId} className="card mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">{clientName}</h3>
                <Link 
                  to="/dashboard/add_employee"
                  state={{ clientId: clientId }}
                  className="btn btn-success btn-sm"
                >
                  Add Employee
                </Link>
              </div>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <tr key={employee.employee_id}>
                        <td>{employee.first_name} {employee.last_name}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/dashboard/edit_employee/${employee.employee_id}`}
                              className="btn btn-info btn-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(employee.employee_id, employee.first_name)}
                              className="btn btn-warning btn-sm"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleEmployeePayments(employee.employee_id)}
                              className="btn btn-sm"
                              style={{ backgroundColor: "#28a745", color: "white", border: "none" }}
                            >
                              Employee Payments
                            </button>
                            <Link
                              to={`/dashboard/employeeform/${employee.employee_id}`}
                              className="btn btn btn-sm"
                            >
                              Add Wages
                            </Link>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">No employees yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeList;