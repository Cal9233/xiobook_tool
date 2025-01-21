import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState({
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

  const [editableFields, setEditableFields] = useState({
    name: false,
    company_name: false,
    ein: false,
    address: false,
    owner_address: false,
    entity_corp: false,
    city: false,
    state: false,
    phone_num: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:1337/auth/client/' + id)
      .then((result) => {
        if (result.data.Status) {
          const data = result.data.Result[0];
          setClient({
            name: data.name,
            company_name: data.company_name,
            ein: data.ein,
            address: data.address,
            entity_corp: data.entity_corp,
            city: data.city,
            state: data.state,
            owner_address: data.owner_address,
            phone_num: data.phone_num,
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put('http://localhost:1337/auth/edit_client/' + id, client)
      .then((result) => {
        if (result.data.Status !== false) {
          toast.success('Client updated successfully!');
          setTimeout(() => {
            navigate('/dashboard/clients');
          }, 1000);
        } else {
          toast.error(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFieldChange = (e, field) => {
    setClient({ ...client, [field]: e.target.value });
  };

  const toggleEdit = (field) => {
    setEditableFields({ ...editableFields, [field]: !editableFields[field] });
  };

  // Only render the form once client data is fetched and state is updated
  if (!client.name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Client</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputName"
                placeholder="Enter Name"
                value={client.name}
                onChange={(e) => handleFieldChange(e, 'name')}
                disabled={!editableFields.name}
              />
              <input
                type="checkbox"
                checked={editableFields.name}
                onChange={() => toggleEdit('name')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputCompanyName" className="form-label">
              Company Name
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputCompanyName"
                placeholder="Enter Company Name"
                value={client.company_name}
                onChange={(e) => handleFieldChange(e, 'company_name')}
                disabled={!editableFields.company_name}
              />
              <input
                type="checkbox"
                checked={editableFields.company_name}
                onChange={() => toggleEdit('company_name')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputEin" className="form-label">
              EIN #
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputEin"
                placeholder="Enter EIN #"
                value={client.ein}
                onChange={(e) => handleFieldChange(e, 'ein')}
                disabled={!editableFields.ein}
              />
              <input
                type="checkbox"
                checked={editableFields.ein}
                onChange={() => toggleEdit('ein')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputAddress"
                placeholder="Enter Address"
                value={client.address}
                onChange={(e) => handleFieldChange(e, 'address')}
                disabled={!editableFields.address}
              />
              <input
                type="checkbox"
                checked={editableFields.address}
                onChange={() => toggleEdit('address')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputOwnerAddress" className="form-label">
              Owner Address
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputOwnerAddress"
                placeholder="Enter Owner's Address"
                value={client.owner_address}
                onChange={(e) => handleFieldChange(e, 'owner_address')}
                disabled={!editableFields.owner_address}
              />
              <input
                type="checkbox"
                checked={editableFields.owner_address}
                onChange={() => toggleEdit('owner_address')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputEntityCorp" className="form-label">
              Entity Corporation
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputEntityCorp"
                placeholder="Enter Entity Corporation"
                value={client.entity_corp}
                onChange={(e) => handleFieldChange(e, 'entity_corp')}
                disabled={!editableFields.entity_corp}
              />
              <input
                type="checkbox"
                checked={editableFields.entity_corp}
                onChange={() => toggleEdit('entity_corp')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputCity" className="form-label">
              City
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputCity"
                placeholder="Enter City"
                value={client.city}
                onChange={(e) => handleFieldChange(e, 'city')}
                disabled={!editableFields.city}
              />
              <input
                type="checkbox"
                checked={editableFields.city}
                onChange={() => toggleEdit('city')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputState" className="form-label">
              State
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputState"
                placeholder="Enter State"
                value={client.state}
                onChange={(e) => handleFieldChange(e, 'state')}
                disabled={!editableFields.state}
              />
              <input
                type="checkbox"
                checked={editableFields.state}
                onChange={() => toggleEdit('state')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputPhoneNumber" className="form-label">
              Phone Number
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control rounded-0"
                id="inputPhoneNumber"
                placeholder="Enter Phone Number"
                value={client.phone_num}
                onChange={(e) => handleFieldChange(e, 'phone_num')}
                disabled={!editableFields.phone_num}
              />
              <input
                type="checkbox"
                checked={editableFields.phone_num}
                onChange={() => toggleEdit('phone_num')}
                className="ms-2"
              />
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Client
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditClient;