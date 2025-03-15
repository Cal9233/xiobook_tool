import React, { ChangeEvent, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header/Header';
import { Input, InputContainer, Label } from '../components/Input/Input';
import Button from '../components/Button/Button';

interface ValueProps {
    email: string;
    password: string;
}

const Login = () => {
    const [values, setValues] = useState<ValueProps>({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    
    const server_URI = process.env.REACT_APP_API_URL;
    const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        axios.post(`${server_URI}auth/adminlogin`, values)
        .then(result => {
            if(result?.data?.loginStatus) {
                localStorage.setItem("valid", "true")
                localStorage.setItem("user", JSON.stringify(result.data.user))
                navigate('/dashboard')
            } else {
                setValues({
                    email: '',
                    password: ''
                });
                setError(result.data.Error)
                toast.error(result.data.Error || 'An unknown error occurred!');
            }
        })
        .catch(err => {
            setValues({
                email: '',
                password: ''
            });
            console.log({values})
            toast.error(err?.response?.data?.Error || 'An unknown error occurred!');
        })
    }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
        <div className='p-3 rounded w-25 border loginForm'>
            <div className='text-warning'>
                {error && error}
            </div>
            <Header className="text-center" variant='h3'>Login</Header>
            <form onSubmit={handleSubmit}>
                <InputContainer className='mb-3'>
                    <Label placeholder="email"><strong>Email:</strong></Label>
                    <Input type="email" name='email' autoComplete='off' placeholder='Enter Email' value={values.email}
                    onChange={(e) => setValues({...values, email: e.target.value})} className='form-control rounded-0'/>
                </InputContainer>
                <InputContainer className='mb-3'>
                    <Label placeholder="password"><strong>Password:</strong></Label>
                    <Input type="password" name='password' autoComplete='off' placeholder='Enter Password' value={values.password}
                    onChange={(e) => setValues({...values, password: e.target.value})} className='form-control rounded-0'/>
                </InputContainer>
                <Button className='btn btn-success w-100 rounded-0 mb-2'>Log in</Button>
            </form>
        </div>
        <ToastContainer />
    </div>
  )
}

export default Login