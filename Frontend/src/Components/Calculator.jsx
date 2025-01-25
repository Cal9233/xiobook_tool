import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Calculator = () => {
  const location = useLocation();
  const [expandedPeriod, setExpandedPeriod] = useState(null);
  const [showERTaxesByPeriod, setShowERTaxesByPeriod] = useState({});
  const employeeInfo = location.state?.employeeInfo || null;
  
  if (!employeeInfo) {
    return <div>No employee information available</div>;
  }
  
  // Wrap employeeInfo in an array for mapping
  const payPeriods = employeeInfo;

  if (payPeriods.length === 0) {
    return <div>No employee information available</div>;
  }

// Function to format currency values
const formatCurrency = (value) => {
  const numericValue = parseFloat(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numericValue || 0);
};
  // Toggle ER taxes for a specific pay period
  const toggleERTaxes = (index) => {
    setShowERTaxesByPeriod(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Employee Wage Calculator</h1>
      {payPeriods.map((employeeInfo, index) => {
        // Employer-related taxes rows
        const erTaxRows = [
          {
            description: 'State Unemployment Insurance (SUI)',
            amount: employeeInfo?.sui || 0
          },
          {
            description: 'Employment Training Tax (ETT)',
            amount: employeeInfo?.ett || 0
          },
          {
            description: 'Federal Unemployment Tax (FUTA)',
            amount: employeeInfo?.futa_annual_er || 0
          }
        ];

        return (
          <div key={index} className="card mb-3">
            <div 
              className="card-header d-flex justify-content-between align-items-center"
              onClick={() => setExpandedPeriod(expandedPeriod === index ? null : index)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <h5 className="mb-0">
                  Pay Period: {new Date(employeeInfo.date).toLocaleDateString()}
                </h5>
                <h6 className="mb-0">Check Number: {employeeInfo.check_number}</h6>
              </div>
              <div className="d-flex align-items-center">
                <button 
                  className={`btn btn-sm me-2 ${showERTaxesByPeriod[index] ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleERTaxes(index);
                  }}
                >
                  ER
                </button>
                {expandedPeriod === index ? <ChevronDown /> : <ChevronRight />}
              </div>
            </div>

            {expandedPeriod === index && (
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

                    {showERTaxesByPeriod[index] && erTaxRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.description}</td>
                        <td className="text-end">{formatCurrency(row.amount)}</td>
                      </tr>
                    ))}

                    <tr className="table-primary">
                      <th>Net Wages</th>
                      <td className="text-end fw-bold">{formatCurrency(employeeInfo.net_wages)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Calculator;