import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clientFields } from "../utils/fieldconfig";
import Header from "../components/Header/Header";
import Form from "../components/Form/Form";
import Button from '../components/Button/Button';
import { EditableFieldControls } from '../components/EditableField/EditableFieldControls';

interface ClientProps {
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

const EditClient = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientProps>({
    name: "",
    company_name: "",
    ein: "",
    address: "",
    entity_corp: "",
    city: "",
    state: "",
    owner_address: "",
    phone_num: "",
  });

  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const server_URI = process.env.REACT_APP_API_URL;
  const editableClientFields = clientFields.map(field => ({
    ...field,
    disabled: !editableFields[field.name],
    renderAppend: () => (
      <EditableFieldControls
        fieldName={field.name}
        isEditable={!!editableFields[field.name]}
        onToggleEdit={toggleEdit}
      />
    )
  }));

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const result = await axios.get(`${server_URI}auth/client/${id}`);
        if (result.data.Status) {
          const data = result.data.Result[0];
          setClient({
            name: data.name || "",
            company_name: data.company_name || "",
            ein: data.ein || "",
            address: data.address || "",
            entity_corp: data.entity_corp || "",
            city: data.city || "",
            state: data.state || "",
            owner_address: data.owner_address || "",
            phone_num: data.phone_num || ""
          });

          // Initialize all fields as non-editable
          const initialEditableState = Object.keys(data).reduce((acc, key) => {
            if (key in client) {
              acc[key] = false;
            }
            return acc;
          }, {} as Record<string, boolean>);
          
          setEditableFields(initialEditableState);
        }
      } catch (err) {
        console.error("Error fetching client:", err);
        toast.error("Error loading client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values: ClientProps) => {
    setLoading(true);
    try {
      const result = await axios.put(`${server_URI}auth/edit_client/${id}`, values);
      
      if (result.data.Status !== false) {
        toast.success('Client updated successfully!');
        setTimeout(() => {
          navigate('/dashboard/clients');
        }, 1000);
      } else {
        toast.error(result.data.Error || 'An unknown error occurred!');
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = (fieldName: string) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const toggleAllFields = (editable: boolean) => {
    const newState = { ...editableFields };
    Object.keys(newState).forEach(key => {
      newState[key] = editable;
    });
    setEditableFields(newState);
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <Header className="text-center" variant="h3">Edit Client</Header>
        
        <div className="d-flex justify-content-end mb-3">
          <Button 
            className="btn btn-sm btn-outline-secondary me-2" 
            onClick={() => toggleAllFields(true)}
          >
            Edit All
          </Button>
          <Button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={() => toggleAllFields(false)}
          >
            Lock All
          </Button>
        </div>

        <Form<ClientProps>
          fields={editableClientFields}
          initialValues={client}
          onSubmit={handleSubmit}
          loading={loading}
          className="row g-1 position-relative"
          submitText="Update Client"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditClient;