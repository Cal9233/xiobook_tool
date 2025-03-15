import React, { ChangeEvent, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormDataProps {
  date: Date;
  gross_wages_per_week: string;
  fed_income_tax_wh: string;
  ca_pit_wh: string;
}

interface EmployeeFormProps {
  onSubmit: (data: FormData) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormDataProps>({
    date: new Date(),
    gross_wages_per_week: "",
    fed_income_tax_wh: "",
    ca_pit_wh: "",
  });
  let {employeeId} = useParams();
  let navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || "" });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Calculate the values first
      const soc_sec = (Number(formData.gross_wages_per_week) * 0.062) >= 168600 ? 0 : (Number(formData.gross_wages_per_week) * 0.062);
      const medicare = (Number(formData.gross_wages_per_week) * 0.0145);
      const sdi = (Number(formData.gross_wages_per_week) * 0.012); // Update to new california laws
      const net_wages = (Number(formData.gross_wages_per_week) - 
                      (Number(formData.fed_income_tax_wh)) - 
                      soc_sec - 
                      medicare - 
                      (Number(formData.ca_pit_wh)) - 
                      sdi);
      const futa_annual_er = (Number(formData.gross_wages_per_week) * 0.006);
      const sui = (Number(formData.gross_wages_per_week) * 0.026);
      const ett = (Number(formData.gross_wages_per_week) * 0.01);
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
  
      
    const server_URI = process.env.REACT_APP_API_URL;

      // Send the complete data in the POST request
      const result = await axios.post(
        `${server_URI}auth/add_employee_info/${employeeId}`, 
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