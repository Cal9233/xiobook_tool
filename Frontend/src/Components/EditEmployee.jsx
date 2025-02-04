import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditEmployee = () => {
    const { id } = useParams()
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

    const [editableFields, setEditableFields] = useState({
      first_name: false,
      middle_name: false,
      last_name: false,
      ssn: false,
      street_address: false,
      city: false,
      state: false,
      date_of_birth: false,
      hire_date: false,
      job_title: false,
      i9_date: false,
      w4_date: false,
      dependents: false,
      marital_status: false,
      employment_status: false
    });

    const navigate = useNavigate()

    const server_URI = process.env.REACT_APP_API_URL;
    useEffect(() => {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

        axios.get(`${server_URI}auth/employee/${id}`)
            .then(result => {
                if (result.data.Status) {
                  let data = result.data.Result[0];
                  setEmployee({
                    first_name: data.first_name,
                    middle_name: data.middle_name,
                    last_name: data.last_name,
                    ssn: data.ssn,
                    street_address: data.street_address,
                    city: data.city,
                    state: data.state,
                    date_of_birth: formatDate(data.date_of_birth),
                    hire_date: formatDate(data.hire_date),
                    job_title: data.job_title,
                    i9_date: formatDate(data.i9_date),
                    w4_date: formatDate(data.w4_date),
                    dependents: data.dependents,
                    marital_status: data.marital_status,
                    employment_status: data.employment_status,
                  });
                }
            })
            .catch(err => console.log(err));
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${server_URI}auth/edit_employee/${id}`, employee)
            .then(result => {
                if (result.data.Status) {
                  toast.success('Client updated successfully!');
                  setTimeout(() => {
                    navigate('/dashboard/employee');
                  }, 1000);
                } else {
                    toast.error(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const toggleEdit = (field) => {
      setEditableFields({ ...editableFields, [field]: !editableFields[field] });
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Edit Employee</h3>
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
                              onChange={handleChange}
                              disabled={!editableFields.first_name}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.first_name}
                            onChange={() => toggleEdit('first_name')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.middle_name}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.middle_name}
                            onChange={() => toggleEdit('middle_name')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.last_name}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.last_name}
                            onChange={() => toggleEdit('last_name')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.ssn}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.ssn}
                            onChange={() => toggleEdit('ssn')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.street_address}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.street_address}
                            onChange={() => toggleEdit('street_address')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.city}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.city}
                            onChange={() => toggleEdit('city')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.state}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.state}
                            onChange={() => toggleEdit('state')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.date_of_birth}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.date_of_birth}
                            onChange={() => toggleEdit('date_of_birth')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.hire_date}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.hire_date}
                            onChange={() => toggleEdit('hire_date')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.job_title}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.job_title}
                            onChange={() => toggleEdit('job_title')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.i9_date}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.i9_date}
                            onChange={() => toggleEdit('i9_date')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.w4_date}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.w4_date}
                            onChange={() => toggleEdit('w4_date')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.dependents}
                          />
                          <input
                            type="checkbox"
                            checked={editableFields.dependents}
                            onChange={() => toggleEdit('dependents')}
                            className="ms-2"
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
                              onChange={handleChange}
                              disabled={!editableFields.marital_status}
                          >
                              <option value="">Select</option>
                              <option value="single">Single</option>
                              <option value="married_jointly">Married Jointly</option>
                              <option value="married_separately">Married Separately</option>
                              <option value="head_of_household">Head of Household</option>
                          </select>
                          <input
                            type="checkbox"
                            checked={editableFields.marital_status}
                            onChange={() => toggleEdit('marital_status')}
                            className="ms-2"
                          />
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
                              onChange={handleChange}
                              disabled={!editableFields.employment_status}
                          >
                              <option value="">Select</option>
                              <option value="full_time">Full-Time</option>
                              <option value="part_time">Part-Time</option>
                              <option value="temporary">Temporary</option>
                          </select>
                          <input
                            type="checkbox"
                            checked={editableFields.employment_status}
                            onChange={() => toggleEdit('employment_status')}
                            className="ms-2"
                          />
                        </div>
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                            Edit Employee
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditEmployee;
