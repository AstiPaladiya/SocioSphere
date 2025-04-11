import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AddWatchmen() {
    const [watchman, setWatchman] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNo: "",
        email: "", // added
        gender: "",
        dutyStartTime: "",
        dutyEndTime: "",
        joiningDate: "",
        status:"Active",
        salary: "",
      });
      

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/Admin/Watchmenrecord");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWatchman((prev) => ({
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

    if (!watchman.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!watchman.middleName.trim()) newErrors.firstName = "Middle Name is required";
    if (!watchman.lastName.trim()) newErrors.lastName = "Last Name is required";

    if (!watchman.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!/^\d{10}$/.test(watchman.phoneNo)) {
      newErrors.phoneNo = "Phone number must be 10 digits";
    }
    if (!watchman.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchman.email)) {
        newErrors.email = "Email is not valid";
      }
      
    if (!watchman.gender) newErrors.gender = "Gender is required";
    if (!watchman.dutyStartTime.trim()) newErrors.dutyStartTime = "Start time is required";
    if (!watchman.dutyEndTime.trim()) newErrors.dutyEndTime = "End time is required";
    if (!watchman.joiningDate.trim()) newErrors.joiningDate = "Joining date is required";
    if (!watchman.salary.trim()) newErrors.salary = "Salary is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://192.168.229.34:5175/api/Watchmen/watchmenRegister",
        watchman
      );
      const generatedPassword = response.data.password;
      setToastMessage(`Watchmen registered successfully! Generated Passowrd: ${generatedPassword}`);
      setToastVariant("success");
      setShowToast(true);

      setWatchman({
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNo: "",
        email: "", // added
        gender: "",
        dutyStartTime: "",
        dutyEndTime: "",
        joiningDate: "",
        salary: "",
      });
      
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Registration failed. Try again.";
      setToastMessage(message);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="text-secondary mb-3">Add Watchman</h3>

      <ToastContainer
        position="top-center"
        className="p-3"
        style={{
          position: "fixed",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1055,
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
            <strong className="me-auto">Watchman Registration</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    name="firstName"
                    value={watchman.firstName}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    name="middleName"
                    value={watchman.middleName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    name="lastName"
                    value={watchman.lastName}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone No</Form.Label>
                  <Form.Control
                    name="phoneNo"
                    value={watchman.phoneNo}
                    onChange={handleChange}
                    maxLength={10}
                    isInvalid={!!errors.phoneNo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
  <Form.Group className="mb-3">
    <Form.Label>Email</Form.Label>
    <Form.Control
      type="email"
      name="email"
      value={watchman.email}
      onChange={handleChange}
      isInvalid={!!errors.email}
    />
    <Form.Control.Feedback type="invalid">
      {errors.email}
    </Form.Control.Feedback>
  </Form.Group>
</Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={watchman.gender}
                    onChange={handleChange}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duty Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="dutyStartTime"
                    value={watchman.dutyStartTime}
                    onChange={handleChange}
                    isInvalid={!!errors.dutyStartTime}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dutyStartTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duty End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="dutyEndTime"
                    value={watchman.dutyEndTime}
                    onChange={handleChange}
                    isInvalid={!!errors.dutyEndTime}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dutyEndTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="joiningDate"
                    value={watchman.joiningDate}
                    onChange={handleChange}
                    isInvalid={!!errors.joiningDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.joiningDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control
                    type="number"
                    name="salary"
                    value={watchman.salary}
                    onChange={handleChange}
                    isInvalid={!!errors.salary}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salary}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12} className="text-end">
                <Button type="submit" variant="primary">
                  Submit
                </Button>{" "}
                <Button type="button" onClick={handleBack} variant="secondary">
                  Back
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
