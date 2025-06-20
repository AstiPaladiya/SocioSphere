import React, { useDebugValue, useEffect, useState } from "react";
import axios from "axios";
import {
    Typography, Grid, Button, Card, CardContent, Tab, Tabs,
    Table, TableBody, TableCell, TableContainer, Box, TableSortLabel,
    TableHead, TablePagination, TableRow, Paper, TableFooter, useTheme,
    Avatar, tabClasses, Pagination
} from "@mui/material";
import { tabsClasses } from '@mui/material/Tabs';
import { FaPhoneAlt, FaWindows } from "react-icons/fa";
import API_BASE_URL from "../../config";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Toast, ToastContainer, Modal, Form, Container, Row, Col, InputGroup } from "react-bootstrap";
import { IoIosEye } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";


export default function Agency() {
    //tab stat
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (type[newValue]) {
            fetchAgencyContact(type[newValue].id);
        }
    };
    const [showToast, setShowToast] = useState(false);
    const [toastHeader, setToastHeader] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [type, setType] = useState([]);
    const [row, setRows] = useState([]);
    //pagination
    const [page, setPage] = useState(1);
    const itemsPerPage = 4;
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const pageCount = Math.ceil(row.length / itemsPerPage);
    const paginatedSuggestions = row.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    function chunkArray(array, size) {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    const fectAgencyType = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/AgencyContact/getActiveAgencyType`);
            setType(res.data);
            // Automatically fetch contacts for the first type
            if (res.data.length > 0) {
                fetchAgencyContact(res.data[0].id); // Fetch contacts for the first type
            }
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
    }
    // fetch agency contact by type
    const fetchAgencyContact = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/AgencyContact/agencyContactByType/${id}`);
            setRows(res.data);
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        fectAgencyType();
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
                    autohide
                >
                    <Toast.Header >
                        <div className="w-100 justify-content-center" style={{ fontSize: "20px" }}>
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
                            Agency
                        </Typography>
                    </Grid>

                </Grid>
                <br />
                <Box sx={{
                    width: "100%", // Full width for the container
                    maxWidth: { xs: "100%", sm: "600px", md: "800px", lg: "1200px" }, // Adjust max width based on screen size
                    mx: "auto", // Center the box horizontally
                    bgcolor: "background.paper", // Background color
                    p: 1
                }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="scrollable force tabs example"
                        sx={{
                            [`& .${tabsClasses.scrollButtons}`]: {
                                '&.Mui-disabled': { opacity: 0.3 },
                            },
                        }}
                    >
                        {type.map((type) => (
                            <Tab key={type.id} label={type.agencyTypeName} sx={{ px: 6 }} onClick={() => { fetchAgencyContact(type.id) }} />
                        ))}
                    </Tabs>
                </Box><br /><br/>   
                <Grid container spacing={3}>
                    {paginatedSuggestions.length === 0 ? (<div style={{ color: "grey", fontSize: "18px", textAlign: "center" }}>
                        No Record available related to this agency type
                    </div>
                    ) : (chunkArray(paginatedSuggestions, 2).map((row, rowIdx) => (
                        <Box
                            key={rowIdx}
                            display="flex"
                            justifyContent="center"
                            alignItems="stretch"
                            // mb={1}
                            sx={{
                                gap: 2,

                            }}
                        >
                            {row.map((row) => (
                                <Grid item xs={12} md={6} lg={6} key={row.id}>
                                    <Card
                                        key={row.id}
                                        sx={{
                                            flex: 2,
                                            width: "430px",
                                            display: "flex",
                                            flexDirection: "column",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow for better appearance
                                            borderRadius: "8px", // Rounded corners
                                            p: 2, // Padding inside the card
                                            bgcolor: "background.paper", // Background color
                                        }}
                                    >
                                        <CardContent>
                                            {/* Contact Person Name */}
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: "bold", color: "#1976d2" }}
                                            >
                                                {row.contactPersonName || "N/A"}
                                            </Typography>
                                            <hr />
                                            {/* Location */}
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "grey.700", fontSize: "15px", display: "flex", alignItems: "center", mb: 1, cursor: "pointer", "&:hover": { color: "#1976d2" } }}
                                                onClick={() => { window.open(`https://www.google.com/maps?q=${row.location}`, "_blank") }}
                                            >
                                                <FaMapMarkerAlt style={{ marginRight: "10px" }} />
                                                {row.location || "N/A"}
                                            </Typography>

                                            {/* Email ID */}
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "grey.700", fontSize: "15px", display: "flex", alignItems: "center", mb: 1, cursor: "pointer", "&:hover": { color: "#1976d2" } }}
                                                onClick={() => {
                                                    window.location.href = `mailto:${row.emailId}`;
                                                }}
                                            >
                                                <FaEnvelope style={{ marginRight: "10px" }} />
                                                {row.emailId || "N/A"}
                                            </Typography>

                                            {/* Contact Number */}
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "grey.700", fontSize: "15px", display: "flex", alignItems: "center", mb: 1, cursor: "pointer", "&:hover": { color: "#1976d2" } }}
                                                onClick={() => {
                                                    window.location.href = `tel:${row.contactNo}`;
                                                }}
                                            >
                                                <FaPhoneAlt style={{ marginRight: "10px" }} />
                                                {"+" + row.contactNo || "N/A"}
                                            </Typography>

                                            {/* Alternate Contact Number */}
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "grey.700", display: "flex", alignItems: "center", cursor: "pointer", "&:hover": { color: "#1976d2" } }}
                                                onClick={() => {
                                                    window.location.href = `tel:${row.alternateContactNo}`;
                                                }}
                                            >
                                                <FaPhone style={{ marginRight: "10px" }} />
                                                {"+" + row.alternateContactNo || "N/A"}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                            ))}
                        </Box>

                    ))

                    )}
                    {/* Centered Pagination */}

                </Grid>
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>

            </Container>
        </>
    )
}