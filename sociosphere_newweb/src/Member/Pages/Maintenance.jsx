import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReplayIcon from "@mui/icons-material/Replay";
import PaymentIcon from "@mui/icons-material/Payment";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; // DO NOT call autoTable(jsPDF)

export default function Maintenance() {
    const token = localStorage.getItem("token");
    let userid = null;
    if (token) {
        const decode = jwtDecode(token);
        userid = decode.UserId;
    }

    const [data, setData] = useState([]);
    const [item, setItem] = useState({});
    const fetchAllMaintenance = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/MaintenanceRecord/getAllMaintenanceDetailByMember`, {
                headers: {
                    userId: userid,
                },
            });
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleShowMaintenanceDetail = async (id) => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/MaintenanceRecord/getParticularMaintananceDetailByMember/${id}`,
                {
                    headers: {
                        UserId: userid,
                    },
                }
            );
            const data = Array.isArray(res.data) ? res.data[0] || {} : res.data;
            setItem(data);
            return data;
        } catch (error) {
            console.error("Error fetching maintenance details:", error);
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        fetchAllMaintenance();
    }, []);
    const generateInvoicePDF = (item) => {
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const title = "Maintenance Invoice";
        const textWidth = doc.getTextWidth(title);
        const x = (pageWidth - textWidth) / 2;

        doc.setFontSize(18);
        doc.text(title, x, 20);

        doc.setFontSize(12);
        let y = 30;
        doc.text(`Invoice No: ${item.invoiceNo}`, 14, y);
        y += 7;
        doc.text(`Username: ${item.username}`, 14, y);
        y += 7;
        doc.text(`Flat No: ${item.flatNo}`, 14, y);
        y += 7;
        doc.text(`Payment Date: ${item.paidDate}`, 14, y);
        y += 7;
        doc.text(`Maintenance Duration: ${item.startingMonthYear} to ${item.endMonthYear}`, 14, y);
        y += 7;
        doc.text(`Due Date: ${item.dueMonthYear}`, 14, y);
        y += 7;
        doc.text(`Description: ${item.description}`, 14, y);
        y += 14;
        doc.autoTable({
            startY: y,
            head: [["Description", "Calculation", "Amount"]],
            body: [
                [
                    "Monthly Maintenance Charge",
                    item.maintenanceType === "Squrefootsize"
                        ? `₹${item.maintenanceCharge} x ${item.squarfootSize}`
                        : `₹${item.maintenanceCharge} x 1`,
                    `₹${item.montlycharge}`
                ],
                [
                    "Yearly Maintenance (12 months)",
                    `₹${item.montlycharge} x 12`,
                    `₹${item.yearlycharge}`
                ],
                [
                    "Late Payment Charge",
                    `₹${item.latePaymentCharge} x ${item.pendingMonth}`,
                    `₹${item.extraCharge}`
                ],
                [
                    "Total Payable",
                    "",
                    `₹${item.finalMaintenanceCharge}`
                ]
            ],
        });

        doc.save(`Maintenance_Invoice_${item.username}.pdf`);
    };
    return (
        <>
            <Container>
                {/* Header */}
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography sx={{ color: "grey", fontSize: "30px", fontWeight: "bold" }}>
                            Maintenance
                        </Typography>
                    </Grid>
                </Grid>
                <br />

                {/* Maintenance Cards */}
                <Grid container spacing={3}>
                    {data.map((item, index) => (
                        <Grid item xs={12} key={index}>
                            <Card
                                sx={{
                                    p: 2,
                                    borderRadius: "16px",
                                    maxWidth: "400px",
                                    maxHeight: "400px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    "&:hover": { boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)" },
                                }}
                            >
                                <CardContent>
                                    <Grid container spacing={2}>
                                        {/* Left Column */}
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "grey.700" }}>
                                                Maintenance Type:
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: "grey.600" }}>
                                                {item.maintenanceType || "N/A"}
                                            </Typography>

                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "grey.700" }}>
                                                Starting Month-Year:
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: "grey.600" }}>
                                                {item.startingMonthYear || "N/A"}
                                            </Typography>

                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "grey.700" }}>
                                                Due Month-Year:
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: "grey.600" }}>
                                                {item.dueMonthYear || "N/A"}
                                            </Typography>
                                        </Grid>

                                        {/* Right Column */}
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "grey.700" }}>
                                                Maintenance Charge:
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: "grey.600" }}>
                                                ₹{item.maintenanceCharge || "N/A"}
                                            </Typography>

                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "grey.700" }}>
                                                End Month-Year:
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: "grey.600" }}>
                                                {item.endMonthYear || "N/A"}
                                            </Typography>

                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "grey.700" }}>
                                                Late Payment Charge:
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                ₹{item.latePaymentCharge || "N/A"}
                                            </Typography>
                                        </Grid>

                                        {/* Full-Width Description */}
                                        {/* <Grid item xs={12}>
                                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "grey.700" }}>
                                            Description:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 2,
                                                whiteSpace: "pre-wrap", // Preserve line breaks
                                                wordWrap: "break-word", // Handle long words
                                            }}
                                        >
                                            {item.description || "N/A"}
                                        </Typography>
                                    </Grid>
<br/>
                                    Status and Action Button */}
                                        <Grid item xs={12}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",

                                                    mt: 2,

                                                }}
                                            >

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color:
                                                            item.status === null
                                                                ? "orange"
                                                                : item.status === "Rejected"
                                                                    ? "red"
                                                                    : item.status === "Awaiting Approval" ? "#0dcaf0" : "#2196F3",
                                                    }}
                                                >
                                                    {item.status == null ? "Pending" : item.status}
                                                </Typography>
                                                {item.status === null && (
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        startIcon={<PaymentIcon />}
                                                        sx={{ marginLeft: "150px" }}
                                                        onClick={() => navigate(`/Member/MaintenanceDetail/${item.id}`)}

                                                    >
                                                        Pay Now
                                                    </Button>
                                                )}

                                                {item.status === "Completed" && (
                                                    <Button
                                                        variant="contained"

                                                        startIcon={<ReceiptIcon />}
                                                        sx={{ textTransform: "none", marginLeft: "150px", backgroundColor: "#2196F3" }}

                                                        onClick={async () => {
                                                            const detail = await handleShowMaintenanceDetail(item.id);
                                                            if (detail) generateInvoicePDF(detail); // Use the returned data
                                                        }}

                                                    >
                                                        Invoice
                                                    </Button>
                                                )}
                                                {item.status === "Rejected" && (
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        startIcon={<ReplayIcon />}
                                                        sx={{ marginLeft: "150px", textTransform: "none" }}
                                                        onClick={() => navigate(`/Member/MaintenanceDetail/${item.id}`)}

                                                    >
                                                        Pay Again
                                                    </Button>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container >
        </>
    );
}