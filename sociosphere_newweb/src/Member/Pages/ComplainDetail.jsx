import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Box,
    Avatar,
    Grid, Button
} from "@mui/material";
import { Toast, ToastContainer, Modal, Form, Row, Col, InputGroup, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { FaEdit } from "react-icons/fa";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { jwtDecode } from "jwt-decode";
export default function ComplainDetail() {

    let userid = null;
    const token=localStorage.getItem("token");
    if (token) {
        const decode = jwtDecode(token);
        userid = decode.UserId;
    }
    const { id } = useParams();
    const [contact, setContactData] = useState({
        type: "",
        title: "",
        description: "",
        image: null,
        priority: ""
    });
    const [complainTypes, setCcomplainType] = useState([]);
    const [billImagePreview, setBillImagePreview] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastHeader, setToastHeader] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [comData, setComplainData] = useState({});
    const [show, setShow] = useState(false);
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
    const [editId, setEditId] = useState({ id: "" });
    const handleModal = (id, complainTitle, description, priority, complainTypeId, photo) => {
        setShow(true);
        setEditId({ id: id });
        setContactData({
            type: complainTypeId,
            title: complainTitle,
            description: description,
            image: photo,
            priority: priority
        });
        setBillImagePreview(photo || null);

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
    useEffect(() => {
        fetchComplainDetail();
        fetchComplainType();
    }, []);
    //fetch complain type
    const fetchComplainType = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Complain/getActiveComplainType`);
            setCcomplainType(res.data);

        } catch (error) {
            console.log(error);
        }
    }
    const fetchComplainDetail = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Complain/${id}`);
            if (Array.isArray(res.data)) {
                setComplainData(res.data[0] || {});
            } else {
                setComplainData(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
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
            const res = await axios.put(`${API_BASE_URL}/Complain/updateComplain/${editId.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const msg = res.data.message || "Complain updated successfully";
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
            fetchComplainDetail();
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
            fetchComplainDetail();
        }
    }
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
                <Typography
                    sx={{
                        color: "grey",
                        fontSize: "30px",
                        fontWeight: "bold",
                        mb: 2,
                    }}
                >
                    Complain Detail
                </Typography>

                {/* Chat Frame */}
                <Box
                    sx={{
                        bgcolor: "white",
                        borderRadius: "2px",
                        p: 2,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        maxWidth: "900px",
                        margin: "0 auto",
                    }}
                >
                    {/* User's Complaint */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            mb: 2,
                            width: "100%", // Ensures the box spans the full width
                        }}
                    >

                        <Box
                            sx={{
                                bgcolor: "#e0f7fa",
                                borderRadius: "16px 16px 0px 16px",
                                p: 2,
                                width: "100%", // Ensures the content box adjusts dynamically
                                maxWidth: "400px", // Sets a maximum width for the content box
                                boxShadow: "0 6px 6px rgba(0, 0, 0, 0.15)", // Adds a stronger shadow for emphasis

                            }}
                        >
                            {comData.photo && (
                                <div className="mb-2"
                                >
                                    <img
                                        src={comData.photo}
                                        alt="Complaint Image"
                                        style={{
                                            width: "100%", // Ensures the image spans the width of the container
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                            height: "200px" // Adds rounded corners to the image
                                        }}
                                    />
                                </div>
                            )}
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between', gap: 2 }}>
                                <div
                                    style={{
                                        backgroundColor: "#2196F3",
                                        borderRadius: "8px",
                                        textAlign: "center",
                                        padding: "4px 8px", // Adds padding for better appearance
                                        color: "white",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {comData.complainType}
                                    {/* </Typography> */}

                                </div>

                                <div
                                    style={{
                                        backgroundColor:
                                            comData.priority === "High"
                                                ? "#F44336" // Red for high priority
                                                : comData.priority === "Medium"
                                                    ? "#FFC107" // Yellow for medium priority
                                                    : comData.priority === "Low"
                                                        ? "#4CAF50" // Green for low priority
                                                        : "#9E9E9E", // Grey for unspecified priority
                                        borderRadius: "8px",
                                        textAlign: "center",
                                        padding: "4px 8px", // Adds padding for better appearance
                                        color: "white",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {/* <Typography variant="body2" sx={{ fontWeight: "bold", color:"white" ,display: "flex", alignItems: "center", gap: 1 }}> */}
                                    {comData.priority || "Not specified"}
                                    {/* </Typography> */}

                                </div>
                            </div>



                            <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "16px", mb: 1, marginTop: 2 }}>
                                {comData.complainTitle || "Not specified"}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "12px", color: 'grey', mb: 2 }}>
                                {comData.description || "No description available"}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center", // Align icon and text vertically
                                    justifyContent: "space-between", // Push the icon to the right
                                }}
                            >
                                {/* Created At Text */}
                                <Typography
                                    variant="caption"
                                    sx={{ color: "grey.500", display: "block", mb: 0 }}
                                >
                                    {comData.createdAt}
                                </Typography>

                                {/* Conditionally render the pencil icon */}
                                {(comData.status === "Pending" || comData.status === "Rejected") && (
                                    <EditIcon
                                        sx={{
                                            color: "grey.500", // Icon color
                                            fontSize: "18px", // Adjust icon size
                                            cursor: "pointer", // Add pointer cursor for interactivity
                                        }}

                                        onClick={() => handleModal(comData.id, comData.complainTitle, comData.description, comData.priority, comData.complainTypeId, comData.photo)}
                                    />
                                )}
                            </Box>
                        </Box>

                        <Avatar
                            src={comData.memberProfilePic != null ? (comData.memberProfilePic) : ("/admin-avatar.png")}// Replace with admin image URL
                            alt="User Image"
                            sx={{ width: 50, height: 50, mx: 2 }} // Slightly larger avatar for better visibility
                        />

                    </Box>

                    {comData.status === "Pending" ? (
                        // Status Box for Pending
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                mb: 2,
                                width: "100%"
                            }}
                        >
                            <Avatar
                                src={comData.adminProfilePic != null ? (comData.adminProfilePic) : ("/admin-avatar.png")}// Replace with admin image URL
                                alt="Admin Image"
                                sx={{ width: 40, height: 40, mx: 2 }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "#FFF3E0", // Light orange background for a warm look
                                    borderRadius: "0px 16px 16px 16px",
                                    p: 2,
                                    width: "100%", // Ensures the content box adjusts dynamically
                                    maxWidth: "400px",

                                    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.15)", // Adds a stronger shadow for emphasis
                                    textAlign: "center", // Centers the text inside the box
                                }}
                            >
                                <AccessTimeIcon sx={{ fontSize: "30px", color: "#FF6F00", mb: 1 }} /> {/* Larger icon */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        color: "#BF360C", // Dark orange text for contrast
                                    }}
                                >
                                    Response Pending
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: "14px",
                                        color: "#5D4037", // Brown text for subtle emphasis
                                        mt: 1,
                                    }}
                                >
                                    Please wait while the admin reviews your complaint.
                                </Typography>
                            </Box>



                        </Box>
                    ) : (
                        // Admin's Response for Other Statuses
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                mb: 2,
                                width: "100%"
                            }}
                        >
                            <Avatar
                                src={comData.adminProfilePic != null ? (comData.adminProfilePic) : ("/admin-avatar.png")}// Replace with admin image URL
                                alt="Admin Image"
                                sx={{ width: 40, height: 40, mx: 2 }}
                            />
                            <Box
                                sx={{
                                    bgcolor: "#e8f5e9",
                                    borderRadius: "0px 16px 16px 16px",
                                    p: 2,
                                    width: "100%", // Ensures the content box adjusts dynamically
                                    maxWidth: "400px",
                                    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.15)", // Adds a stronger shadow for emphasis

                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "16px" }}>
                                    {comData.adminActionTakenNote || "No action note available"}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{ fontSize: "12px", color: "grey" }}
                                >
                                    {comData.status === "In Progress" && "Resolution Due Date: "}
                                    {comData.status === "Rejected" && "Rejected At: "}
                                    {comData.status === "Completed" && "Completed At: "}
                                    {comData.actionTakenDueDate
                                    }
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-start", // Aligns the content to the right
                                        mt: 2, // Adds margin-top for spacing
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: "12px",
                                            color: "grey",
                                        }}
                                    >
                                        {comData.updatedAt}
                                    </Typography>
                                </Box>
                            </Box>

                        </Box>
                    )}
                </Box>
            </Container >
            <Modal show={show} size="xl" onHide={handleClose} style={{ zIndex: 1060 }} >
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center" >Update Complain</Modal.Title>
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
                                            <div style={{ color: "red" }}>If you want to change the image, then select a new one.
                                            </div>

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