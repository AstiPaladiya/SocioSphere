import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import AuthContext from './AuthContext';
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
} from '@mui/joy';

export default function Login(props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success'); // success or danger
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error[e.target.name]) {
      setError({ ...error, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newError = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;

    if (!formData.email.trim()) {
      newError.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newError.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newError.password = 'Password is required';
    } 

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setToastMessage('');
    if (!validateForm()) return;

    try {
      const res = await axios.post('http://192.168.229.34:5175/api/Login/login', formData);
      const { token, role } = res.data;

      context?.login?.(token, role);

      setToastVariant('success');
      setToastMessage('Login successfully');
      setShowToast(true);

      setTimeout(() => {
        if (role === 'Admin') navigate('/admin');
        else if (role === 'Member') navigate('/member');
        else navigate('/');
      }, 1500);
    } catch (err) {
      setToastVariant('danger');
      setToastMessage(err.response?.data?.message || 'Login failed');
      setShowToast(true);
    }
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <main>
        <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
          {/* Left Side - Login Form */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sheet
              sx={{
                width: 320,
                p: 4,
                borderRadius: 'md',
                boxShadow: 'lg',
              }}
              variant="outlined"
            >
              <div className="row">
                <div className="col-6">
                  <Typography level="h4" component="h1" textAlign="Left" mb={1}>
                    <b>Sign in</b>
                  </Typography>
                </div>
                <div className="col-6">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <img src="./Images/fulllogo.png" style={{ width: '80px' }} alt="logo" />
                  </Box>
                </div>
              </div>

              <form onSubmit={submitForm}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
                {error.email && <p style={{ color: 'red' }}>{error.email}</p>}

                <FormControl sx={{ mt: 2 }}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
                {error.password && <p style={{ color: 'red' }}>{error.password}</p>}

                <Button sx={{ mt: 3 }} fullWidth type="submit">
                  Log in
                </Button>
              </form>
            </Sheet>
          </Box>

          {/* Right Side - Illustration */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <Typography level="h4">Welcome to Sociosphere</Typography>
            <img src="./Images/loginbackground.jpg" alt="Login Illustration" style={{ width: '100%' }} />
          </Box>
        </Box>

        {/* Bootstrap Toast (Top Right) */}
        <ToastContainer
          position="top-center"
          className="p-3"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
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
