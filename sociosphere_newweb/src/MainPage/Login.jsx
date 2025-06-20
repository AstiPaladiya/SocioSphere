import React, { useState, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
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
  const [email, setEmail] = useState('');
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // success or danger
  const [showToast, setShowToast] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState( false);
  const [ogOtp, setOgOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

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


  const handleSendOtp = async () => {
    if (email === '') {
      alert("enter valid email")
      return;
    }
    setIsSendingOtp(true);
    // 🔐 API call to backend to send OTP to the email
    let response = await fetch(API_BASE_URL + "/Login/send-otp/" + email);
    response = await response.json();
    let success = response.status;

    // replace with your actual function
    if (success) {
      setOtpSent(true);
      alert(response.message);
      setOgOtp(response.data);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert(response.message)
    }
    setIsSendingOtp(false);
  };

  const handleResetPassword = async () => {
    if (newPassword === '' || confirmPassword === '' || otp === '') {
     alert("Please fill in all required fields.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (otp !== ogOtp) {
      alert("Invalid OTP");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // 🔐 API call to reset password
    let result = await fetch(API_BASE_URL + "/Login/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: newPassword })
    });
    result = await result.json();

    if (result.status) {
      alert(result.message);
      setIsForgotPass(false);
    } else {
      alert(result.message);
    }
  };


  return (
    <CssVarsProvider>
      <CssBaseline />
      <main>
        {isForgotPass && (
        <div
          className="modal fade show"
          id="forgotPassModal"
          tabIndex="-1"
          aria-labelledby="forgotPassModalLabel"
          aria-hidden="true"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title" id="forgotPassModalLabel">
                  🔐 Reset Your Password
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  onClick={() => setIsForgotPass(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="container py-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">📧 Email</label>
                      <div className="input-group">
                        <span className="input-group-text">📧</span>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={otpSent}
                          required
                        />
                      </div>
                    </div>

                    {!otpSent && (
                      <div className="col-12">
                        <button
                          className={`btn w-100 ${isSendingOtp ? 'btn-secondary' : 'btn-primary'} fw-bold`}
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                        >
                          {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                      </div>
                    )}

                    {otpSent && (
                      <>
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">🔑 Enter OTP</label>
                          <input
                            type="text"
                            className="form-control"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            placeholder="Enter OTP"
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">🔒 New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">🔁 Confirm Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                          />
                        </div>

                        <div className="col-12">
                          <button
                            className="btn btn-success w-100 fw-bold"
                            onClick={handleResetPassword}
                          >
                            ✅ Reset Password
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setIsForgotPass(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
              ml: 3,


            }}
          >
            <Box sx={{ width: "100%", maxWidth: "400px", mb: 3 }}>
              {/* Logo */}

              <img
                src="./Images/logo3.png"
                alt="logo"
                style={{ width: "45%" }}
              /><br />
              {/* Welcome Text */}
              <Typography level="h2" component="h1" mb={1}>
                <b>Welcome Back!</b>
              </Typography>
              <Typography level="body1" mb={3} style={{ color: "grey" }}>
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
                    style={{ width: "75%", height: "40px", borderRadius: "2px" }}
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
                    style={{ width: "75%", height: "40px", borderRadius: "2px" }}
                  />
                  <span rel="forgetpassword" onClick={() => setIsForgotPass(true)} style={{ color: "#41d2e7", fontSize: "15px", paddingLeft: "44%" }}>Forget Password?</span>
                </FormControl>
                {error.password && (
                  <p style={{ color: "red" }}>{error.password}</p>
                )}
                <Button sx={{ mt: 3 }} type="submit" style={{ width: "75%", height: "40px", borderRadius: "2px", backgroundColor: "#41d2e7" }}>
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