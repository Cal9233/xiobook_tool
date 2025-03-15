import axios from "axios";
import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header/Header";
import Form from "../components/Form/Form";
import { Input, InputContainer, Label } from "../components/Input/Input";
import Button from "../components/Button/Button";

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

const AddClient = () => {
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
  const user = JSON.parse(localStorage?.getItem('user') || '"');
  let userId = user?.id
  const navigate = useNavigate();
  const server_URI = process.env.REACT_APP_API_URL;

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form with data: ", client); // Debugging log
    axios
      .post(`${server_URI}auth/add_client/${userId}`, client)
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
        <Header className="text-center" variant="h3">Add Client</Header>
        <Form className="row g-1" onSubmit={handleSubmit}>
          <InputContainer className="col-12">
            <Label htmlFor="inputName" className="form-label">Name</Label>
            <Input 
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={client.name}
              onChange={(e) =>
                setClient({ ...client, name: e.target.value })
              }
            />
          </InputContainer>
          <InputContainer className="col-12">
            <Label htmlFor="inputCompanyName" className="form-label">
              Company Name
            </Label>
            <Input
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
          </InputContainer>
          <InputContainer className='col-12'>
            <Label htmlFor="inputein" className="form-label">
              Ein #
            </Label>
            <Input
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
          </InputContainer>
          <InputContainer className="col-12">
            <Label htmlFor="inputAddress" className="form-label">
              Address
            </Label>
            <Input
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
          </InputContainer>
          <InputContainer className="col-12">
            <Label htmlFor="inputOwnerAddress" className="form-label">
              Owner Address
            </Label>
            <Input
              type="text"
              className="form-control rounded-0"
              id="inputOwnerAddress"
              placeholder="1234 Main St"
              value={client.owner_address}
              onChange={(e) =>
                setClient({ ...client, owner_address: e.target.value })
              }
            />
          </InputContainer>
          <InputContainer className="col-12">
            <Label htmlFor="inputEntityCorp" className="form-label">
              Entity Corporation
            </Label>
            <Input
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
          </InputContainer>
          <InputContainer className='col-12'>
            <Label htmlFor="inputcity" className="form-label">
              City
            </Label>
            <Input
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
          </InputContainer>
          <InputContainer className="col-12">
            <Label htmlFor="inputState" className="form-label">
              State
            </Label>
            <Input
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
          </InputContainer>
          <InputContainer className="col-12">
            <Label htmlFor="inputPhoneNumber" className="form-label">
              Phone Number #
            </Label>
            <Input
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
          </InputContainer>
          <div className="col-12">
            <Button type="submit" className="btn btn-primary w-100">Add Client</Button>
          </div>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddClient;