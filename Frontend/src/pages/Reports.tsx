import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table, { TableColumn } from '../components/Table/Table';

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
    isTotal?: boolean;
}

const Reports = () => {
    const [client, setClient] = useState<ClientProps[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientProps | null>(null);
    const [employeeSummary, setEmployeeSummary] = useState<SummaryItem[]>([]);
    const [summaryType, setSummaryType] = useState('monthly');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const server_URI = process.env.REACT_APP_API_URL;

    const user = JSON.parse(localStorage.getItem('user') || "''");
    const userId = user.id;

    useEffect(() => {
        setIsLoading(true);
        axios
          .get(`${server_URI}auth/reports/all/${userId}`)
          .then((result) => {
            if (result.data.Status) {
              setClient(result.data.data);
            } else {
              setError(result.data.Error);
              toast.error(result.data.Error);
            }
            setIsLoading(false);
          })
          .catch((err) => {
            setError("Error fetching data");
            toast.error("Error fetching data");
            setIsLoading(false);
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClientSelect = (clientId: number, type = summaryType) => {
        if (!clientId) {
            setSelectedClient(null);
            setEmployeeSummary([]);
            return;
        }

        setIsLoading(true);
        const selectedClientData = client.find(c => c.client_id === clientId) || null;
        const employees = selectedClientData ? selectedClientData.employee_list : [];
        
        try {
            const aggregatedSummary = aggregateEmployeeData(employees, type);
            setSelectedClient(selectedClientData);
            setEmployeeSummary(aggregatedSummary);
            setError(null);
        } catch (err) {
            setError("Error processing report data");
            toast.error("Error processing report data");
        }
        setIsLoading(false);
    };

    const aggregateEmployeeData = (employees: EmployeeWithInfo[], type: string): SummaryItem[] => {
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
                    
                    return periodA === '1st part' ? -1 : 1;
                }
                
                if (type === 'quarterly') {
                    const [quarterA, yearA] = a.period.split(' ');
                    const [quarterB, yearB] = b.period.split(' ');
                    
                    const yearDiff = Number(yearA) - Number(yearB);
                    if (yearDiff !== 0) return yearDiff;
                    
                    return quarterA.localeCompare(quarterB);
                }
                
                // For monthly and annually
                return a.period.localeCompare(b.period);
            });
        
        // Calculate the total row
        const totalRow: SummaryItem = {
            period: 'Total',
            gross_wages: summaryArray.reduce((sum, row) => sum + row.gross_wages, 0),
            fed_income_tax_wh: summaryArray.reduce((sum, row) => sum + row.fed_income_tax_wh, 0),
            soc_sec: summaryArray.reduce((sum, row) => sum + row.soc_sec, 0),
            medicare: summaryArray.reduce((sum, row) => sum + row.medicare, 0),
            sdi: summaryArray.reduce((sum, row) => sum + row.sdi, 0),
            ca_pit_wh: summaryArray.reduce((sum, row) => sum + row.ca_pit_wh, 0),
            net_wages: summaryArray.reduce((sum, row) => sum + row.net_wages, 0),
            isTotal: true
        };
    
        return [...summaryArray, totalRow];
    };

    // Define table columns for the summary table
    const summaryColumns: TableColumn<SummaryItem>[] = [
        {
            header: 'Period',
            accessor: 'period'
        },
        {
            header: 'Gross Wages',
            accessor: (row) => `$${row.gross_wages.toFixed(2)}`
        },
        {
            header: 'Fed Income Tax',
            accessor: (row) => `$${row.fed_income_tax_wh.toFixed(2)}`
        },
        {
            header: 'Social Security',
            accessor: (row) => `$${row.soc_sec.toFixed(2)}`
        },
        {
            header: 'Medicare',
            accessor: (row) => `$${row.medicare.toFixed(2)}`
        },
        {
            header: 'S.D.I.',
            accessor: (row) => `$${row.sdi.toFixed(2)}`
        },
        {
            header: 'C.P.I.T.',
            accessor: (row) => `$${row.ca_pit_wh.toFixed(2)}`
        },
        {
            header: 'Net Wages',
            accessor: (row) => `$${row.net_wages.toFixed(2)}`
        }
    ];

    // Custom row class names based on whether the row is a total row
    const getRowClassName = (row: SummaryItem): string => {
        return row.isTotal ? 'table-primary fw-bold' : '';
    };
    
    return (
        <div className="px-5 mt-3">
            <div className="d-flex justify-content-center mb-4">
                <h3>Client List and Reports</h3>
            </div>

            <div className="row mb-4">
                {/* Client Selection Dropdown */}
                <div className="col-md-6 mb-3">
                    <label htmlFor="clientSelect" className="form-label">Select Client</label>
                    <select 
                        id="clientSelect"
                        className="form-select" 
                        onChange={(e) => handleClientSelect(Number(e.target.value))}
                        disabled={isLoading}
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
                <div className="col-md-6 mb-3">
                    <label htmlFor="summaryType" className="form-label">Report Type</label>
                    <select 
                        id="summaryType"
                        className="form-select" 
                        value={summaryType}
                        onChange={(e) => {
                            const newType = e.target.value;
                            setSummaryType(newType);
                            if (selectedClient) {
                                setTimeout(() => {
                                    handleClientSelect(selectedClient.client_id, newType);
                                }, 0);
                            }
                        }}
                        disabled={isLoading || !selectedClient}
                    >
                        <option value="semi-monthly">Semi Monthly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                    </select>
                </div>
            </div>

            {/* Employee Summary Table */}
            {selectedClient && (
                <div className="card shadow-sm">
                    <div className="card-header bg-light">
                        <h4 className="m-0">
                            {selectedClient.client_name || selectedClient.company_name} - Employee Summary ({summaryType.charAt(0).toUpperCase() + summaryType.slice(1)})
                        </h4>
                    </div>
                    <div className="card-body">
                        <Table
                            data={employeeSummary}
                            columns={summaryColumns}
                            keyField="period"
                            isLoading={isLoading}
                            error={error}
                            emptyMessage="No data available for the selected period"
                            tableClassName="table table-hover table-striped"
                            headerClassName="table-light"
                            rowClassName={getRowClassName}
                        />
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default Reports;