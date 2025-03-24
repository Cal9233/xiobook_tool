import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clientFields } from "../utils/fieldconfig";
import Header from "../components/Header/Header";
import Form from "../components/Form/Form";

// Client data type
interface ClientData {
  name: string;
  company_name: string;
  ein: string;
  address: string;
  entity_corp: string;
  city: string;
  state: string;
  owner_address: string;
  phone_num: string;
}

const AddClient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const server_URI = process.env.REACT_APP_API_URL;
  
  // Get user from localStorage
  const user = JSON.parse(localStorage?.getItem('user') || '{}');
  const userId = user?.id;

  // Initial form values
  const initialValues: ClientData = {
    name: "",
    company_name: "",
    ein: "",
    address: "",
    entity_corp: "",
    city: "",
    state: "",
    owner_address: "",
    phone_num: ""
  };

  // Handle form submission
  const handleSubmit = async (values: ClientData) => {
    setLoading(true);
    try {
      console.log("Submitting form with data: ", values);
      
      const result = await axios.post(`${server_URI}auth/add_client/${userId}`, values);
      
      console.log("API Response: ", result);
      
      if (result.data.Status === true) {
        toast.success('Client added successfully!');
        setTimeout(() => {
          navigate('/dashboard/clients');
        }, 1000);
      } else {
        console.log('Error hit in else block');
        console.log('Error message: ', result.data.Error.sqlMessage);
        toast.error(result.data.Error.sqlMessage || 'An unknown error occurred!');
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <Header className="text-center" variant="h3">Add Client</Header>
        <Form<ClientData>
          fields={clientFields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={loading}
          className="row g-1"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddClient;