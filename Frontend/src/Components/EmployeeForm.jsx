import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    gross_wages_per_week: "",
    fed_income_tax_wh: "",
    ca_pit_wh: "",
  });
  let {employeeId} = useParams()
  let navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Calculate the values first
      const soc_sec = (formData.gross_wages_per_week * 0.062) >= 168600 ? 0 : (formData.gross_wages_per_week * 0.062);
      const medicare = formData.gross_wages_per_week * 0.0145;
      const sdi = formData.gross_wages_per_week * 0.011;
      const net_wages = formData.gross_wages_per_week - 
                      formData.fed_income_tax_wh - 
                      soc_sec - 
                      medicare - 
                      formData.ca_pit_wh - 
                      sdi;
      const futa_annual_er = formData.gross_wages_per_week * 0.006;
      const sui = formData.gross_wages_per_week * 0.026;
      const ett = formData.gross_wages_per_week * 0.01;
      const check_number = employeeId;
      const formattedDate = new Date(formData.date).toISOString().split('T')[0];
  
      // Create the complete data object
      const completeFormData = {
        ...formData,
        date: formattedDate, 
        check_number,
        sdi,
        sui,
        ett,
        futa_annual_er,
        soc_sec,
        medicare,
        net_wages
      };
  
      // Send the complete data in the POST request
      const result = await axios.post(
        `http://localhost:1337/auth/add_employee_info/${employeeId}`, 
        completeFormData
      );
      
      if (result.data.Status === true) {
        toast.success('Employee added successfully!');
        // Navigate to Calculator with the complete data
        navigate(`/dashboard/calculator/${employeeId}`, {
          state: { employeeInfo: completeFormData }
        });
      } else {
        toast.error(result.data.Error || 'An unknown error occurred!');
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Employee Form</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="grossWages" className="form-label">
              Gross Wages per Week:
            </label>
            <input
              type="number"
              step="0.01"
              className="form-control rounded-0"
              id="grossWages"
              name="gross_wages_per_week"
              placeholder="Enter Gross Wages"
              value={formData.gross_wages_per_week}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="federalTax" className="form-label">
              Federal Income Tax Withholding:
            </label>
            <input
              type="number"
              step="0.01"
              className="form-control rounded-0"
              id="federalTax"
              name="fed_income_tax_wh"
              placeholder="Enter Federal Income Tax"
              value={formData.fed_income_tax_wh}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="caPit" className="form-label">
              California PIT Withholding:
            </label>
            <input
              type="number"
              step="0.01"
              className="form-control rounded-0"
              id="caPit"
              name="ca_pit_wh"
              placeholder="Enter CA PIT Withholding"
              value={formData.ca_pit_wh}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Calculate
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeForm;