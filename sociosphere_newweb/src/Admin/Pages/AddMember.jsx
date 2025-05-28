import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import { FaPhoneAlt } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Toast,
  ToastContainer,
  InputGroup
} from "react-bootstrap";
import { Typography, Grid, Input, FormGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AddMember() {
  const [member, setMember] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    gender: "",
    squarfootSize: "",
    livingDate: "",
    // status:"Active",
    flatNo: "",
  });

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastHeader,setToastHeader]=useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const navigate = useNavigate();
  const handleBack = (e) => {
    navigate("/Admin/Member")
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!member.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!member.middleName.trim()) newErrors.middleName = "Middle Name is required";
    if (!member.lastName.trim()) newErrors.lastName = "Last Name is required";

    if (!member.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(member.email)) {
      newErrors.email = "Email address is not in valid format";
    }

    if (!member.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(member.phoneNo)) {
      newErrors.phoneNo = "Phone number must be 10 digits";
    }


    if (!member.gender) newErrors.gender = "Gender is required";

    if (!member.squarfootSize.trim()) {
      newErrors.squarfootSize = "Square foot size is required";
    } else if (Number(member.squarfootSize) <= 0) {
      newErrors.squarfootSize = "Square Foot must be more than 0 number and negative number not allow";
    }

    if (!member.flatNo.trim()) {
      newErrors.flatNo = "Flat number is required";
    }



    if (!member.livingDate.trim()) {
      newErrors.livingDate = "Living date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (!validate()) return;

  //     try {
  //       await axios.post(
  //         "http://192.168.229.34:5175/api/Member/MemberRegister",
  //         member
  //       );

  //       setToastMessage("Member registered successfully!");
  //       setToastVariant("success");
  //       setShowToast(true);

  //       setMember({
  //         firstName: "",
  //         middleName: "",
  //         lastName: "",
  //         email: "",
  //         phoneNo: "",
  //         gender: "",
  //         squarfootSize: "",
  //         livingDate: "",
  //         status: "",
  //         flatNo: "",
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       setToastMessage("Registration failed. Try again.");
  //       setToastVariant("danger");
  //       setShowToast(true);
  //     }
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/Member/MemberRegister`,
        member
      );
      const successmsg = response.data.message || "Member registered successfully !";
      const generatedPassword = response.data.password;
      // If successful, show success toast
      setToastHeader("Success!")
      setToastMessage(`${successmsg}:${generatedPassword}`);
      setToastVariant("success");
      setShowToast(true);

      // Reset form
      setMember({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        gender: "",
        squarfootSize: "",
        livingDate: "",
        flatNo: "",
      });
    } catch (error) {
      console.error(error);

      // Extract message from API response or use fallback
      const message =
        error.response?.data?.message || // if API sends { message: "something" }
        error.response?.data ||          // if API sends just a string
        "Registration failed. Try again.";
      setToastHeader("Error!")
      setToastMessage(message);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <>
    <ToastContainer position="top-center"
          className="position-fixed top-0 start-50 translate-middle-x "
         style={{marginTop:"5%",textAlign:"center"}}
    >
        <Toast
       
          bg={toastVariant}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Header >
            <div className="w-100 justify-content-center" style={{fontSize:"20px"}}>
            <strong className="me-auto" >{toastHeader}</strong>
            </div>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    <Container>
       
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
            Member Registration
          </Typography>
        </Grid>

      </Grid>
      <br />
     

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit} method="post">
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name :</Form.Label>
                  <Form.Control type="text"
                    name="firstName"
                    value={member.firstName}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Middle Name :</Form.Label>
                  <Form.Control
                    name="middleName" type="text"
                    value={member.middleName}
                    onChange={handleChange}
                    isInvalid={!!errors.middleName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.middleName}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name :</Form.Label>
                  <Form.Control
                    name="lastName" type="text"
                    value={member.lastName}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email :</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>@</InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={member.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                 
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                   </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <FormGroup className="mb-3">

                  <Form.Label>Phone No :</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaPhoneAlt /></InputGroup.Text>
                    <Form.Control
                      type="number"
                      maxLength={10}
                      name="phoneNo"
                      value={member.phoneNo}
                      onChange={handleChange}
                      isInvalid={!!errors.phoneNo}
                    />
                  
                  <Form.Control.Feedback type="invalid">{errors.phoneNo}</Form.Control.Feedback>
                  </InputGroup>
                </FormGroup>
              </Col>



              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender :</Form.Label>
                  <Form.Select
                    name="gender"
                    value={member.gender}
                    onChange={handleChange}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Area Size:</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>Sq ft.</InputGroup.Text>

                    <Form.Control
                      type="number"
                      name="squarfootSize"
                      value={member.squarfootSize}
                      onChange={handleChange}
                      isInvalid={!!errors.squarfootSize}
                    />
                
                  <Form.Control.Feedback type="invalid">{errors.squarfootSize}</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Flat No :</Form.Label>
                  <Form.Control
                    type="number"
                    name="flatNo"
                    value={member.flatNo}
                    onChange={handleChange}
                    isInvalid={!!errors.flatNo}
                  />
                  <Form.Control.Feedback type="invalid">{errors.flatNo}</Form.Control.Feedback>
                </Form.Group>
              </Col>


              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Living Date :</Form.Label>
                  <Form.Control
                    type="date"
                    name="livingDate"
                    value={member.livingDate}
                    onChange={handleChange}
                    isInvalid={!!errors.livingDate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.livingDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12} style={{marginTop:"20px"}}>
                <Button type="submit" variant="contained" style={{backgroundColor:"#41d2e7",color:"white",borderRadius:"3px",width:"14%"}} >
                  Submit
                </Button>&nbsp;
                <Button type="button" onClick={handleBack} variant="secondary" style={{borderRadius:"3px",width:"10%"}}>
                  Back
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
}

