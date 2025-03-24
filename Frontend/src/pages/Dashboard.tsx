import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive, isCollapsed, onClick }) => {
  return (
    <li className="w-100 mb-2">
      {onClick ? (
        <button
          className={`nav-link px-3 py-2 rounded d-flex align-items-center ${
            isActive ? 'active bg-primary' : 'text-white'
          }`}
          onClick={onClick}
          title={label}
        >
          <i className={`fs-5 ${icon} ${isCollapsed ? '' : 'me-3'}`}></i>
          {!isCollapsed && <span>{label}</span>}
        </button>
      ) : (
        <Link
          to={to}
          className={`nav-link px-3 py-2 rounded d-flex align-items-center ${
            isActive ? 'active bg-primary' : 'text-white'
          }`}
          title={label}
        >
          <i className={`fs-5 ${icon} ${isCollapsed ? '' : 'me-3'}`}></i>
          {!isCollapsed && <span>{label}</span>}
        </Link>
      )}
    </li>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string>("User");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  
  axios.defaults.withCredentials = true;
  const server_URI = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Get user info from localStorage
    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      if (userInfo && userInfo.name) {
        setUserName(userInfo.name);
      }
    } catch (error) {
      console.error("Error parsing user info:", error);
    }
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      const result = await axios.get(`${server_URI}auth/logout`);
      if (result.data.Status) {
        localStorage.removeItem("valid");
        localStorage.removeItem("user");
        navigate('/');
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleSidebar = (): void => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className={`col-auto px-0 bg-dark ${isCollapsed ? 'col-auto' : 'col-md-3 col-xl-2'}`}>
          <div className={`d-flex flex-column ${isCollapsed ? 'align-items-center' : 'align-items-sm-start'} px-3 pt-4 text-white min-vh-100`}>
            <div className="d-flex w-100 justify-content-between align-items-center mb-4">
              {!isCollapsed ? (
                <Link
                  to="/dashboard"
                  className="d-flex align-items-center text-white text-decoration-none"
                >
                  <span className="fs-5 fw-bolder">
                    Welcome, {userName}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="d-flex align-items-center text-white text-decoration-none"
                >
                  <i className="bi bi-house-door fs-4"></i>
                </Link>
              )}
              <button 
                className="btn btn-sm text-white" 
                onClick={toggleSidebar}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'} fs-5`}></i>
              </button>
            </div>
            
            <ul
              className={`nav nav-pills flex-column mb-sm-auto mb-0 ${isCollapsed ? 'align-items-center' : 'align-items-sm-start'} w-100`}
              id="menu"
            >
              <NavItem 
                to="/dashboard" 
                icon="bi-speedometer2" 
                label="Dashboard" 
                isActive={location.pathname === "/dashboard"}
                isCollapsed={isCollapsed}
              />
              
              <NavItem 
                to="/dashboard/clients" 
                icon="bi-person" 
                label="Manage Clients" 
                isActive={location.pathname.includes("/dashboard/clients")}
                isCollapsed={isCollapsed}
              />
              
              <NavItem 
                to="/dashboard/employee" 
                icon="bi-people" 
                label="Manage Employees" 
                isActive={location.pathname.includes("/dashboard/employee")}
                isCollapsed={isCollapsed}
              />
              
              <NavItem 
                to="/dashboard/reports" 
                icon="bi-journals" 
                label="Reports" 
                isActive={location.pathname.includes("/dashboard/reports")}
                isCollapsed={isCollapsed}
              />
              
              <div className={isCollapsed ? "mt-2" : "mt-auto"}></div>
              
              <NavItem 
                to="" 
                icon="bi-power" 
                label="Logout" 
                isActive={false}
                isCollapsed={isCollapsed}
                onClick={handleLogout}
              />
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-3 d-flex justify-content-between align-items-center shadow-sm">
            <button 
              className="btn d-md-none" 
              onClick={toggleSidebar}
            >
              <i className="bi bi-list"></i>
            </button>
            <h4 className="m-0">Employee Management System</h4>
            <div className="d-flex align-items-center">
              <i className="bi bi-person-circle fs-4 me-2"></i>
              <span className="d-none d-md-inline">{userName}</span>
            </div>
          </div>
          <div className="p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;