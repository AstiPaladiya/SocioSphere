import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Button,
    TextField,
    Input,
    Divider,
} from "@mui/material";
import { Toast, ToastContainer, Modal, Form, Container, Row, Col, InputGroup, Badge } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from "../../config";

export default function MaintenanceDetail() {
    const [item, setItem] = useState({});
    const [formData, setFormData] = useState({ LatePaymentReason: "", PaymentImage: "" });
      const [showToast, setShowToast] = useState(false);
        const [toastHeader, setToastHeader] = useState("");
        const [toastMessage, setToastMessage] = useState("");
        const [toastVariant, setToastVariant] = useState("success");
    const [error, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }
    const validate = () => {
        let newErrors = {}
        if (!formData.PaymentImage) {
            newErrors.PaymentImage = "Maintenance proof is required.";
        } else {
            // Check if the uploaded file is an image
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!validImageTypes.includes(formData.PaymentImage.type)) {
                newErrors.PaymentImage = "Invalid file type. Please upload a JPG,JPEG or PNG image.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const token = localStorage.getItem("token");
    let UserId = null;
    if (token) {
        const decode = jwtDecode(token);
        UserId = decode.UserId;
    }

    const { id } = useParams();

    useEffect(() => {
        fetchMaintenanceDetail();
    }, []);

    const fetchMaintenanceDetail = async () => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/MaintenanceRecord/getParticularMaintananceDetailByMember/${id}`,
                {
                    headers: {
                        UserId: UserId,
                    },
                }
            );
            if (Array.isArray(res.data)) {
                setItem(res.data[0] || {});
            } else {
                setItem(res.data);
            }
        } catch (error) {
            console.error("Error fetching maintenance details:", error);
        }
    };

const navigate=useNavigate();
    const handlePayNow = async () => {

        // Call the validate function
        const isValid = validate();
        if (!isValid) {
            return; // Stop submission if validation fails
        }

        // Create a FormData object to send the data
        const formDataToSend = new FormData();
        formDataToSend.append("MaintenanceId", item.id); // Maintenance ID
        formDataToSend.append("UserId", UserId); // User ID
        formDataToSend.append("TotalMaintenance", item.finalMaintenanceCharge); // Total Maintenance Charge
        formDataToSend.append("PaidDate", item.paidDate); // Paid Date
        formDataToSend.append("LatePaymentAmount", item.extraCharge); // Late Payment Amount
        formDataToSend.append("LatePaymentReason", formData.LatePaymentReason); // Late Payment Reason
        if (formData.PaymentImage) {
            formDataToSend.append("PaymentImage", formData.PaymentImage); // Uploaded Payment Proof

        }

        try {
            // Send the data to the server
            const res = await axios.post(`${API_BASE_URL}/MaintenanceRecord`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

             const msg = res.data.message || "Maintenance Payment successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setFormData({
               LatePaymentReason: "", PaymentImage: "" 
            });
            navigate("/Member/Maintenance");
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
            
        }
    };

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
        <Box sx={{ fontFamily: "Arial, sans-serif", background: "#f9f9f9", padding: "40px" }}>
            <Box
                sx={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "12px",
                    maxWidth: "800px",
                    margin: "auto",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
                    <Typography variant="h5" sx={{ marginBottom: "8px", fontWeight: "bold", color: "black" }}>
                        Maintenance Payment Receipt
                    </Typography>
                    <Typography variant="body2" sx={{ color: "grey.600" }}>
                        <strong>Paid Date:</strong> {item.paidDate || "N/A"}
                    </Typography>
                </Box>
                <hr sx={{ marginBottom: "20px" }} />

                {/* Maintenance Plan Section */}
                <Box sx={{ marginBottom: "20px" }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "18px", marginBottom: "14px", color: "black" }}>
                        Maintenance Plan Details
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: "6px", color: "grey.700" }}>
                        <strong>Type:</strong> {item.maintenanceType || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: "6px", color: "grey.700" }}>
                        <strong>Description:</strong>                             <span dangerouslySetInnerHTML={{ __html: item.description || "N/A" }} />

                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: "6px", color: "grey.700" }}>
                        <strong>Duration:</strong> {item.startingMonthYear} to {item.endMonthYear}
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: "6px", color: "grey.700" }}>
                        <strong>Due Month:</strong> {item.dueMonthYear || "N/A"}
                    </Typography>
                </Box>
                <Divider sx={{ marginBottom: "20px" }} />

                {/* Calculation Section */}
                <Box sx={{ marginBottom: "20px" }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px", color: "black" }}>
                        Maintenance Charges Breakdown
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Monthly Maintenance Charge</TableCell>
                                    <TableCell sx={{ color: "grey.700" }}>
                                        {item.maintenanceType === "Squrefootsize"
                                            ? `₹${item.maintenanceCharge} x ${item.squarfootSize} = ₹ ${item.montlycharge}`
                                            : `₹${item.maintenanceCharge} x 1 = ₹ ${item.montlycharge}`}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Yearly Maintenance (12 months)</TableCell>
                                    <TableCell sx={{ color: "grey.700" }}>
                                        ₹ {item.montlycharge} x 12 = ₹ {item.yearlycharge}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>Late Payment Charge</TableCell>
                                    <TableCell sx={{ color: "grey.700" }}>
                                        ₹ {item.latePaymentCharge} x {item.pendingMonth} = ₹ {item.extraCharge}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "16px", color: "black" }}>Total Payable</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "16px", color: "black" }}>
                                        ₹ {item.finalMaintenanceCharge}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Divider sx={{ marginBottom: "20px", }} />

                {/* Late Payment Section */}

                <Box sx={{ marginBottom: "20px" }}>
                    {item.isLatePayment && (<>  <Typography sx={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px", color: "black" }}>
                        Late Payment Reason
                    </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter reason for late payment"
                            variant="outlined"
                            name="LatePaymentReason"
                            value={formData.LatePaymentReason}
                            onChange={handleChange}
                            sx={{ marginBottom: "18px", color: "grey.700" }}
                        /></>)}
                    <Typography variant="body2" sx={{ fontSize: "18px", marginBottom: "10px", color: "black" }}>
                        <strong>Upload Payment Proof:</strong>
                    </Typography>
                    <Input
                        type="file"
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                PaymentImage: e.target.files[0],
                            }));
                            setErrors((prev) => ({
                                ...prev,
                                PaymentImage: "",
                            }));
                        }}
                        sx={{
                            marginBottom: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            padding: "6px",
                            width: "100%",
                        }}
                    />
                    {error.PaymentImage && (
                        <Typography variant="body2" sx={{ color: "red", marginTop: "4px" }}>
                            {error.PaymentImage}
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ marginBottom: "20px" }} />

                {/* Pay Now Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ fontWeight: "bold", padding: "12px", fontSize: "16px" }}
                    onClick={handlePayNow}
                >
                    Pay Now
                </Button>
            </Box>
        </Box>
        </>
    );
}