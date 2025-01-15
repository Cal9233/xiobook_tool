import React from "react";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard'

import { Box } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { AppProvider } from "./Context/AppProvider";

function App() {
  return (
    // <AppProvider>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Box sx={{ padding: "10px" }}>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Box>
      </BrowserRouter>
    // </AppProvider>
  );
}

export default App;