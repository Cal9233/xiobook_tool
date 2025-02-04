import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
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
  });
  //const user = JSON.parse(localStorage.getItem('user'))
  //let userId = user.id
  const location = useLocation();
  const clientId = location.state?.clientId;
  const navigate = useNavigate()
  const server_URI = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with data: ", employee); // Debugging log
    axios
      .post(`${server_URI}auth/add_employee/${clientId}`, employee)
      .then(result => {
          console.log("API Response: ", result); // Log the result to check the response structure
          
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
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="first_name" className="form-label">First Name</label>
            <div className="d-flex align-items-center">
              <input
                  type="text"
                  className="form-control rounded-0"
                  id="first_name"
                  name="first_name"
                  maxLength="100"
                  value={employee.first_name}
                  onChange={(e) => setEmployee({
                    ...employee,
                    first_name: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="middle_name" className="form-label">Middle Name</label>
            <div className="d-flex align-items-center">
              <input
                  type="text"
                  className="form-control rounded-0"
                  id="middle_name"
                  name="middle_name"
                  maxLength="100"
                  value={employee.middle_name}
                  onChange={(e) => setEmployee({
                    ...employee,
                    middle_name: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <div className="d-flex align-items-center">
              <input
                  type="text"
                  className="form-control rounded-0"
                  id="last_name"
                  name="last_name"
                  maxLength="100"
                  value={employee.last_name}
                  onChange={(e) => setEmployee({
                    ...employee,
                    last_name: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="ssn" className="form-label">SSN</label>
            <div className="d-flex align-items-center">
              <input
                  type="text"
                  className="form-control rounded-0"
                  id="ssn"
                  name="ssn"
                  maxLength="11"
                  value={employee.ssn}
                  onChange={(e) => setEmployee({
                    ...employee,
                    ssn: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="street_address" className="form-label">Street Address</label>
            <div className="d-flex align-items-center">
              <input
                  type="text"
                  className="form-control rounded-0"
                  id="street_address"
                  name="street_address"
                  maxLength="255"
                  value={employee.street_address}
                  onChange={(e) => setEmployee({
                    ...employee,
                    street_address: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="city" className="form-label">City</label>
            <div className="d-flex align-items-center">
              <input
                  type="text"
                  className="form-control rounded-0"
                  id="city"
                  name="city"
                  maxLength="100"
                  value={employee.city}
                  onChange={(e) => setEmployee({
                    ...employee,
                    city: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="state" className="form-label">State</label>
            <div className="d-flex align-items-center">
              <input
                  type="text"
                  className="form-control rounded-0"
                  id="state"
                  name="state"
                  maxLength="2"
                  value={employee.state}
                  onChange={(e) => setEmployee({
                    ...employee,
                    state: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
            <div className="d-flex align-items-center">
              <input
                  type="date"
                  className="form-control rounded-0"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={employee.date_of_birth}
                  onChange={(e) => setEmployee({
                    ...employee,
                    date_of_birth: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="hire_date" className="form-label">Hire Date</label>
            <div className="d-flex align-items-center">
              <input
                  type="date"
                  className="form-control rounded-0"
                  id="hire_date"
                  name="hire_date"
                  value={employee.hire_date}
                  onChange={(e) => setEmployee({
                    ...employee,
                    hire_date: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="job_title" className="form-label">Job Title</label>
            <div className="d-flex align-items-center">
              <input
                  type="text"
                  className="form-control rounded-0"
                  id="job_title"
                  name="job_title"
                  maxLength="255"
                  value={employee.job_title}
                  onChange={(e) => setEmployee({
                    ...employee,
                    job_title: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="i9_date" className="form-label">I-9 Date</label>
            <div className="d-flex align-items-center">
              <input
                  type="date"
                  className="form-control rounded-0"
                  id="i9_date"
                  name="i9_date"
                  value={employee.i9_date}
                  onChange={(e) => setEmployee({
                    ...employee,
                    i9_date: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="w4_date" className="form-label">W-4 Date</label>
            <div className="d-flex align-items-center">
              <input
                  type="date"
                  className="form-control rounded-0"
                  id="w4_date"
                  name="w4_date"
                  value={employee.w4_date}
                  onChange={(e) => setEmployee({
                    ...employee,
                    w4_date: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="dependents" className="form-label">Dependents</label>
            <div className="d-flex align-items-center">
              <input
                  type="number"
                  min={0}
                  className="form-control rounded-0"
                  id="dependents"
                  name="dependents"
                  value={employee.dependents}
                  onChange={(e) => setEmployee({
                    ...employee,
                    dependents: e.target.value
                  })}
              />
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="marital_status" className="form-label">Marital Status</label>
            <div className="d-flex align-items-center">
              <select
                  className="form-control rounded-0"
                  id="marital_status"
                  name="marital_status"
                  value={employee.marital_status}
                  onChange={(e) => setEmployee({
                    ...employee,
                    marital_status: e.target.value
                  })}
              >
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married_jointly">Married Jointly</option>
                  <option value="married_separately">Married Separately</option>
                  <option value="head_of_household">Head of Household</option>
              </select>
            </div>
        </div>
        <div className="col-12">
            <label htmlFor="employment_status" className="form-label">Employment Status</label>
            <div className="d-flex align-items-center">
              <select
                  className="form-control rounded-0"
                  id="employment_status"
                  name="employment_status"
                  value={employee.employment_status}
                  onChange={(e) => setEmployee({
                    ...employee,
                    employment_status: e.target.value
                  })}
              >
                  <option value="">Select</option>
                  <option value="full_time">Full-Time</option>
                  <option value="part_time">Part-Time</option>
                  <option value="temporary">Temporary</option>
              </select>
            </div>
        </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddEmployee;