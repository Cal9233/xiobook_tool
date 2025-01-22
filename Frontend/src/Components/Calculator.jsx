import React from 'react';
import { useLocation } from 'react-router-dom';

const Calculator = () => {
  const location = useLocation();
  const employeeInfo = location.state?.employeeInfo;

  if (!employeeInfo) {
    return <div>No employee information available</div>;
  }

  // Function to format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Function to format percentages
  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Employee Wage Calculator</h1>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Pay Period: {new Date(employeeInfo.date).toLocaleDateString()}</h5>
          <h6 className="mb-0">Check Number: {employeeInfo.check_number}</h6>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gross Wages (Weekly)</td>
                <td className="text-end">{formatCurrency(employeeInfo.gross_wages_per_week)}</td>
              </tr>
              <tr>
                <td>Federal Income Tax Withholding</td>
                <td className="text-end">{formatCurrency(employeeInfo.fed_income_tax_wh)}</td>
              </tr>
              <tr>
                <td>California PIT Withholding</td>
                <td className="text-end">{formatCurrency(employeeInfo.ca_pit_wh)}</td>
              </tr>
              <tr>
                <td>Social Security (6.2%)</td>
                <td className="text-end">{formatCurrency(employeeInfo.soc_sec)}</td>
              </tr>
              <tr>
                <td>Medicare (1.45%)</td>
                <td className="text-end">{formatCurrency(employeeInfo.medicare)}</td>
              </tr>
              <tr>
                <td>State Disability Insurance (SDI)</td>
                <td className="text-end">{formatCurrency(employeeInfo.sdi)}</td>
              </tr>
              <tr>
                <td>State Unemployment Insurance (SUI)</td>
                <td className="text-end">{formatCurrency(employeeInfo.sui)}</td>
              </tr>
              <tr>
                <td>Employment Training Tax (ETT)</td>
                <td className="text-end">{formatCurrency(employeeInfo.ett)}</td>
              </tr>
              <tr>
                <td>Federal Unemployment Tax (FUTA)</td>
                <td className="text-end">{formatCurrency(employeeInfo.futa_annual_er)}</td>
              </tr>
              <tr className="table-primary">
                <th>Net Wages</th>
                <td className="text-end fw-bold">{formatCurrency(employeeInfo.net_wages)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calculator;