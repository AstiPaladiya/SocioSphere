import React, { useState, useEffect } from "react";
import { Toast, ToastContainer, Modal, Form, Container, Row, Col, InputGroup, Badge } from "react-bootstrap";
import { Button, Typography, Grid, Card, CardContent, Box, Avatar, Chip } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddIcon from "@mui/icons-material/Add";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_BASE_URL from "../../config";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useNavigate } from "react-router-dom";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { FaEdit } from "react-icons/fa";

export default function Complain() {
    const token = localStorage.getItem("token");
    let userid = null;
    if (token) {
        const decode = jwtDecode(token);
        userid = decode.UserId;
    }
    const [contact, setContactData] = useState({
        type: "",
        title: "",
        description: "",
        image: null,
        priority: ""
    });
    const [complainTypes, setCcomplainType] = useState([]);
    const [billImagePreview, setBillImagePreview] = useState(null);
    const [show, setShow] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastHeader, setToastHeader] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const handleClose = () => {
        setShow(false);
        setContactData({
            type: "",
            title: "",
            description: "",
            image: null,
            priority: ""
        });
        setBillImagePreview(null);
        setErrors({});
    }
    const [error, setErrors] = useState({});
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const handleCardClick = (id) => {
        navigate(`/Member/ComplainDetail/${id}`);
    }
    const handleComplainModal = () => {
        setShow(true);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }
    const [selectedMember,setSelectedMember]=useState("");
    const [complain,setComplainDropDown]=useState(false);
   const showMemberDropDown = () => {
    fetchComplainType();
    setComplainDropDown(true);
  }
    const validateContact = () => {
        let newErrors = {};

        if (!contact.title.trim()) newErrors.title = " Complain title is required";
        if (!contact.type || contact.type == "") newErrors.type = "Please select any of one complain type";



        if (!contact.priority || contact.priority == "")
            newErrors.priority = "Please select any of one complain type";
        if (!contact.description || contact.description == "")
            newErrors.description = "Complain detail is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const fecthAllComplain = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Complain/allComplainForMember`, {
                headers: {
                    userId: userid
                }
            });
            setData(res.data);
            setComplainDropDown(false);
        } catch (error) {
            console.log(error);

        }
    }
    //fetch complain type
    const fetchComplainType = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Complain/getActiveComplainType`);
            setCcomplainType(res.data);
            
        } catch (error) {
            console.log(error);
        }
    }
    const handleSubmitComplain = async (e) => {
        e.preventDefault();
        if (!validateContact()) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append("UserId", userid);
            formData.append("ComplainTypeId", contact.type);
            formData.append("ComplainTitle", contact.title);
            formData.append("Description", contact.description);
            formData.append("Priority", contact.priority);
            if (contact.image) {
                formData.append("Photo", contact.image); // append the file object
            }
            const res = await axios.post(`${API_BASE_URL}/Complain`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const msg = res.data.message || "Complain Added successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setContactData({
                type: "",
                title: "",
                description: "",
                image: null,
                priority: ""
            });
            setBillImagePreview(null);
            setShow(false);
            fecthAllComplain();

        } catch (error) {
            let message =
                error.response?.data?.message || // if API sends { message: "something" }
                error.response?.data ||          // if API sends just a string
                "Some error occured.Please try again";
            // If message is an object, convert to string
            if (typeof message === "object") {
                message = JSON.stringify(message);
            }
            setToastHeader("Error!")
            setToastMessage(message);
            setToastVariant("danger");
            setShowToast(true);
            setShow(false);
            fecthAllComplain();
        }
    }
const handleSelectComplain=async(id)=>{
     try {
            const res = await axios.get(`${API_BASE_URL}/Complain/allComplainForMemberBytype/${id}`, {
                headers: {
                    userId: userid
                }
            });
            setData(res.data);
            setSelectedMember(id);
            setComplainDropDown(false);
        } catch (error) {
            console.log(error);

        }
}
    useEffect(() => {
        fetchComplainType();
        fecthAllComplain();
        setComplainDropDown(false);
    }, []);
    return (
        <>
            <ToastContainer position="top-center"
                // className="position-fixed top-0 start-50 translate-middle-x "
                //  style={{marginTop:"5%",textAlign:"center"}}
                className="p-3"
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    textAlign: "center"
                }}
            >
                <Toast
                    bg={toastVariant}
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide>
                    <Toast.Header >
                        <div className="w-100 justify-content-center" style={{ fontSize: "20px" }}>
                            <strong className="me-auto" >{toastHeader}</strong>
                        </div>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Container>
                {/* Header */}
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography sx={{ color: "grey", fontSize: "30px", fontWeight: "bold" }}>
                            Complain
                        </Typography>
                    </Grid>
                </Grid>
                <br />

                {/* Action Buttons */}
                <Row>
                    <Col md={10}>
                        <Button
                            style={{
                                alignItems: "center",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                fontWeight: 500,
                                fontSize: "15px",
                                color: "#333",
                                textTransform: "none",
                                float: "left", // Align to the left
                            }}
                            onClick={()=>showMemberDropDown()}
                        >
                            <ViewListIcon style={{ marginRight: "8px" }} />

                        </Button>
                           {complain && (
                                    <Box
                                      sx={{
                                        position: "fixed", // or "fixed" if you want it to stay on screen
                                         top: 170,             // adjust as needed
                                        right: 700,            // adjust as needed
                                        width: 200,
                                        maxHeight: 250,
                                        bgcolor: "background.paper",
                                        boxShadow: 3,
                                        borderRadius: 1,
                                        overflowY: "auto",
                                        zIndex: 1200,
                                        p: 1,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          p: 1,
                                          cursor: "pointer",
                                          borderRadius: 1,
                                          bgcolor: selectedMember === "" ? "primary.light" : "transparent",
                                          "&:hover": { bgcolor: "grey.100" }
                                        }} onClick={() => {
                                          setSelectedMember("");
                                          fecthAllComplain();
                                        }}>All</Box>
                                      {complainTypes.map((m) => (
                                        <Box
                                          key={m.id}
                                          sx={{
                                            p: 1,
                                            cursor: "pointer",
                                            bgcolor: selectedMember === m.id ? "primary.light" : "transparent",
                                            borderRadius: 1,
                                            "&:hover": { bgcolor: "grey.100" }
                                          }}
                                          onClick={() => handleSelectComplain(m.id)}
                                        >
                                          {m.complainName}
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                    </Col>
                    <Col md={2}>
                        <Button
                            style={{
                                borderRadius: "50%",
                                minWidth: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "none",
                                color: "#333",
                                float: "right",
                                border: "1px solid"

                            }}
                            onClick={() => handleComplainModal()}
                        >
                            <AddIcon />
                        </Button>
                    </Col>
                </Row>
                <hr />
                {/* Complaints List */}
                <Grid container spacing={2}>
                    {data.map((complain) => (
                        <Grid item xs={12} key={complain.id}>
                            <Card
                                sx={{
                                    minWidth: "900px",
                                    display: "flex",
                                    alignItems: "center",
                                    p: 2,
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    "&:hover": { boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)" },
                                }}
                                onClick={() => handleCardClick(complain.id)}
                            >
                                {/* Complaint Icon */}
                                <Avatar
                                    sx={{
                                        bgcolor: "primary.main",
                                        width: 50,
                                        height: 50,
                                        mr: 2,
                                    }}
                                >
                                    {complain.comtype[0]}
                                </Avatar>

                                {/* Complaint Details */}
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        {complain.complainTitle}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "grey.600" }}>
                                        {complain.comtype}
                                    </Typography>
                                </CardContent>

                                {/* Complaint Status */}
                                <Box
                                    sx={{
                                        bgcolor: "grey.200",
                                        px: 2,
                                        py: 1,
                                        borderRadius: "8px",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        {complain.status === "Pending" && <AccessTimeIcon sx={{ color: "#FFC107" }} />} {/* Yellow */}
                                        {complain.status === "Completed" && <CheckCircleOutlineIcon sx={{ color: "#4CAF50" }} />} {/* Green */}
                                        {complain.status === "Rejected" && <HighlightOffIcon sx={{ color: "#F44336" }} />} {/* Red */}
                                        {complain.status === "In Progress" && <AutorenewIcon sx={{ color: "#2196F3" }} />} {/* Blue */}
                                        {complain.status}
                                    </Typography>

                                </Box>


                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Modal show={show} size="xl" onHide={handleClose} style={{ zIndex: 1060 }} >
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center" >Add Complain</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitComplain}>

                    <Modal.Body>
                        <Row>
                            {/* Complain Type */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Complain Type:</Form.Label>
                                    <Form.Select name="type" value={contact.type} onChange={handleChange}>
                                        <option value="">--Select Complain Type--</option>
                                        {complainTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.complainName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {error.type && <div style={{ color: "red" }}>{error.type}</div>}
                                </Form.Group>
                            </Col>
                            {/* Priority */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Priority:</Form.Label>
                                    <Form.Select
                                        name="priority"
                                        value={contact.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="">--Select Priority--</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </Form.Select>
                                    {error.priority && <div style={{ color: "red" }}>{error.priority}</div>}
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row>
                            {/* Left Side: Complain Title and Image Upload */}
                            <Col md={6}>
                                <Row>
                                    {/* Complain Title */}
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Complain Title:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter complain title"
                                                name="title"
                                                value={contact.title}
                                                onChange={handleChange}
                                            />
                                            {error.title && <div style={{ color: "red" }}>{error.title}</div>}
                                        </Form.Group>
                                    </Col>

                                    {/* Complain Image */}
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Complain Image: <span style={{ color: "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    setContactData((prev) => ({ ...prev, image: file || "" }));
                                                    if (file) {
                                                        setBillImagePreview(URL.createObjectURL(file));
                                                    } else {
                                                        setBillImagePreview(null);
                                                    }
                                                }}
                                                accept="image/*"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>

                            {/* Right Side: Image Preview */}
                            <Col md={6}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        minHeight: "150px",
                                        height: "100%",// Adjust height as needed
                                        background: "#fafbfc",
                                    }}
                                >
                                    {billImagePreview ? (< img
                                        alt="Preview Complain Image"
                                        src={billImagePreview ? billImagePreview : null}
                                        style={{
                                            maxWidth: "80%",
                                            maxHeight: "80%",
                                            objectFit: "contain", // Ensures the image fits within the container
                                        }}
                                    />
                                    ) : (
                                        <div style={{ textAlign: "center" }}>
                                            <CameraAltIcon style={{ fontSize: "40px", color: "#ccc" }} />
                                            <p style={{ marginTop: "8px", color: "#aaa" }}>Image not uploaded</p>
                                        </div>
                                    )
                                    }
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            {/* Description */}
                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Complain Detail:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="description"
                                        placeholder="Enter complain detail..."
                                        value={contact.description}
                                        onChange={handleChange}
                                    />
                                    {error.description && <div style={{ color: "red" }}>{error.description}</div>}
                                </Form.Group>
                            </Col>



                        </Row>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#41d2e7", color: "white" }}
                            type="submit"
                        >
                            Save Complain
                        </Button>
                        &nbsp;
                        <Button
                            type="button"
                            variant="contained"
                            style={{ backgroundColor: "#6C757D", color: "white" }}
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}