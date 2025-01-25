import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Employee from './Components/Employee'
import Clients from './Components/Clients'
import AddCategory from './Components/AddCategory'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import Start from './Components/Start'
import EmployeeLogin from './Components/EmployeeLogin'
import EmployeeDetail from './Components/EmployeeDetail'
import PrivateRoute from './Components/PrivateRoute'
import EditClient from './Components/EditClient'
import AddClient from './Components/AddClient'
import Calculator from './Components/Calculator'
import EmployeeForm from './Components/EmployeeForm'
import Reports from './Components/Reports'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start />}></Route>
      <Route path='/adminlogin' element={<Login />}></Route>
      <Route path='/employee_login' element={<EmployeeLogin />}></Route>
      <Route path='/employee_detail/:id' element={<EmployeeDetail />}></Route>
      <Route path='/dashboard' element={
        <PrivateRoute >
          <Dashboard />
        </PrivateRoute>
      }>
        <Route path='' element={<Home />}></Route>
        <Route path='/dashboard/employee' element={<Employee />}></Route>
        <Route path='/dashboard/clients' element={<Clients />}></Route>
        <Route path='/dashboard/add_client' element={<AddClient />}></Route>
        <Route path='/dashboard/edit_client/:id' element={<EditClient />}></Route>
        <Route path='/dashboard/add_category' element={<AddCategory />}></Route>
        <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
        <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />}></Route>
        <Route path='/dashboard/calculator/:employeeId' element={<Calculator />}></Route>
        <Route path='/dashboard/employeeform/:employeeId' element={<EmployeeForm />}></Route>
        <Route path='/dashboard/reports' element={<Reports />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App