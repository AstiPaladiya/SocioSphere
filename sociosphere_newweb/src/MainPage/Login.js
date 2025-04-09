import * as React from 'react';

import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Box from '@mui/joy/Box';
import { responsiveFontSizes, Table } from '@mui/material';
import { Margin } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


export default function Login(props) {
    const navigate=useNavigate();
   const handleLogin=()=>{
    navigate("/admin");
   }
  return (
    <CssVarsProvider {...props}>
      <CssBaseline />
      <main>
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            width: '100%',
          }}
        >
          {/* Left Side - Logo & Image */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sheet
              sx={{
                width: 320,
                p: 4,
                borderRadius: 'md',
                boxShadow: 'lg',
              }}
              variant="outlined"
            >
            <div class='row'>
                <div class='col-6'>
                <Typography level="h4" component="h1" textAlign="Left" mb={1}>
                <b>Sign in</b>
              </Typography>
              </div>
              <div class='col-6'>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <img src='./Images/fulllogo.png' style={{width:'80px'}} />
              </Box>
             
            </div>
              </div>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="Example@email.com"
                />
              </FormControl>

              <FormControl sx={{ mt: 2 }}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  placeholder="password"
                />
              </FormControl>
              <Typography sx={{fontSizze:'15px',marginLeft:"120px"}}><Link href="" >Forget Password</Link></Typography>

              <Button sx={{ mt: 3 }} fullWidth onClick={handleLogin}>
                Log in
              </Button>

              {/* <Typography
                endDecorator={<Link href="#">Sign up</Link>}
                sx={{ fontSize: 'sm', alignSelf: 'center', mt: 2 }}
              >
                Don&apos;t have an account?
              </Typography> */}
            </Sheet>
          </Box>
         
          {/* Right Side - Login Form */}
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
            {/* <img
              src="./Images/logo.png"
              alt="Logo"
              style={{ width: '120px', marginBottom: '20px' }}
            /> */}
            <Typography level="h4">Welcome to Sociosphere</Typography>
            <img
              src="./Images/loginbackground.jpg"
              alt="Login Illustration"
              style={{ width: '100%' }}
            />
          </Box>
        </Box>
      </main>
    </CssVarsProvider>
  );
}
