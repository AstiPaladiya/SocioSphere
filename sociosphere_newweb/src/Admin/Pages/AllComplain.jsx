import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Typography, Grid, Button, Card, CardContent, Tab, Tabs,
    Table, TableBody, TableCell, TableContainer, Box, TableSortLabel,
    TableHead, TablePagination, TableRow, Paper, TableFooter, useTheme, Collapse
} from "@mui/material";

import { FaPhoneAlt } from "react-icons/fa";
import API_BASE_URL from "../../config";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Toast, ToastContainer, Modal, Form, Container, Row, Col, InputGroup, Badge } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// Custom tab panel component
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

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
    { id: 'complainDate', label: 'Complain Date' },
    { id: 'comtype', label: 'Type' },
    { id: 'username', label: 'Member Name' },
    { id: 'priority', label: 'Priority' },
    { id: 'complainTitle', label: 'Title' },
    { id: 'status', label: 'Status' },
    { id: 'action ', label: 'Action' },
    { id: 'photo', label: 'Complaint Image' },
];
const solvedcolumns = [
    { id: 'id', label: '#' },
    { id: 'complainDate', label: 'Complain Date' ,minWidth:50},
    { id: 'username', label: 'Member Name' },
    { id: 'complainTitle', label: 'Complain' },
    { id: 'adminActionTakenNote', label: "Action Taken",minWidth:100 },
    { id: 'actionTakenDueDate', label: "Completion Date" },
    { id: 'status', label: 'Status' },
];
const rejcolumns = [
    { id: 'id', label: '#' },
    { id: 'complainDate', label: 'Complain Date' ,minWidth:50},
    { id: 'username', label: 'Member Name' },
    { id: 'complainTitle', label: 'Complain' },
    { id: 'adminActionTakenNote', label: "Reason For Rejection",minWidth:100 },
    { id: 'actionTakenDueDate', label: "Rejection Date" },
    { id: 'status', label: 'Status' },
];
export default function AllComplain() {
    const [rows, setRows] = useState([]);
    const [srows,setSRows]=useState([]);
    const [rrows,setRrows]=useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showToast, setShowToast] = useState(false);
    const [toastHeader, setToastHeader] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success"); // success or danger
    const [orderDirection, setOrderDirection] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // initially no column is sorted
    const [error, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [acceptData, setAcceptData] = useState({ AdminActionTakenNote: "", ActionTakenDueDate: "" });
    const [rejectData, setRejectData] = useState({ AdminActionTakenNote: "" });

    const [getAcceptComId, setAcceptComId] = useState({ id: "" });
    const [isMarkedCompleted, setMarkedComplete] = useState(false);
    const [showRejected, setShowRejectedModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [open, setOpen] = React.useState(null);
    const handleClose = () => {
        setShow(false);
        setShowRejectedModal(false);
        setMarkedComplete(false);
        setRejectData({ AdminActionTakenNote: "" });
        setErrors({});
        setAcceptData({ id: null, AdminActionTakenNote: "", ActionTakenDueDate: "" });
    };
    const [value, setValue] = React.useState(0);
    //Tabs view
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //Table sorting and row function
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleSortRequest = (columnId) => {
        const isAsc = orderBy === columnId && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(columnId);
    };
    //accepted complain modal
    const handleAccept = (id) => {
        setShow(true);
        setAcceptComId({ id });
    }
    //completed complain modal
    const handleMarkComplete = (id) => {
        setMarkedComplete(true);
        setShow(true);
        setAcceptComId({ id });
    }
    //rejected complain modal
    const handleReject = (id) => {
        setShowRejectedModal(true);
        setAcceptComId({ id });
    }
    //show complain image
    const handleShowImage = (photo) => {
        setSelectedImage(photo);
        setShowImageModal(true);
    }
    //open expand row
    const openExpandRow = (id) => {
        setOpen(open == id ? null : id);
    }
    const handleAgDataChange = (e) => {
        const { name, value } = e.target;
        setAcceptData((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }
    const handleRejectDataChange = (e) => {
        const { name, value } = e.target;
        setRejectData((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }
    //add accept complain validation
    const validate = () => {
        let newErrors = {};
        if (!acceptData.AdminActionTakenNote) {
            newErrors.AdminActionTakenNote = "Action taken note is required";
        }
        if (!acceptData.ActionTakenDueDate) {
            newErrors.ActionTakenDueDate = isMarkedCompleted ? "Selected completion resolution date  " : "Select expected resolution date";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    //add reject complain validation
    const rejectValidation = () => {
        let newErrors = {};
        if (!rejectData.AdminActionTakenNote) {
            newErrors.AdminActionTakenNote = "Reason is required for reject complain";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    //get all Pendng and inprogress complain
    const fetchAllComplain = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Complain/allAcceptedComplainForAdmin`);
            setRows(res.data);
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
    //get all complete complain
    const fetchAllCompleteComplain = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Complain/allCompletedComplainForAdmin`);
            setSRows(res.data);
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
    //get all reject complain
    const fetchAllRejectComplain = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Complain/allRejectedComplainForAdmin`);
            setRrows(res.data);
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
    //accept complain
    const addAcceptComplain = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            const res = await axios.put(`${API_BASE_URL}/Complain/complainAccepted/${getAcceptComId.id}`, acceptData);
            const msg = res.data.message || "Complain status updated successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setAcceptData({ AdminActionTakenNote: "", ActionTakenDueDate: "" });
            setAcceptComId({ id: "" });
            handleClose();
            fetchAllComplain();
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
    //add complete complain
    const addCompletedComplain = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            const res = await axios.put(`${API_BASE_URL}/Complain/complainAccepted/${getAcceptComId.id}`, acceptData);
            const msg = res.data.message || "Complain status updated successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setAcceptData({ AdminActionTakenNote: "", ActionTakenDueDate: "" });
            setAcceptComId({ id: "" });
            handleClose();

            setMarkedComplete(false);
            fetchAllComplain();
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
    //add reject complain
    const addRejectComplain = async (e) => {
        e.preventDefault();
        if (!rejectValidation()) {
            return;
        }
        try {
            const res = await axios.put(`${API_BASE_URL}/Complain/complainRejected/${getAcceptComId.id}`, rejectData);
            const msg = res.data.message || "Complain status updated successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setRejectData({ AdminActionTakenNote: "" });
            setAcceptComId({ id: "" });
            handleClose();
            fetchAllComplain();
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
    useEffect(() => {
        fetchAllComplain();
        fetchAllCompleteComplain();
        fetchAllRejectComplain();
        setMarkedComplete(false);
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
                            Complains
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                <Box sx={{ borderBottom: 1, borderColor: 'lightgrey', bgcolor: "whitesmoke" }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="All Complains"  {...a11yProps(0)} sx={{ fontSize: '14px' }} />
                        <Tab label="Solved Complains" {...a11yProps(1)} sx={{ fontSize: '14px' }} />
                        <Tab label="Rejected Complains" {...a11yProps(2)} sx={{ fontSize: '14px' }} />
                    </Tabs>
                </Box>
                {/* tab for agency ype */}
                <CustomTabPanel value={value} index={0}>
                    <Card style={{ width: "100%" }}>
                        <CardContent>
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
                                        {rows.length === 0 ? (
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
                                                            {/* <TableCell align="center">
                                                                {page * rowsPerPage + index + 1}
                                                            </TableCell> */}
                                                            <TableCell align="center">{row.complainDate}</TableCell>
                                                            <TableCell align="center">{row.comtype}</TableCell>
                                                            <TableCell align="center">{row.username}</TableCell>
                                                            <TableCell align="center">{row.priority}</TableCell>
                                                            <TableCell align="center">{row.complainTitle}</TableCell>
                                                            {/* <TableCell align="center">{row.description}</TableCell> */}

                                                            <TableCell align="center">
                                                                {row.status == "In Progress" ? <Badge bg="info">{row.status}</Badge> : <Badge bg="warning">{row.status}</Badge>}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {row.status === "Pending" ? (
                                                                    <>
                                                                        <span style={{ display: "flex" }}>
                                                                            <Button
                                                                                variant="contained" style={{
                                                                                    fontSize: "13px", display: "flex",
                                                                                    alignItems: "center"
                                                                                }}
                                                                                onClick={() => handleAccept(row.id)} >
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
                                                                                onClick={() => handleReject(row.id)}
                                                                            >
                                                                                <CancelIcon style={{ fontSize: "15px", marginRight: 4 }} /> Reject
                                                                            </Button>
                                                                        </span>
                                                                    </>
                                                                ) : row.status === "In Progress" ? (
                                                                    <Button variant="contained"
                                                                        style={{
                                                                            fontSize: "13px",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            backgroundColor: "#be37d6"
                                                                        }}
                                                                        onClick={() => handleMarkComplete(row.id)}
                                                                    >
                                                                        Mark as Completed
                                                                    </Button>
                                                                ) : (
                                                                    <span>-</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {row.photo != null ? (<>
                                                                    <Button
                                                                        color="primary"
                                                                        style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#C4DEF6", alignItem: "center", padding: "0px" }}

                                                                        onClick={() => handleShowImage(row.photo)}
                                                                    >
                                                                        <IoIosEye />
                                                                    </Button>

                                                                </>
                                                                ) : (" ")

                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow style={{ backgroundColor: "#f9f9f9" }}>
                                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
                                                                <Collapse in={open === row.id} timeout="auto" unmountOnExit>
                                                                    <Box sx={{ marginLeft: 8, marginTop: 2 }}>
                                                                        <Typography variant="subtitle1" gutterBottom style={{ fontSize: "15px" }}>
                                                                            <strong>Complain Description:</strong>&nbsp;&nbsp;{row.description || "N/A"}
                                                                        </Typography>
                                                                        <Typography variant="subtitle1" gutterBottom style={{ fontSize: "15px" }}>
                                                                            <strong>Action Taken Note:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{row.adminActionTakenNote || "N/A"}
                                                                        </Typography>
                                                                        <Typography variant="subtitle1" gutterBottom style={{ fontSize: "15px" }}>
                                                                            <strong>Expected Date:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{row.actionTakenDueDate || "N/A"}
                                                                        </Typography>
                                                                    </Box>
                                                                </Collapse>
                                                            </TableCell>
                                                        </TableRow>
                                                    </React.Fragment>
                                                ))
                                        )}
                                    </TableBody>
                                    {/* <TableFooter>
                                                     <TableRow>
                                                         <TablePagination
                                                             rowsPerPageOptions={[10, 25, 100]}
                                                             component="div"
                                                             count={rows.length}
                                                             rowsPerPage={rowsPerPage}
                                                             page={page}
                                                             onPageChange={handleChangePage}
                                                             onRowsPerPageChange={handleChangeRowsPerPage}
                                                         />
                                                     </TableRow>
                                                 </TableFooter> */}
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

                </CustomTabPanel>
                {/*solved complain record */}
                <CustomTabPanel value={value} index={1}>
                    <Card>
                        <CardContent>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table" sx={{ width: '100%', tableLayout: 'auto' }}>
                                    <TableHead >
                                        <TableRow >
                                            {solvedcolumns.map((column) => (
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
                                        {srows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} align="center">
                                                    No data available
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            [...srows].sort(getComparator(orderDirection, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        <TableCell align="center">
                                                            {page * rowsPerPage + index + 1}
                                                        </TableCell>
                                                        <TableCell align="center">{row.complainDate}</TableCell>
                                                        <TableCell align="center">{row.username}</TableCell>
                                                        <TableCell align="center">{row.complainTitle}</TableCell>
                                                        <TableCell align="center">{row.adminActionTakenNote}</TableCell>
                                                        <TableCell align="center">{row.actionTakenDueDate}</TableCell>

                                                        <TableCell align="center">
                                                            <Badge bg="primary">{row.status}</Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        )}
                                    </TableBody>
                                    {/* <TableFooter>
                                                                     <TableRow>
                                                                         <TablePagination
                                                                             rowsPerPageOptions={[10, 25, 100]}
                                                                             component="div"
                                                                             count={rows.length}
                                                                             rowsPerPage={rowsPerPage}
                                                                             page={page}
                                                                             onPageChange={handleChangePage}
                                                                             onRowsPerPageChange={handleChangeRowsPerPage}
                                                                         />
                                                                     </TableRow>
                                                                 </TableFooter> */}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50, 100]}
                                colSpan={3}
                                component="div"
                                count={srows.length}
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
                </CustomTabPanel>
                {/*rejected complain record */}
                <CustomTabPanel value={value} index={2}>
                     <Card>
                        <CardContent>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table" sx={{ width: '100%', tableLayout: 'auto' }}>
                                    <TableHead >
                                        <TableRow >
                                            {rejcolumns.map((column) => (
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
                                        {rrows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} align="center">
                                                    No data available
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            [...rrows].sort(getComparator(orderDirection, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        <TableCell align="center">
                                                            {page * rowsPerPage + index + 1}
                                                        </TableCell>
                                                        <TableCell align="center">{row.complainDate}</TableCell>
                                                        <TableCell align="center">{row.username}</TableCell>
                                                        <TableCell align="center">{row.complainTitle}</TableCell>
                                                        <TableCell align="center">{row.adminActionTakenNote}</TableCell>
                                                        <TableCell align="center">{row.actionTakenDueDate}</TableCell>

                                                        <TableCell align="center">
                                                            <Badge bg="danger">{row.status}</Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        )}
                                    </TableBody>
                                    {/* <TableFooter>
                                                                     <TableRow>
                                                                         <TablePagination
                                                                             rowsPerPageOptions={[10, 25, 100]}
                                                                             component="div"
                                                                             count={rows.length}
                                                                             rowsPerPage={rowsPerPage}
                                                                             page={page}
                                                                             onPageChange={handleChangePage}
                                                                             onRowsPerPageChange={handleChangeRowsPerPage}
                                                                         />
                                                                     </TableRow>
                                                                 </TableFooter> */}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50, 100]}
                                colSpan={3}
                                component="div"
                                count={rrows.length}
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
                </CustomTabPanel>
            </Container>
            {/* Accept comlain modal */}
            <Modal show={show} onHide={handleClose} style={{ zIndex: 1060 }} >
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center" >{isMarkedCompleted ? "Resolve Complain" : "Accept Complain"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={isMarkedCompleted ? addCompletedComplain : addAcceptComplain}>

                    <Modal.Body>
                        <Form.Group
                            className="mb-3"
                            controlId="AgencyTypeName"
                        >
                            <Form.Label>{isMarkedCompleted ? "Final Action Taken Note :" : "Action Taken Note :"}</Form.Label>
                            <Form.Control as="textarea" rows={3} type="text" placeholder={isMarkedCompleted ? "Enter final action taken note..." : "Enter action taken note..."} name="AdminActionTakenNote" value={acceptData.AdminActionTakenNote} onChange={handleAgDataChange} />
                            {error.AdminActionTakenNote && <div style={{ color: "red" }}>{error.AdminActionTakenNote}</div>}
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="AgencyTypeName"
                        >
                            <Form.Label>{isMarkedCompleted ? "Completeion Date :" : "Expected Resoluion Date :"}</Form.Label>
                            <Form.Control type="date" placeholder={isMarkedCompleted ? "Completion Date:" : "Enter action taken note"} name="ActionTakenDueDate" value={acceptData.ActionTakenDueDate} onChange={handleAgDataChange} />
                            {error.ActionTakenDueDate && <div style={{ color: "red" }}>{error.ActionTakenDueDate}</div>}
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
            </Modal >
            {/* reject comlain modal */}
            <Modal show={showRejected} onHide={handleClose} style={{ zIndex: 1060 }} >
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center" >Reject Complain</Modal.Title>
                </Modal.Header>
                <Form onSubmit={addRejectComplain}>

                    <Modal.Body>
                        <Form.Group
                            className="mb-3"
                            controlId="AgencyTypeName"
                        >
                            <Form.Label>Reason :</Form.Label>
                            <Form.Control as="textarea" rows={3} type="text" placeholder="Enter reason for reject complain" name="AdminActionTakenNote" value={rejectData.AdminActionTakenNote} onChange={handleRejectDataChange} />
                            {error.AdminActionTakenNote && <div style={{ color: "red" }}>{error.AdminActionTakenNote}</div>}
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
            </Modal >
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