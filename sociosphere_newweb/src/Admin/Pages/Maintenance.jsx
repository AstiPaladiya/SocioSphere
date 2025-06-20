import React, { useDebugValue, useEffect, useState } from "react";
// import   "../../App.css";
import axios from "axios";
import {
    Typography, Grid, Button, Card, CardContent, Tab, Tabs,
    Table, TableBody, TableCell, TableContainer, Box, TableSortLabel,
    TableHead, TablePagination, TableRow, Paper, TableFooter, useTheme, Collapse,
    Divider
} from "@mui/material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaDownload, FaPhoneAlt, FaRupeeSign } from "react-icons/fa";
import API_BASE_URL from "../../config";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Toast, ToastContainer, Modal, Form, Container, Row, Col, InputGroup, Badge } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { MdDelete, MdUploadFile } from "react-icons/md";
import { MdFileDownload } from "react-icons/md";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { FaFileInvoice } from "react-icons/fa";
import { CalendarMonth, EventAvailable, EventBusy, AttachMoney, MonetizationOn } from "@mui/icons-material"; // Import Material-UI icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import jsPDF from "jspdf";
import "jspdf-autotable"; 
import { jwtDecode } from "jwt-decode";
//Pagonation extra button
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}
// //Filtering
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
const columns = [
    { id: 'id', label: '#' },
    { id: 'paymentDate', label: 'Payment Date' },
    { id: 'flatNo', label: 'Flat No' },
    { id: 'member', label: 'Member' },
    { id: 'totalMaintenance', label: 'Total Maintenance' },
    { id: 'status', label: 'Status' },
    { id: 'view', label: 'View' },
    { id: 'action', label: 'Action' },

];

