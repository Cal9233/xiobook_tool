import React, { useState } from 'react';
import EmployeeDataForm from './EmployeeForm';

const Calculator = () => {
  const [results, setResults] = useState(null);

  const calculate = (data) => {
    const {
      gross_wages_per_week,
      fed_income_tax_wh,
      ca_pit_wh,
    } = data;

    const soc_sec_6_2_wh = gross_wages_per_week * 0.062;
    const medicare_1_45 = gross_wages_per_week * 0.0145;
    const sdi = gross_wages_per_week * 0.011;
    const net_wage =
      gross_wages_per_week -
      fed_income_tax_wh -
      soc_sec_6_2_wh -
      medicare_1_45 -
      ca_pit_wh -
      sdi;

    setResults({
      soc_sec_6_2_wh,
      medicare_1_45,
      sdi,
      net_wage,
    });
  };

  return (
    <div>
      <h1>Employee Wage Calculator</h1>
      <EmployeeDataForm onSubmit={calculate} />
      {results && (
        <div>
          <h2>Results:</h2>
          <p>Social Security (6.2%): ${results.soc_sec_6_2_wh.toFixed(2)}</p>
          <p>Medicare (1.45%): ${results.medicare_1_45.toFixed(2)}</p>
          <p>SDI (1.10%): ${results.sdi.toFixed(2)}</p>
          <p>Net Wage: ${results.net_wage.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Calculator;