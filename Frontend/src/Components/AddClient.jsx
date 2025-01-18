import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddClient = () => {
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
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with data: ", client); // Debugging log
  
    axios
      .post('http://localhost:1337/auth/add_client', client)
      .then(result => {
          console.log("API Response: ", result); // Log the result to check the response structure
          
          // Check the Status value carefully
          if (result.data.Status === true) {  // Compare with `true` directly
              toast.success('Client added successfully!');
              setTimeout(() => {
                navigate('/dashboard/clients');
              }, 1000);
          } else {
            console.log('Error hit in else block');
            console.log('Error message: ', result.data.Error);
            toast.error(result.data.Error || 'An unknown error occurred!');
          }
      })
      .catch(err => {
        console.error("Error:", err); // Log any error to the console
        toast.error('Something went wrong!');
      });
  }


  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Client</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
        <div className="col-12">
            <label for="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={client.name}
              onChange={(e) =>
                setClient({ ...client, name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputCompanyName" className="form-label">
              Company Name
            </label>
            <input
              type="name"
              className="form-control rounded-0"
              id="inputCompanyName"
              placeholder="Enter Company Name"
              autoComplete="off"
              value={client.company_name}
              onChange={(e) =>
                setClient({ ...client, company_name: e.target.value })
              }
            />
          </div>
          <div className='col-12'>
            <label for="inputein" className="form-label">
              Ein #
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputein"
              placeholder="Enter Ein #"
              autoComplete="off"
              value={client.ein}
              onChange={(e) =>
                setClient({ ...client, ein: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={client.address}
              onChange={(e) =>
                setClient({ ...client, address: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputOwnerAddress" className="form-label">
              Owner Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputOwnerAddress"
              placeholder="1234 Main St"
              value={client.owner_address}
              onChange={(e) =>
                setClient({ ...client, owner_address: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputEntityCorp" className="form-label">
              Entity Corporation
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEntityCorp"
              placeholder="Enter Entity Corporation Name"
              autoComplete="off"
              value={client.entity_corp}
              onChange={(e) =>
                setClient({ ...client, entity_corp: e.target.value })
              }
            />
          </div>
          <div className='col-12'>
            <label for="inputcity" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputcity"
              placeholder="Enter City"
              autoComplete="off"
              value={client.city}
              onChange={(e) =>
                setClient({ ...client, city: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputState" className="form-label">
              State
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputState"
              placeholder="State"
              autoComplete="off"
              value={client.state}
              onChange={(e) =>
                setClient({ ...client, state: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputPhoneNumber" className="form-label">
              Phone Number #
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhoneNumber"
              placeholder="Phone Number #"
              autoComplete="off"
              value={client.phone_num}
              onChange={(e) =>
                setClient({ ...client, phone_num: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Client
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddClient;