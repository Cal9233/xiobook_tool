import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

interface FormProps {
    date: Date;
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
};

interface FieldProps {
    date: boolean;
    gross_wages_per_week: boolean;
    fed_income_tax_wh: boolean;
    soc_sec: boolean;
    medicare: boolean;
    sdi: boolean;
    ca_pit_wh: boolean;
    ett: boolean;
    sui: boolean;
    futa_annual_er: boolean;
    net_wages: boolean;
}

const LABEL_MAP = {
    date: 'Date',
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

const EditEmployeeForm = () => {
    const location = useLocation();
    const employeeData = location.state?.employeeData;
    const [formData, setFormData] = useState<FormProps>({
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
    const [editableFields, setEditableFields] = useState<FieldProps>({
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, employeeData]);
    
    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const toggleEdit = (field: keyof FormProps) => {
        setEditableFields({ ...editableFields, [field]: !editableFields[field] });
    };

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
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

    const isValidField = (field: string): field is keyof typeof LABEL_MAP => {
        return field in LABEL_MAP;
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
                        
                        return (
                            <div className="col-12" key={field} style={inputGroupStyle}>
                                <div style={inputContainerStyle}>
                                    <label htmlFor={field} className="form-label">
                                        {
                                            isValidField(field) ? 
                                            LABEL_MAP[field] :
                                            field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')
                                        }:
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control rounded-0"
                                        id={field}
                                        name={field}
                                        placeholder={`Enter ${LABEL_MAP[field as keyof typeof LABEL_MAP]}`}
                                        value={value}
                                        onChange={(e) => handleFieldChange(e, field)}
                                        disabled={!editableFields[field as keyof FieldProps]}
                                    />
                                </div>
                                <div style={{ paddingTop: '30px' }}>
                                    <input
                                        type="checkbox"
                                        checked={editableFields[field as keyof FieldProps]}
                                        onChange={() => toggleEdit(field as keyof FormProps)}
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