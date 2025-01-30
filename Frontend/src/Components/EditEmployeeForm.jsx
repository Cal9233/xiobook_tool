import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const EditEmployeeForm = () => {
    const location = useLocation();
    const employeeData = location.state?.employeeData;
    const [formData, setFormData] = useState({
        date: new Date(),
        gross_wages_per_week: "",
        fed_income_tax_wh: "",
        soc_sec: "",
        medicare: "",
        sdi: "",
        ca_pit_wh: "",
        ett: "",
        sui: "",
        futa_annual_er: "",
        net_wages: ""
    });
    const [editableFields, setEditableFields] = useState({
        date: false,
        gross_wages_per_week: false,
        fed_income_tax_wh: false,
        soc_sec: false,
        medicare: false,
        sdi: false,
        ca_pit_wh: false,
        ett: false,
        sui: false,
        futa_annual_er: false,
        net_wages: false
    });

    let {employeeId} = useParams();
    let navigate = useNavigate();
    let id = employeeId !== undefined ? employeeId : employeeData.id;

    const server_URI = process.env.REACT_APP_API_URL;
    useEffect(() => {
        // If we have data from navigation state, use it
        if (employeeData) {
            console.log('Using passed employee data:', employeeData);
            setFormData({
                date: employeeData.date,
                gross_wages_per_week: employeeData.gross_wages_per_week,
                fed_income_tax_wh: employeeData.fed_income_tax_wh,
                soc_sec: employeeData.soc_sec,
                medicare: employeeData.medicare,
                sdi: employeeData.sdi,
                ca_pit_wh: employeeData.ca_pit_wh,
                ett: employeeData.ett,
                sui: employeeData.sui,
                futa_annual_er: employeeData.futa_annual_er,
                net_wages: employeeData.net_wages
            });
        } else {
            // Fallback to API call if no data was passed
            console.log('No passed data, fetching from API');
            axios
            .get(`${server_URI}auth/employee_info/` + id)
            .then((result) => {
                console.log('API Response:', result.data);
                if(result.data.Status){
                    const data = result.data.Result[0];
                    console.log('Parsed Employee Data:', data);
                    setFormData({
                        date: data.date,
                        gross_wages_per_week: data.gross_wages_per_week,
                        fed_income_tax_wh: data.fed_income_tax_wh,
                        soc_sec: data.soc_sec,
                        medicare: data.medicare,
                        sdi: data.sdi,
                        ca_pit_wh: data.ca_pit_wh,
                        ett: data.ett,
                        sui: data.sui,
                        futa_annual_er: data.futa_annual_er,
                        net_wages: data.net_wages
                    });
                }
            })
            .catch((err) => {
                console.log('API Error:', err);
                toast.error('Error loading employee data');
            });
        }
    }, [id, employeeData]);
    
    const handleFieldChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const toggleEdit = (field) => {
        setEditableFields({ ...editableFields, [field]: !editableFields[field] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting form data:', formData); // Added console log
            const result = await axios.put(
                `${server_URI}auth/employee_info/${id}`, 
                formData
            );
            console.log('Submit response:', result.data); // Added console log
            
            if (result.data.Status === true) {
                toast.success('Employee updated successfully!');
                navigate('/dashboard/employee');
            } else {
                toast.error(result.data.Error || 'An unknown error occurred!');
            }
        } catch (err) {
            console.error("Submit Error:", err);
            toast.error('Something went wrong!');
        }
    };

    // CSS styles for the input groups
    const inputGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px'
    };

    const inputContainerStyle = {
        flex: 1
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Employee Form</h3>
                <form className="row g-3" onSubmit={handleSubmit}>
                    {Object.entries(formData).map(([field, value]) => {
                        if (field === 'date') return null; // Skip date field
                        
                        const labelMap = {
                            gross_wages_per_week: "Gross Wages per Week",
                            fed_income_tax_wh: "Federal Income Tax Withholding",
                            soc_sec: "Social Security",
                            medicare: "Medicare",
                            sdi: "State Disability Insurance",
                            ca_pit_wh: "California PIT Withholding",
                            ett: "Employment Training Tax",
                            sui: "State Unemployment Insurance",
                            futa_annual_er: "Federal Unemployment Tax",
                            net_wages: "Net Wages"
                        };

                        return (
                            <div className="col-12" key={field} style={inputGroupStyle}>
                                <div style={inputContainerStyle}>
                                    <label htmlFor={field} className="form-label">
                                        {labelMap[field]}:
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control rounded-0"
                                        id={field}
                                        name={field}
                                        placeholder={`Enter ${labelMap[field]}`}
                                        value={value}
                                        onChange={(e) => handleFieldChange(e, field)}
                                        disabled={!editableFields[field]}
                                    />
                                </div>
                                <div style={{ paddingTop: '30px' }}>
                                    <input
                                        type="checkbox"
                                        checked={editableFields[field]}
                                        onChange={() => toggleEdit(field)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                            Update
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditEmployeeForm;