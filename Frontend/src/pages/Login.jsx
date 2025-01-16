import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import xioimg from "../assets/images/xiobook.jpg";
import {
  Box,
  Typography,
  InputBase,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
        e.preventDefault()
        // const response = await axios.post("http://localhost:5000/api/login", {
        //     email,
        //     password,
        // });
        // const { token } = response.data;
        // localStorage.setItem("authToken", token);
        navigate("/dashboard");
    } catch (error) {
        console.error("Login failed", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          backgroundImage: `url(${xioimg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          height: "100vh",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box
          sx={{
            width: "100%",
            background: "rgba(0, 0, 0, 0.75)",
            maxWidth: "380px",
          }}
          padding={4}
        >
          {/* Add your login form content here */}
          <Typography variant="h2" mb={3} fontSize={"1.2rem"}>
            Sign In
          </Typography>
          <Box
            component="form"
            style={{
              color: "white",
            }}
            onSubmit={handleLogin}
          >
            <InputBase
              required
              placeholder="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                background: "white",
                padding: "5px 10px",
                fontSize: "15px",
                mb: 2,
              }}
            />
            <InputBase
              required
              placeholder="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                background: "white",
                padding: "5px 10px",
                fontSize: "15px",
                mb: 2,
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  sx={{
                    color: "white",
                  }}
                />
              }
              label="Remember me"
              sx={{
                color: "white",
                fontWeight: 300,
              }}
            />
            <Button
              variant="contained"
              fullWidth
              style={{
                marginTop: 2,
              }}
              type="submit"
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Login;