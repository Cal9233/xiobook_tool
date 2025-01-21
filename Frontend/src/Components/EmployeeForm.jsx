import React, { useState } from "react";

const EmployeeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    gross_wages_per_week: "",
    fed_income_tax_wh: "",
    ca_pit_wh: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
    </div>
  );
};

export default EmployeeForm;