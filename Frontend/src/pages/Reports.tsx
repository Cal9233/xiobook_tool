import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// For basic employee data
interface Employee {
    id: number;
    name: string;
    position: string;
}

// For detailed employee payment information
interface EmployeeInfo {
    date: string;
    gross_wages_per_week: string;
    fed_income_tax_wh: string;
    soc_sec: string;
    medicare: string;
    sdi: string;
    ca_pit_wh: string;
    ett: string;
    sui: string;
    futa_annual_er: string;
    net_wages: string;
}

// An employee with their detailed payment information
interface EmployeeWithInfo extends Employee {
    employee_info: EmployeeInfo[];
}

// For client data
interface ClientProps {
    client_id: number;
    client_name: string;
    company_name: string;
    phone_num: string;
    employee_list: EmployeeWithInfo[];
}

// For summary data in the reports
interface SummaryItem {
    period: string;
    gross_wages: number;
    fed_income_tax_wh: number;
    soc_sec: number;
    medicare: number;
    sdi: number;
    ca_pit_wh: number;
    net_wages: number;
}

const Reports = () => {
    const [client, setClient] = useState<ClientProps[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientProps | null>(null);
    const [employeeSummary, setEmployeeSummary] = useState<any[]>([]);
    const [summaryType, setSummaryType] = useState('monthly');
    const server_URI = process.env.REACT_APP_API_URL;

    const user = JSON.parse(localStorage.getItem('user') || "''");
    const userId = user.id;

    useEffect(() => {
        axios
          .get(`${server_URI}auth/reports/all/${userId}`)
          .then((result) => {
            if (result.data.Status) {
              setClient(result.data.data);
            } else {
              toast.error(result.data.Error);
            }
          })
          .catch((err) => toast.error("Error fetching data"));
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClientSelect = (clientId: number, type = summaryType) => {
        const selectedClientData = client.find(c => c.client_id === clientId || null);
        const safeSelectedClientData = selectedClientData === undefined ? null : selectedClientData;
        const employees = safeSelectedClientData ? safeSelectedClientData.employee_list : [];
        
        const aggregatedSummary = aggregateEmployeeData(employees, type);
        setSelectedClient(safeSelectedClientData);
        setEmployeeSummary(aggregatedSummary);
    };

    const aggregateEmployeeData = (employees: EmployeeWithInfo[], type: string) => {
        const periodGroups: Record<string, SummaryItem> = {};
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        employees.forEach(emp => {
            emp.employee_info.forEach(info => {
                const date = new Date(info.date);
                let period;
                
                if (type === 'monthly') {
                    period = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                } else if (type === "semi-monthly") {
                    const dayOfMonth = date.getDate();
                    const period1or2 = dayOfMonth <= 15 ? '1st part' : '2nd part';
                    period = `${monthNames[date.getMonth()]} ${period1or2} ${date.getFullYear()}`;
                } else if (type === 'quarterly') {
                    const quarter = Math.floor(date.getMonth() / 3) + 1;
                    period = `Q${quarter} ${date.getFullYear()}`;
                } else {
                    period = date.getFullYear().toString();
                }

                if (!periodGroups[period]) {
                    periodGroups[period] = {
                        period,
                        gross_wages: 0,
                        fed_income_tax_wh: 0,
                        soc_sec: 0,
                        medicare: 0,
                        sdi: 0,
                        ca_pit_wh: 0,
                        net_wages: 0
                    };
                }
    
                periodGroups[period].gross_wages += Number(info.gross_wages_per_week);
                periodGroups[period].fed_income_tax_wh += Number(info.fed_income_tax_wh);
                periodGroups[period].soc_sec += Number(info.soc_sec);
                periodGroups[period].medicare += Number(info.medicare);
                periodGroups[period].sdi += Number(info.sdi);
                periodGroups[period].ca_pit_wh += Number(info.ca_pit_wh);
                periodGroups[period].net_wages += Number(info.net_wages);
            });
        });
        
        const summaryArray = Object.values(periodGroups)
            .sort((a, b) => {
                if (type === 'semi-monthly') {
                    // Custom sorting for semi-monthly periods
                    const [monthA, periodA, yearA] = a.period.split(' ');
                    const [monthB, periodB, yearB] = b.period.split(' ');
                    
                    const yearDiff = Number(yearA) - Number(yearB);
                    if (yearDiff !== 0) return yearDiff;
                    
                    const monthDiff = monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
                    if (monthDiff !== 0) return monthDiff;
                    
                    return Number(periodA) - Number(periodB);
                }
                return new Date(a.period).getTime() - new Date(b.period).getTime();
            });
        
        const totalRow = summaryArray.reduce((acc, curr) => ({
            period: `Total`,
            gross_wages: (acc.gross_wages || 0) + curr.gross_wages,
            fed_income_tax_wh: (acc.fed_income_tax_wh || 0) + curr.fed_income_tax_wh,
            soc_sec: (acc.soc_sec || 0) + curr.soc_sec,
            medicare: (acc.medicare || 0) + curr.medicare,
            sdi: (acc.sdi || 0) + curr.sdi,
            ca_pit_wh: (acc.ca_pit_wh || 0) + curr.ca_pit_wh,
            net_wages: (acc.net_wages || 0) + curr.net_wages
        }), {
            period: `Total`,
            gross_wages: 0,
            fed_income_tax_wh: 0,
            soc_sec: 0,
            medicare: 0,
            sdi: 0,
            ca_pit_wh: 0,
            net_wages: 0
        });
    
        return [...summaryArray, totalRow];
    };
    
    return (
        <div className="px-5 mt-3">
            <div className="d-flex justify-content-center">
                <h3>Client List and Reports</h3>
            </div>

            {/* Client Selection Dropdown */}
            <div className="mb-3">
                <select 
                    className="form-select" 
                    onChange={(e) => handleClientSelect(Number(e.target.value))}
                >
                    <option value="">Select a Client</option>
                    {client.map((c) => (
                        <option key={c.client_id} value={c.client_id}>
                            {c.client_name || c.company_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Summary Type Selection */}
            <div className="mb-3">
                <select 
                    className="form-select" 
                    value={summaryType}
                    onChange={(e) => {
                        const newType = e.target.value;
                        setSummaryType(e.target.value);
                        if (selectedClient) {
                            setTimeout(() => {
                                handleClientSelect(selectedClient.client_id, newType);
                            }, 0);
                        }
                    }}
                >
                    <option value="semi-monthly">Semi Monthly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                </select>
            </div>

            {/* Employee Summary Table */}
            {selectedClient && (
                    <div>
                        <h4>{selectedClient.client_name} - Employee Summary ({summaryType.charAt(0).toUpperCase() + summaryType.slice(1)})</h4>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Period</th>
                                    <th>Gross Wages</th>
                                    <th>Fed Income Tax</th>
                                    <th>Social Security</th>
                                    <th>Medicare</th>
                                    <th>S.D.I.</th>
                                    <th>C.P.I.T.</th>
                                    <th>Net Wages</th>
                                </tr>
                            </thead>
                            <tbody>
                            {employeeSummary.map((emp, index) => (
                                <tr key={index} className={index === employeeSummary.length - 1 ? 'table-primary fw-bold' : ''}>
                                    <td>{emp.period}</td>
                                    <td>${emp.gross_wages.toFixed(2)}</td>
                                    <td>${emp.fed_income_tax_wh.toFixed(2)}</td>
                                    <td>${emp.soc_sec.toFixed(2)}</td>
                                    <td>${emp.medicare.toFixed(2)}</td>
                                    <td>${emp.sdi.toFixed(2)}</td>
                                    <td>${emp.ca_pit_wh.toFixed(2)}</td>
                                    <td>${emp.net_wages.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

            <ToastContainer />
        </div>
    );
};

export default Reports;