export default function Maintenance() {
    const [value, setValue] = React.useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderDirection, setOrderDirection] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // initially no column is sorted
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastHeader, setToastHeader] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [agtype, setType] = useState([]);
    const [rows, setRows] = useState([]);
    const [show, setShow] = useState(false);
    const [dueMonthOptions, setDueMonthOptions] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEdit, setEdit] = useState(false);
    const [editId, setEditId] = useState({ id: "" });
    const [open, setOpen] = useState(null);
    const [reject, setRejectModal] = useState(false);
    const [rejectId, setRejectId] = useState({ maintenanceRecordId: "", id: "" });
    const [rejectData, setRejectData] = useState({ reason: "" });
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        MaintenanceCharge: "",
        Description: "",
        StartingMonthYear: null,
        EndMonthYear: null,
        DueMonthYear: null,
        LatePaymentCharge: "",
        MaintenanceType: "",
    })
    // sorting function
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    //open expand row
    const openExpandRow = (id) => {
        setOpen(open == id ? null : id);
    }
    const handleSortRequest = (columnId) => {
        const isAsc = orderBy === columnId && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(columnId);
    };
    const handleAddModal = () => {
        setShow(true);
    }
    const handleShowImage = (photo) => {
        setSelectedImage(photo);
        setShowImageModal(true);
    }
    const handleModal = (id, maintenanceCharge, description, startingMonthYear, endMonthYear, dueMonthYear, latePaymentCharge, maintenanceType) => {
        setFormData({
            MaintenanceCharge: maintenanceCharge,
            Description: description,
            StartingMonthYear: startingMonthYear,
            EndMonthYear: endMonthYear,
            DueMonthYear: dueMonthYear,
            LatePaymentCharge: latePaymentCharge,
            MaintenanceType: maintenanceType,
        });
        setEditId({ id: id });
        setEdit(true);
        setShow(true);
    }
    const handleClose = () => {
        setShow(false);
        setErrors({});
        setFormData({
            MaintenanceCharge: "",
            Description: "",
            StartingMonthYear: null,
            EndMonthYear: null,
            DueMonthYear: null,
            LatePaymentCharge: "",
            MaintenanceType: "",
        });
        setEdit(false);
        setEditId({ id: "" });
        setRejectModal(false);
        setRejectId({ maintenanceRecordId: "", id: "" });
        setShowImageModal(false);

    };
    const handleShowRejectModal = (maintenanceRecordId, id) => {
        setRejectId({
            maintenanceRecordId: maintenanceRecordId,
            id: id
        })
        setRejectModal(true);
    }
    // Handle input changes
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle float values for MaintenanceCharge and LatePaymentCharge
        const floatFields = ["MaintenanceCharge", "LatePaymentCharge"];
        const updatedValue = floatFields.includes(name) ? parseFloat(value) || "" : value;

        setFormData((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };
    const handleRejectDataChange = (e) => {
        const { name, value } = e.target;

        setRejectData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }

    const validate = () => {
        const newErrors = {};

        if (!rejectData.reason || rejectData.reason == null) {
            newErrors.reason = "Reason is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
   
        const [item, setItem] = useState({});
       const handleShowMaintenanceDetail = async (id,userid) => {
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
            // doc.text(`Invoice No: ${item.receiptNo}`, 14, y);
            // y += 7;
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
    // Handle Starting Month-Year change
    const handleStartingMonthYearChange = (e) => {
        const startDate = new Date(e.target.value); // Parse the selected date
        const endMonthYear = new Date(startDate.getFullYear(), startDate.getMonth() + 12, 1); // Add 12 months for end date
        const dueMonths = generateMonthOptions(startDate, endMonthYear); // Generate due month options

        setFormData((prev) => ({
            ...prev,
            StartingMonthYear: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-01`, // Format as YYYY-MM-DD
            EndMonthYear: `${endMonthYear.getFullYear()}-${String(endMonthYear.getMonth() + 1).padStart(2, "0")}-01`, // Format as YYYY-MM-DD
            DueMonthYear: "", // Reset due month-year
        }));
        setDueMonthOptions(dueMonths); // Update due month options
    };
    // Generate month options between start and end dates
    const generateMonthOptions = (startDate, endDate) => {
        const options = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            options.push({
                value: `${currentDate.getFullYear()}-${String(
                    currentDate.getMonth() + 1
                ).padStart(2, "0")}-01`,
                label: `${currentDate.toLocaleString("default", {
                    month: "long",
                })} ${currentDate.getFullYear()}`,
            });
            currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
        }

        return options;
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.MaintenanceCharge || formData.MaintenanceCharge <= 0) {
            newErrors.MaintenanceCharge = "Maintenance charge must be greater than 0.";
        }
        if (!formData.MaintenanceType.trim()) {
            newErrors.MaintenanceType = "Maintenance type is required.";
        }
        if (!formData.StartingMonthYear || formData.StartingMonthYear == null) {
            newErrors.StartingMonthYear = "Starting month-year is required.";
        }
        if (!formData.DueMonthYear || formData.DueMonthYear == null) {
            newErrors.StartingMonthYear = "Due Month-year is required.";
        }
        if (!formData.LatePaymentCharge || formData.LatePaymentCharge < 0) {
            newErrors.LatePaymentCharge = "Late payment charge must be 0 or greater.";
        }
        if (!formData.Description.trim()) {
            newErrors.Description = "Description is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const fetchDefaultMaintenace = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Maintence/DefaultCurrentMaintenaceDetailWithMemberRecord`);
            setRows(res.data);

        }
        catch (error) {
            console.log("Error fetching maintenance dropdown data:", error);

        } finally {
            setLoading(false); // Stop loading
        }
    }
    useEffect(() => {

        const fetchMaitenanceDrp = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/Maintence/maintenanceDateDropDown`);
                setType(res.data);
            } catch (error) {
                console.log("Error fetching maintenance dropdown data:", error);
            }
        };

        fetchMaitenanceDrp();
        fetchDefaultMaintenace();
    }, []); // Add an empty dependency array

    // Handle form submission
    const handleAddMaintenance = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/Maintence/addMaintenance`, formData);
            const msg = res.data.message || "Maintenance added successfully!";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setFormData({
                MaintenanceCharge: "",
                Description: "",
                StartingMonthYear: null,
                EndMonthYear: null,
                DueMonthYear: null,
                LatePaymentCharge: "",
                MaintenanceType: "",
            });
            handleClose();
            fetchDefaultMaintenace();
        } catch (error) {
            let message =
                error.response?.data?.message || // If API sends { message: "something" }
                error.response?.data || // If API sends just a string
                "Some error occurred. Please try again.";
            if (typeof message === "object") {
                message = JSON.stringify(message);
            }
            setToastMessage(message);
            setToastVariant("danger");
            setToastVariant("error");
            setShowToast(true);
        }
    };
    // Handle edit form submission
    const handleEditMaintenance = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const res = await axios.put(`${API_BASE_URL}/Maintence/updateMaintenace/${editId.id}`, formData);
            const msg = res.data.message || "Maintenance updated successfully!";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setFormData({
                MaintenanceCharge: "",
                Description: "",
                StartingMonthYear: null,
                EndMonthYear: null,
                DueMonthYear: null,
                LatePaymentCharge: "",
                MaintenanceType: "",
            });
            setEdit(false);
            handleClose();
            fetchDefaultMaintenace();
        } catch (error) {
            let message =
                error.response?.data?.message || // If API sends { message: "something" }
                error.response?.data || // If API sends just a string
                "Some error occurred. Please try again.";
            if (typeof message === "object") {
                message = JSON.stringify(message);
            }
            setToastHeader("Error!")
            setToastMessage(message);
            setToastVariant("danger");
            setShowToast(true);
            setShowToast(true);
            handleClose();
        }
    };
    //show maintenance by id
    const handleShowMaintenanceById = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Maintence/getMaintenanceById/${id}`);
            setRows(res.data);
        } catch (error) {
            let message =
                error.response?.data?.message || // If API sends { message: "something" }
                error.response?.data || // If API sends just a string
                "Some error occurred. Please try again.";
            if (typeof message === "object") {
                message = JSON.stringify(message);
            }
            setToastHeader("Error!")
            setToastMessage(message);
            setToastVariant("danger");
            setShowToast(true);
            setShowToast(true);
            handleClose();
        }
    }
    //approve maitenance
    const handleApproveMaintenance = async (maintenanceRecordId, id) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/Maintence/approvemaintenace/${maintenanceRecordId}`);
            const msg = res.data.message || "Maintenance accepted successfully!";

            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            window.location.reload();
            handleShowMaintenanceById(id);

        } catch (error) {
            let message =
                error.response?.data?.message || // If API sends { message: "something" }
                error.response?.data || // If API sends just a string
                "Some error occurred. Please try again.";
            if (typeof message === "object") {
                message = JSON.stringify(message);
            }
            setToastHeader("Error!")
            setToastMessage(message);
            setToastVariant("danger");
            setShowToast(true);
            setShowToast(true);
            handleShowMaintenanceById(id);
        }
    }
    //reject maintenance
    const addRejectMaintenace = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        try {
            const res = await axios.put(`${API_BASE_URL}/Maintence/rejectmaintenace/${rejectId.maintenanceRecordId}`, rejectData);
            const msg = res.data.message || "Maintenance rejected successfully!";

            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setRejectModal(false);
            setRejectId({ maintenanceRecordId: "", id: "" });
            setRejectData({ reason: "" });
            window.location.reload();
            handleShowMaintenanceById(rejectId.id);
        } catch (error) {
            let message =
                error.response?.data?.message || // If API sends { message: "something" }
                error.response?.data || // If API sends just a string
                "Some error occurred. Please try again.";
            if (typeof message === "object") {
                message = JSON.stringify(message);
            }
            setToastHeader("Error!")
            setToastMessage(message);
            setToastVariant("danger");
            setShowToast(true);
            setShowToast(true);
            handleShowMaintenanceById(rejectId.id);
            setRejectModal(false);
        }
    }
    if (loading) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                Loading maintenance details...
            </Typography>
        );
    }

    if (rows.length === 0) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                No maintenance details available.
            </Typography>
        );
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
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
                            Maintenance
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" style={{ backgroundColor: "#41d2e7", color: "white" }} onClick={handleAddModal}>
                            Add Maintenance
                        </Button>
                    </Grid>
                </Grid>
                <br />
                <Form.Group style={{ maxWidth: "250px", marginBottom: "10px" }}>
                    <Form.Label style={{ fontWeight: "bold", fontSize: "14px", color: "#333" }}>
                        🛠️ Maintenance Duration
                    </Form.Label>
                    <Form.Select
                        size="sm"
                        name="ExpensesTypeId"
                        value={agtype.id || ""}
                        onChange={(e) => handleShowMaintenanceById(e.target.value)} // Update with your logic
                        style={{
                            fontSize: "14px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            backgroundColor: "white",
                            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                            cursor: "pointer", textAlign: "center"
                        }}
                    >
                        <option value="">--   Select Duration   --</option>
                        {agtype.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.startmonth}&nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;&nbsp;{item.endmonth}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Maintenance Details Grid */}


                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        borderRadius: "12px",
                        boxShadow: "0 6px 6px rgba(0, 0, 0, 0.1)", // Enhanced shadow for depth
                        backgroundColor: "white", // Light background color
                        width: "100%", // Full width of the page
                        position: "relative", // For positioning the edit icon
                        "&:hover": { boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)" }, // Stronger hover effect
                        transition: "all 0.3s ease", // Smooth transition for hover
                    }}
                >
                    {/* Maintenance Type and Charge */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                            borderBottom: "1px solid #ddd", // Separator line
                            pb: 2, // Padding below the line
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                            {rows[0]?.maintenanceType || "N/A"}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                                backgroundColor: "#e3f2fd", // Light blue background
                                padding: "4px 8px", // Padding around the text
                                borderRadius: "8px", // Rounded corners
                            }}
                        >
                            ₹{rows[0]?.maintenanceCharge || "N/A"}
                        </Typography>
                    </Box>

                    {/* Dates and Late Payment */}
                    <Grid container spacing={7} sx={{ mb: 3 }}>
                        <Grid item xs={4}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CalendarMonth sx={{ color: "primary.main" }} /> {/* Icon for Starting Month-Year */}
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: "bold", color: "grey.700", mb: 0.5 }}
                                    >
                                        Starting Month-Year:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#555" }}>
                                        {rows[0]?.startingMonthYear || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <EventAvailable sx={{ color: "green" }} /> {/* Icon for Due Month-Year */}
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: "bold", color: "grey.700", mb: 0.5 }}
                                    >
                                        Due Month-Year:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#555" }}>
                                        {rows[0]?.dueMonthYear || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <EventBusy sx={{ color: "red" }} /> {/* Icon for End Month-Year */}
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: "bold", color: "grey.700", mb: 0.5 }}
                                    >
                                        End Month-Year:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#555" }}>
                                        {rows[0]?.endMonthYear || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <FaRupeeSign style={{ color: "#FFD700", fontSize: "20px" }} /> {/* Icon for Late Payment Charge */}
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: "bold", color: "grey.700", mb: 0.5 }}
                                    >
                                        Late Payment Charge:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#555" }}>
                                        {rows[0]?.latePaymentCharge || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Description */}
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#f9f9f9",
                            maxHeight: expanded ? "none" : "100px", // Expandable height
                            overflow: "hidden", // Hide overflow when collapsed
                            position: "relative",
                            boxShadow: "inset 0px 4px 6px rgba(0, 0, 0, 0.1)", // Inner shadow
                            mb: 3, // Add margin below the description
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", mb: 1, color: "grey.700" }}
                        >
                            Description:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555" }}
                            dangerouslySetInnerHTML={{ __html: rows[0]?.description || "N/A" }}

                        />


                        {/* Expand/Collapse Button */}
                        {rows[0]?.description && rows[0].description.length > 120 && (
                            <Button
                                onClick={() => setExpanded(!expanded)}
                                sx={{
                                    position: "absolute",
                                    bottom: "10px",
                                    right: "10px",
                                    fontSize: "12px",
                                    textTransform: "none",
                                    color: "primary.main",
                                }}
                            >
                                {expanded ? "Show Less" : "Show More"}
                            </Button>
                        )}
                    </Box>

                    {/* Edit Icon */}
                    {rows[0]?.isEditable && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                sx={{
                                    color: "grey.500", // Icon color
                                    fontSize: "18px", // Adjust icon size
                                    cursor: "pointer", // Add pointer cursor for interactivity
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        color: "black",
                                        backgroundColor: "#f1f1f1", // Add background color on hover
                                        borderRadius: "50%", // Make the background circular
                                        transform: "scale(1.2)", // Slightly enlarge the icon
                                    },
                                }}
                                onClick={() =>
                                    handleModal(
                                        rows[0].id,
                                        rows[0].maintenanceCharge,
                                        rows[0].description,
                                        rows[0].startingMonthYear,
                                        rows[0].endMonthYear,
                                        rows[0].dueMonthYear,
                                        rows[0].latePaymentCharge,
                                        rows[0].maintenanceType
                                    )
                                }
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                    )}
                </Card><br />
                <Card>
                    <CardContent>
                         <Typography sx={{ color: "black", fontSize: '20px', fontWeight: 'bold' }}>
                            Maintenance Record
                        </Typography>
                        <Divider/>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table" sx={{ width: '100%', tableLayout: 'auto' }}>
                                <TableHead >
                                    <TableRow >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align="center"
                                                sortDirection={orderBy === column.id ? orderDirection : false}
                                                style={{ minWidth: column.minWidth }} >
                                                {column.id === "no"}
                                                <TableSortLabel
                                                    style={{ opacity: "1" }}
                                                    hideSortIcon={false}
                                                    active={orderBy === column.id}
                                                    direction={orderBy === column.id ? orderDirection : 'asc'}
                                                    onClick={() => handleSortRequest(column.id)}
                                                >
                                                    {column.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows[0].isEditable == true ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} align="center">
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        [...rows].sort(getComparator(orderDirection, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => (
                                                <React.Fragment key={row.id}>
                                                    <TableRow hover role="checkbox" tabIndex={-1} onClick={() => openExpandRow(row.id)} style={{ cursor: "pointer" }}>
                                                        <TableCell align="center" onClick={() => openExpandRow(row.id)}>
                                                            {open === row.id ? (
                                                                <KeyboardArrowUpIcon style={{ cursor: "pointer" }} />
                                                            ) : (
                                                                <KeyboardArrowDownIcon style={{ cursor: "pointer" }} />
                                                            )}
                                                        </TableCell>

                                                        <TableCell align="center">{row.paymentDate}</TableCell>
                                                        <TableCell align="center">{row.flatNo}</TableCell>
                                                        <TableCell align="center">{row.member}</TableCell>
                                                        <TableCell align="center">{row.totalMaintenance}</TableCell>


                                                        <TableCell align="center">
                                                            {row.status == "Completed" && <Badge bg="success">{row.status}</Badge>}
                                                            {row.status == "Rejected" && <Badge bg="danger">{row.status}</Badge>}
                                                            {row.status == "Awaiting Approval" && <Badge bg="warning">{row.status}</Badge>}

                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Button
                                                                color="primary"
                                                                style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#C4DEF6", alignItem: "center", padding: "0px" }}

                                                                onClick={() => handleShowImage(row.photo)}
                                                            >
                                                                <IoIosEye />
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.status === "Awaiting Approval" || row.status===    "Rejected" ? (
                                                                <>
                                                                    <span style={{ display: "flex" }}>
                                                                        <Button
                                                                            variant="contained" style={{
                                                                                fontSize: "13px", display: "flex",
                                                                                alignItems: "center"
                                                                            }}
                                                                            onClick={() => handleApproveMaintenance(row.maintenanceRecordId, row.id)}
                                                                        >
                                                                            <CheckCircleIcon style={{ fontSize: "15px", marginRight: 4 }} />Accept
                                                                        </Button>&nbsp;
                                                                        <Button
                                                                            variant="contained"
                                                                            style={{
                                                                                fontSize: "13px",
                                                                                backgroundColor: "#e53935", // red
                                                                                color: "white",
                                                                                display: "flex",
                                                                                alignItems: "center"
                                                                            }}
                                                                            onClick={() => handleShowRejectModal(row.maintenanceRecordId, row.id)}
                                                                        >
                                                                            <CancelIcon style={{ fontSize: "15px", marginRight: 4 }} /> Reject
                                                                        </Button>
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    style={{
                                                                        height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#d4edda", // Light green
                                                                        color: "#2e7d32", alignItem: "center", padding: "0px"
                                                                    }}

 onClick={async () => {
                                                            const detail = await handleShowMaintenanceDetail(row.id,row.userid);
                                                            if (detail) generateInvoicePDF(detail); // Use the returned data
                                                        }}
                                                                >
                                                                    <FaFileInvoice />
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow style={{ backgroundColor: "#f9f9f9" }}>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
                                                            <Collapse in={open === row.id} timeout="auto" unmountOnExit>
                                                                <Box sx={{ marginLeft: 8, marginTop: 2 }}>
                                                                    <Typography variant="subtitle1" gutterBottom style={{ fontSize: "15px" }}>
                                                                        <strong>Late Payment Amount:</strong>&nbsp;&nbsp;&nbsp;{row.LatePaymentAmount || "N/A"}
                                                                    </Typography>
                                                                    <Typography variant="subtitle1" gutterBottom style={{ fontSize: "15px" }}>
                                                                        <strong>Late Payment Reason:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{row.latePaymentReason || "N/A"}
                                                                    </Typography>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))
                                    )}


                                </TableBody>

                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            colSpan={3}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                },
                            }}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />


                    </CardContent>
                </Card>
            </Container >

            <Modal show={show} onHide={handleClose} centered size="xl">
                
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center">{isEdit ? "Update Maintenance" : "Add Maintenance"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={isEdit ? handleEditMaintenance : handleAddMaintenance}>
                    <Modal.Body>
                        <Row>
                            {/* Maintenance Charge */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Maintenance Charge(1 month):</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="MaintenanceCharge"
                                        placeholder="Enter maintenance charge"
                                        value={formData.MaintenanceCharge}
                                        onChange={handleChange}
                                    />
                                    {errors.MaintenanceCharge && <div style={{ color: "red" }}>{errors.MaintenanceCharge}</div>}

                                </Form.Group>
                            </Col>

                            {/* Maintenance Type */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Maintenance Type:</Form.Label>
                                    <Form.Select
                                        name="MaintenanceType"
                                        value={formData.MaintenanceType}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select Maintenance Type --</option>
                                        <option value="Squrefootsize">Squarefoot</option>
                                        <option value="Flat">Flat</option>
                                    </Form.Select>
                                    {errors.MaintenanceType && <div style={{ color: "red" }}>{errors.MaintenanceType}</div>}

                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            {/* Starting Month-Year */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Starting Month-Year:</Form.Label>
                                    <Form.Control
                                        type="month"
                                        name="StartingMonthYear"
                                        value={formData.StartingMonthYear ? formData.StartingMonthYear.slice(0, 7) : ""} // Show only YYYY-MM in the input
                                        onChange={handleStartingMonthYearChange}
                                    />
                                    {errors.StartingMonthYear && <div style={{ color: "red" }}>{errors.StartingMonthYear}</div>}

                                </Form.Group>
                            </Col>

                            {/* End Month-Year */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Month-Year:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="EndMonthYear"
                                        value={formData.EndMonthYear ? formData.EndMonthYear.slice(0, 7) : ""} // Show only YYYY-MM in the input
                                        readOnly
                                        style={{ backgroundColor: "#e9ecef" }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>


                        <Row>
                            {/* Due Month-Year */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Due Month-Year:</Form.Label>
                                    <Form.Select
                                        name="DueMonthYear"
                                        value={formData.DueMonthYear}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                DueMonthYear: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">-- Select Due Month-Year --</option>
                                        {dueMonthOptions.map((option, index) => (
                                            <option key={index} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.DueMonthYear && <div style={{ color: "red" }}>{errors.DueMonthYear}</div>}

                                </Form.Group>
                            </Col>

                            {/* Late Payment Charge */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Late Payment Charge:</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text><FaRupeeSign /></InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            name="LatePaymentCharge"
                                            placeholder="Enter late payment charge"
                                            value={formData.LatePaymentCharge}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                    {errors.LatePaymentCharge && <div style={{ color: "red" }}>{errors.LatePaymentCharge}</div>}

                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            {/* Description */}
                            <Col md={12}>
                                <Form.Group className="mb-5">
                                    <Form.Label>Description:</Form.Label>
                                    <ReactQuill
                                        // className="custome-quill-outer"
                                        theme="snow"
                                        name="Description"
                                        value={formData.Description}
                                        onChange={(value) => setFormData(prev => ({ ...prev, Description: value }))}
                                        placeholder="Enter description"
                                        style={{ height: 120, borderRadius: "2px", mb: "2px" }}
                                    />

                                </Form.Group>
                                {errors.Description && <div style={{ color: "red" }}>{errors.Description}</div>}

                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit" style={{ backgroundColor: "#41d2e7", color: "white" }} >
                            Save Changes
                        </Button>&nbsp;
                        <Button variant="secondary" style={{ backgroundColor: "#6C757D", color: "white" }} onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* reject comlain modal */}
            <Modal show={reject} onHide={handleClose} style={{ zIndex: 1060 }} >
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center" >Reject Maintenance</Modal.Title>
                </Modal.Header>
                <Form onSubmit={addRejectMaintenace}>

                    <Modal.Body>
                        <Form.Group
                            className="mb-3"
                            controlId="AgencyTypeName"
                        >
                            <Form.Label>Reason :</Form.Label>
                            <Form.Control as="textarea" rows={3} type="text" name="reason" placeholder="Enter reason for reject maintenance" value={rejectData.reason} onChange={handleRejectDataChange} />
                            {errors.reason && <div style={{ color: "red" }}>{errors.reason}</div>}
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" style={{ backgroundColor: "#41d2e7", color: "white" }} type="submit">
                            Save Changes
                        </Button>&nbsp;
                        <Button type="button" variant="contained" style={{ backgroundColor: "#6C757D", color: "white" }} onClick={handleClose}>
                            Close
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
            {/* show image modal */}
            {showImageModal && (
                <button
                    onClick={() => setShowImageModal(false)}
                    style={{
                        position: "absolute",
                        top: 15,
                        right: 20,
                        zIndex: 2000,
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: "3rem",
                        cursor: "pointer"
                    }}
                    aria-label="Close"
                >
                    &times;
                </button>
            )}
            <Modal
                show={showImageModal}
                onHide={() => setShowImageModal(false)}
                centered
                backdropClassName="custom-backdrop-dark"
                contentClassName="custom-modal-content-dark"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }} // transparent black
            >
                <Modal.Body style={{ textAlign: "center", background: "transparent", padding: 0 }}>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Complaint"
                            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}
