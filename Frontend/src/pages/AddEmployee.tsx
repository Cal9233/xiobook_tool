import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { employeeFields } from "../utils/fieldconfig";
import Header from "../components/Header/Header";
import Form from "../components/Form/Form";

interface EmployeeData {
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

const AddEmployee = () => {
  const initialValues: EmployeeData = {
    first_name: "",
    middle_name: "",
    last_name: "",
    ssn: "",
    street_address: "",
    city: "",
    state: "",
    date_of_birth: "",
    hire_date: "",
    job_title: "",
    i9_date: "",
    w4_date: "",
    dependents: 0,
    marital_status: "",
    employment_status: ""
  };
  const location = useLocation();
  const clientId = location.state?.clientId;
  const navigate = useNavigate()
  const server_URI = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: EmployeeData) => {
    setLoading(true);
    try {
    
      console.log("Submitting form with data: ", values);
    axios
      .post(`${server_URI}auth/add_employee/${clientId}`, values)
      .then(result => {
        console.log("API Response: ", result);
          // Check the Status value carefully
          if (result.data.Status === true) {  // Compare with `true` directly
              toast.success('Employee added successfully!');
              setTimeout(() => {
                navigate('/dashboard/employee');
              }, 1000);
          } else {
            console.log('Error hit in else block');
            console.log('Error message: ', result.data.Error);
            toast.error(result.data.Error || 'An unknown error occurred!');
          }
      })
      .catch(err => {
        console.error("Error:", err); // Log any error to the console
        toast.error('Something went wrong!');
      });
    } catch (error) {
        console.error("Error:", error);
        toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <Header className="text-center" variant="h3">Add Employee</Header>
        <Form<EmployeeData>
          fields={employeeFields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={loading}
          className="row g-1"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddEmployee;