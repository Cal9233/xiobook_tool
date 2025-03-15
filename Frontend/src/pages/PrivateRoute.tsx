import React, {ReactNode} from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
  return localStorage.getItem("valid") ? children : <Navigate to="/" />
}

export default PrivateRoute