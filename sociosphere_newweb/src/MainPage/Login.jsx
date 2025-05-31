import React, { useState, useContext } from "react";
import axios from "axios";
import API_BASE_URL  from  "../config";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import AuthContext from "./AuthContext";
import {
  CssVarsProvider,
  Sheet,
  CssBaseline,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
} from "@mui/joy";
import { borderRadius, height } from "@mui/system";

export default function Login(props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // success or danger
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error[e.target.name]) {
      setError({ ...error, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newError = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;

    if (!formData.email.trim()) {
      newError.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newError.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newError.password = "Password is required";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setToastMessage("");
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/Login/login`,
        formData
      );
      const { token, role } = res.data;

      context?.login?.(token, role);

      setToastVariant("success");
      setToastMessage("Login successfully");
      setShowToast(true);

      setTimeout(() => {
        if (role === "Admin") navigate("/admin");
        else if (role === "Member") navigate("/member");
        else navigate("/");
      }, 1500);
    } catch (err) {
      setToastVariant("danger");
      setToastMessage(err.response?.data?.message || "Login failed");
      setShowToast(true);
    }
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <main>
        <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
          {/* Left Side - Login Form */}
          <Box
            sx={{
              flex: 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              px: 2,
              ml:3,

          
            }}
          >
            <Box sx={{ width: "100%", maxWidth: "400px",mb:3 }}>
              {/* Logo */}
            
                <img
                  src="./Images/logo3.png"
                  alt="logo"
                  style={{ width: "45%" }}
                /><br/>
              {/* Welcome Text */}
              <Typography level="h2" component="h1" mb={1}>
                <b>Welcome Back!</b>
              </Typography>
              <Typography level="body1" mb={3} style={{color:"grey"}}>
                Please log in to your account
              </Typography>

              <form onSubmit={submitForm}>
                <FormControl>
                  <FormLabel>Email :</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{width:"75%",height:"40px",borderRadius:"2px"}}
                  />
                </FormControl>
                {error.email && <p style={{ color: "red" }}>{error.email}</p>}

                <FormControl sx={{ mt: 2 }}>
                  <FormLabel>Password :</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{width:"75%",height:"40px",borderRadius:"2px"}}
                  />
                    <a rel="forgetpassword" href="Forget Password?" style={{color:"#41d2e7",fontSize:"15px",paddingLeft:"44%"}}>Forget Password?</a>
                </FormControl>
                {error.password && (
                  <p style={{ color: "red" }}>{error.password}</p>
                )}
                <Button sx={{ mt: 3 }}  type="submit"  style={{width:"75%",height:"40px",borderRadius:"2px",backgroundColor:"#41d2e7"}}>
                  Log in
                </Button>
              </form>
            </Box>
          </Box>
          {/* Right Side - Illustration */}
          <Box
            sx={{
              flex: 1.2,
              backgroundColor: "#f5f5f5",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
            }}
          >
         
            <img
              src="./Images/loginbackground.jpg"
              alt="Login Illustration"
              style={{ width: "80%" }}
            />
          </Box>
        </Box>

        {/* Bootstrap Toast (Top Right) */}
        <ToastContainer
          position="top-center"
          className="p-3"
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1055, // Higher than default headers/navbars
          }}
        >
          <Toast
            bg={toastVariant}
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Login Status</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </main>
    </CssVarsProvider>
  );
}
