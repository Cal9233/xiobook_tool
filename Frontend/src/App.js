import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './pages/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Employee from './pages/Employee'
import Clients from './pages/Clients'
import AddEmployee from './pages/AddEmployee'
import EditEmployee from './pages/EditEmployee'
import Start from './pages/Start'
import EmployeeLogin from './pages/EmployeeLogin'
import EmployeeDetail from './pages/EmployeeDetail'
import PrivateRoute from './pages/PrivateRoute'
import EditClient from './pages/EditClient'
import AddClient from './pages/AddClient'
import Calculator from './pages/Calculator'
import EmployeeForm from './pages/EmployeeForm'
import Reports from './pages/Reports'
import EditEmployeeForm from './pages/EditEmployeeForm';

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
        <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
        <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />}></Route>
        <Route path='/dashboard/calculator/:employeeId' element={<Calculator />}></Route>
        <Route path='/dashboard/employeeform/:employeeId' element={<EmployeeForm />}></Route>
        <Route path='/dashboard/reports' element={<Reports />}></Route>
        <Route path='/dashboard/edit_employeeform/:id' element={<EditEmployeeForm />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App