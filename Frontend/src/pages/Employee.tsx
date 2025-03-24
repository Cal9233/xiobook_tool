import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header/Header";
import GroupedTable from "../components/Table/GroupedTable";
import { TableColumn } from "../components/Table/Table";

interface ClientProps {
  client_id: number;
  name: string;
  company_name: string;
  ein: string;
  address: string;
  entity_corp: string;
  city: string;
  state: string;
  owner_address: string;
  phone_num: string;
}

interface EmployeeObj {
  client_id: number;
  employee_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  ssn: string;
  street_address: string;
  city: string;
  state: string;
  date_of_birth: string;
  hire_date: string;
  job_title: string;
  i9_date: string;
  w4_date: string;
  dependents: number;
  marital_status: string;
  employment_status: string;
}

interface EmployeeGroup {
  clientName: string;
  clientId: number;
  employees: EmployeeObj[];
}

interface GroupedEmployees {
  [key: number]: EmployeeGroup;
}

const EmployeeList = () => {
  const [groupedEmployees, setGroupedEmployees] = useState<Record<number, EmployeeGroup>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || "{}");
  const userId = user.id;
  const server_URI = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employeesResponse = await axios.get(`${server_URI}auth/employees/all/${userId}`);
        const clientsResponse = await axios.get(`${server_URI}auth/clients/all/${userId}`);
        
        if (employeesResponse.data.Status && clientsResponse.data.Status) {
          const initialGroups: Record<number, EmployeeGroup> = {};
          
          clientsResponse.data.Result.forEach((client: ClientProps) => {
            initialGroups[client.client_id] = {
              clientName: client.name || client.company_name,
              clientId: client.client_id,
              employees: []
            };
          });
          
          employeesResponse.data.Result.forEach((employee: EmployeeObj) => {
            const clientId = employee.client_id;
            if (initialGroups[clientId]) {
              initialGroups[clientId].employees.push(employee);
            }
          });
          
          setGroupedEmployees(initialGroups);
          setError(null);
        } else {
          setError('Failed to fetch data');
          toast.error('Failed to fetch data');
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Error loading employees');
        toast.error("Error loading employees");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleDelete = async (id: number, employeeName: string) => {
    try {
      if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
        const result = await axios.delete(`${server_URI}auth/delete_employee/${id}`);
        
        if (result.data.Status) {
          // Create new object with the employee removed
          const updatedGroups: Record<number, EmployeeGroup> = {};
          
          // Loop through each client group
          Object.entries(groupedEmployees).forEach(([clientId, clientData]) => {
            updatedGroups[Number(clientId)] = {
              ...clientData,
              employees: clientData.employees.filter((emp: EmployeeObj) => emp.employee_id !== id)
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

  const handleEmployeePayments = async (employeeId: number) => {
    try {
      const response = await axios.get(`${server_URI}auth/employee_info/${employeeId}`);
      
      if (response.data.Status && response.data.Result) {
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
  
  const employeeColumns: TableColumn<EmployeeObj>[] = [
    {
      header: 'Name',
      accessor: (employee) => `${employee.first_name} ${employee.middle_name ? employee.middle_name + ' ' : ''}${employee.last_name}`
    },
    {
      header: 'Actions',
      accessor: (employee) => (
        <div className="d-flex gap-2">
          <Link
            to={`/dashboard/edit_employee/${employee.employee_id}`}
            className="btn btn-outline-primary btn-sm"
          >
            Edit
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(employee.employee_id, `${employee.first_name} ${employee.last_name}`);
            }}
            className="btn btn-outline-danger btn-sm"
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEmployeePayments(employee.employee_id);
            }}
            className="btn btn-outline-success btn-sm"
          >
            Employee Payments
          </button>
          <Link
            to={`/dashboard/employeeform/${employee.employee_id}`}
            className="btn btn-outline-secondary btn-sm"
          >
            Add Wages
          </Link>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Header variant="h2">Employee List by Client</Header>
      </div>

      <GroupedTable<EmployeeObj, EmployeeGroup, number>
        groupedData={groupedEmployees}
        columns={employeeColumns}
        keyField="employee_id"
        groupingConfig={{
          groupKey: 'clientId',
          groupLabel: 'clientName',
          itemsKey: 'employees',
          emptyGroupMessage: 'No employees yet',
          groupActions: (group) => (
            <Link 
              to="/dashboard/add_employee"
              state={{ clientId: group.clientId }}
              className="btn btn-success btn-sm"
            >
              Add Employee
            </Link>
          )
        }}
        onRowClick={(employee) => {
          // Optional: navigate to employee details
          // navigate(`/dashboard/employee/${employee.employee_id}`);
        }}
      />
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default EmployeeList;