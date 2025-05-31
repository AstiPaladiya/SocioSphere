import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Typography, Grid, Button, Card, CardContent, Tab, Tabs,
    Table, TableBody, TableCell, TableContainer, Box, TableSortLabel,
    TableHead, TablePagination, TableRow, Paper, TableFooter, useTheme
} from "@mui/material";

import { FaPhoneAlt } from "react-icons/fa";
import API_BASE_URL from "../../config";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Toast, ToastContainer, Modal, Form, Container, Row, Col, InputGroup } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { red } from "@mui/material/colors";

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

// CustomTabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
// };

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
// TablePaginationActions.propTypes = {
//   count: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
//   page: PropTypes.number.isRequired,
//   rowsPerPage: PropTypes.number.isRequired,
// };

const columns = [
    { id: 'no', label: 'No', minWidth: 50 },
    { id: 'agencyname', label: 'Agency Name', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: "edit", label: "Edit", minWidth: 100 },
];
const reccolumns = [
    { id: 'no', label: 'No', minWidth: 10 },
    { id: 'agencytype', label: 'Agency Type', minWidth: 150 },
    { id: 'personname', label: 'Person name', minWidth: 200 },
    // { id: 'email', label: 'Email-Id', minWidth: 100 },
    // { id: 'location', label: 'Location', minWidth: 200 },
    { id: 'phoneno', label: 'Phone no', minWidth: 130 },
    // { id: 'alternatephone', label: 'Alternate Phone no', minWidth: 200 },
    { id: "edit", label: "Edit", minWidth: 10 },
    { id: 'remove', label: 'Remove', minWidth: 10 },
    { id: 'view', label: 'View', minWidth: 10 },
];
export default function Agency() {
    const [value, setValue] = React.useState(0);
    const [verticalTab, setVerticalTab] = React.useState(0);
    const [btnText, setBtnText] = React.useState("");
    const [show, setShow] = useState(false);
    const [showAgRec, setAgRecModal] = useState(false);
    const [getagEditData, setAgEditData] = useState({ id: "" });
    const [isEdit, setIsEdit] = useState(false);
    const [isEditRec, setIsEditRec] = useState(false);
    const [getagEditRecData, setAgEditRecData] = useState({ id: "" });
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [getDeleteRecId, setDeleteRecId] = useState({ id: "" });
    const [showRecView, setRecViewModal] = useState(false);
    const handleClose = () => {
        setShow(false);
        setAgRecModal(false);
        setDeleteModal(false)
        setRecViewModal(false);
        setErrors({});
        setContactData({
            AgencyTypeId: "",
            ContactPersonName: "",
            Location: "",
            EmailId: "",
            ContactNo: null,
            AlternateContactNo: null
        });
        setAgData({
            AgencyTypeName: "",
        });
        setDeleteRecId({ id: "" });
    };

    const [agData, setAgData] = useState({ AgencyTypeName: "" });
    const [contact, setContactData] = useState({
        AgencyTypeId: "",
        ContactPersonName: "",
        Location: "",
        EmailId: "",
        ContactNo: null,
        AlternateContactNo: null
    });
    const [error, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastHeader, setToastHeader] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [agtype, setType] = useState([]);

    const [rows, setRows] = useState([]);
    const [viewData, setViewData] = useState([]);
    const [recrows, setRecRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderDirection, setOrderDirection] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(''); // initially no column is sorted

    const handleChange = (event, newValue) => {

        if (newValue == 0) {
            setBtnText("+Add Agency");
        } else {
            setBtnText("+Add Agency Contact");
        }
        setValue(newValue);

    };

    const hadleAddBtnClick = () => {
        if (value == 0) {
            handleAddTypeModal();
        } else {
            handleAddContactModal();
        }
    }
    const handleAddTypeModal = () => {
        setIsEdit(false);
        setAgEditData({ id: "" });
        setShow(true);
    }
    const handleAddContactModal = () => {
        setIsEditRec(false);
        setAgEditRecData({ id: "" });
        setAgRecModal(true);
    }

    // sorting function
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

    const handleAgDataChange = (e) => {
        const { name, value } = e.target;
        setAgData((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }
    const handleContact = (e) => {
        const { name, value } = e.target;
        // let finalValue = value;
        // if (name === "AlternateContactNo") {
        //     if (value === "" || value === null) {
        //         finalValue = null;
        //     } else {
        //         // Convert to number if not empty
        //         finalValue = Number(value);
        //     }
        // }


        setContactData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }
    //add agency validation
    const validate = () => {
        let newErrors = {}
        if (!agData.AgencyTypeName.trim()) {
            newErrors.AgencyTypeName = "Agency name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    //add contact validation
    const validateContact = () => {
        let newErrors = {};

        if (!contact.ContactPersonName.trim()) newErrors.ContactPersonName = "Agency person name is required";
        if (!contact.AgencyTypeId || contact.AgencyTypeId == "") newErrors.AgencyTypeId = "Please select any of one agency type";
        if (!contact.Location.trim()) newErrors.Location = "Location is required";

        if (!contact.EmailId.trim()) {
            newErrors.EmailId = "Email is required";
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contact.EmailId)) {
            newErrors.EmailId = "Email address is not in valid format";
        }

        if (!contact.ContactNo) {
            newErrors.ContactNo = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(contact.ContactNo)) {
            newErrors.ContactNo = "Phone number must be 10 digits";
        }
        if (contact.AlternateContactNo && contact.AlternateContactNo) {
            if (!/^[0-9]{10}$/.test(contact.AlternateContactNo)) {
                newErrors.AlternateContactNo = "Alternate phone number must be 10 digits";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    //fetch agency data for edit
    const editAgency = (id, AgencyTypeName) => {
        setIsEdit(true);
        setAgEditData({ id });
        setAgData({ AgencyTypeName });
        setShow(true);

    }
    // show delete agency record modal
    const showDeleteAgencyRecModal = (id) => {
        setDeleteRecId({ id });
        setDeleteModal(true);
    }
    //fetch agency contact data fr edit
    const editAgencyContact = (id, agencyTypeId, contactPersonName, emailId, location, contactNo, alternateContactNo) => {
        setIsEditRec(true);
        setAgEditRecData({ id });
        setContactData({
            AgencyTypeId: agencyTypeId,
            ContactPersonName: contactPersonName,
            Location: location,
            EmailId: emailId,
            ContactNo: contactNo,
            AlternateContactNo: alternateContactNo
        });
        setAgRecModal(true);
    }
    //Add agency 
    const handleAddAgency = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/Agency`, agData);
            const msg = res.data.message || "Agency Added successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setAgData({
                AgencyTypeName: ""
            });
            handleClose();
            fetchAllAgency();

        } catch (error) {
            const message =
                error.response?.data?.message || // if API sends { message: "something" }
                error.response?.data ||          // if API sends just a string
                "Some error occured.Please try again";
            setToastHeader("Error!")
            setToastMessage(message);
            setToastVariant("danger");
            setShowToast(true);
            handleClose();
            fetchAllAgency();
        }
    }

    //add contact detail
    const handleAddContact = async (e) => {
        e.preventDefault();
        if (!validateContact()) {
            return
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/AgencyContact`, contact);
            const msg = res.data.message || "Agency contact Added successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setContactData({
                AgencyTypeId: "",
                ContactPersonName: "",
                Location: "",
                EmailId: "",
                ContactNo: null,
                AlternateContactNo: null
            });
            setAgRecModal(false);
            fetchAllAgencyContact();


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
            setAgRecModal(false);
            fetchAllAgencyContact();
        }
    }

    //Edit Agency
    const handleEditAgency = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            const res = await axios.put(`${API_BASE_URL}/Agency/${getagEditData.id}`, agData);
            const msg = res.data.message || "Agency updated successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setAgData({
                AgencyTypeName: ""
            });
            handleClose();
            fetchAllAgency();

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
            handleClose();
            fetchAllAgency();
        }
    }
    const handleEditContact = async (e) => {
        e.preventDefault();
        if (!validateContact()) {
            return;
        }
        try {
            const res = await axios.put(`${API_BASE_URL}/AgencyContact/updateAgencyContact/${getagEditRecData.id}`, contact);
            const msg = res.data.message || "Agency contact updated successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setContactData({
                AgencyTypeId: "",
                ContactPersonName: "",
                Location: "",
                EmailId: "",
                ContactNo: null,
                AlternateContactNo: null
            });
            handleClose();
            fetchAllAgencyContact();

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
            handleClose();
            fetchAllAgencyContact();
        }

    }
    // fetch All agency type
    const fetchAllAgency = async () => {

        try {
            const res = await axios.get(`${API_BASE_URL}/Agency`);
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
    // fetch All agency record
    const fetchAllAgencyContact = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/AgencyContact`);
            setRecRows(res.data);
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
    // status change of agency type
    const handleStatusChange = async (id) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/Agency/toggleStatus/${id}`, {});
            const msg = res.data.message || "Status updated successfully";
            fetchAllAgency();
            fetchAllAgencyContact();
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
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
    //fetch agency type
    const fetchAgencyType = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/AgencyContact/getActiveAgencyType`);
            setType(res.data);
        } catch (error) {
            console.error("Error fetching agency types:", error);

        }
    }
    //delete agency contact record
    const handleDeleteRec = async (id) => {
        try {
            const res = await axios.delete(`${API_BASE_URL}/AgencyContact/deleteAgencyContact/${id}`);
            const msg = res.data.message || "Agency contact deleted successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setDeleteModal(false);
            fetchAllAgencyContact();
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
            setDeleteModal(false);
        }

    }
    const handleShowRecDetails = (id) => {
        setRecViewModal(true);
        fetchAllRecViewById(id);
    }
    //fetch agency contact record by id
    const fetchAllRecViewById = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/AgencyContact/${id}`);
            if (Array.isArray(res.data)) {
                setViewData(res.data[0] || {});
            } else {
                setViewData(res.data || {});
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
    const fetchAgecyContactByType = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/AgencyContact/agencyContactByType/${id}`);
            setRecRows(res.data);
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
        setBtnText("+Add Agency");
        fetchAgencyType();
        fetchAllAgency();
        fetchAllAgencyContact();
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
                    <Grid item>
                        <Button variant="contained" style={{ backgroundColor: "#41d2e7", color: "white" }} onClick={hadleAddBtnClick} >
                            {btnText}
                        </Button>
                    </Grid>
                </Grid>
                <br />
                <Box sx={{ borderBottom: 1, borderColor: 'lightgrey', bgcolor: "whitesmoke" }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Type"  {...a11yProps(0)} sx={{ fontSize: '14px' }} />
                        <Tab label="Contact Record" {...a11yProps(1)} sx={{ fontSize: '14px' }} />
                    </Tabs>
                </Box>
                {/* tab for agency ype */}
                <CustomTabPanel value={value} index={0}>
                    <Card>
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
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        <TableCell align="center">
                                                            {page * rowsPerPage + index + 1}
                                                        </TableCell>
                                                        <TableCell align="center">{row.agencyTypeName}</TableCell>
                                                        <TableCell align="center">
                                                            {row.status == "Active" ? <Button
                                                                variant="contained"
                                                                color="success"
                                                                onClick={() => handleStatusChange(row.id)}
                                                            >
                                                                {row.status}
                                                            </Button> : <Button
                                                                variant="contained"
                                                                color="error"
                                                                onClick={() => handleStatusChange(row.id)}
                                                            >
                                                                {row.status}
                                                            </Button>}

                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Button


                                                                style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#FEF3BD", alignItem: "center", color: "orange", padding: "0px" }}
                                                                onClick={() => editAgency(row.id, row.agencyTypeName)}
                                                            >
                                                                <FaEdit />
                                                            </Button>
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

                <CustomTabPanel value={value} index={1}>
                    <Row>
                        <Col md={3}>
                            <Box
                                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 300 }} >
                              
                                <Tabs
                                    orientation="vertical"
                                    variant="scrollable"
                                    value={verticalTab}
                                    onChange={(e, newValue) => setVerticalTab(newValue)}
                                    aria-label="Vertical tabs example"
                                    sx={{ borderRight: 1, borderColor: 'divider', width: '100%' }}
                                >
                                    <Tab onClick={()=>fetchAllAgencyContact()} label="All"/>
                                    {agtype.map((type, index) => (
                                        <Tab key={type.id} label={type.agencyTypeName} {...a11yProps(index)} sx={{ alignItems: 'flex-center' }} onClick={() => { fetchAgecyContactByType(type.id) }}
                                        />
                                    ))}
                                </Tabs>
                            </Box>
                        </Col>
                        <Col md={9}>
                            <Card>
                                <CardContent>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table" sx={{ width: '100%', tableLayout: 'auto' }}>
                                            <TableHead >
                                                <TableRow >
                                                    {reccolumns.map((column) => (
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
                                                {recrows.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={reccolumns.length} align="center">
                                                            No data available
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    [...recrows].sort(getComparator(orderDirection, orderBy))
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row, index) => (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                <TableCell align="center">
                                                                    {page * rowsPerPage + index + 1}
                                                                </TableCell>
                                                                <TableCell align="center">{row.agencytype}</TableCell>
                                                                <TableCell align="center">{row.contactPersonName}</TableCell>
                                                                <TableCell align="center">{row.contactNo}</TableCell>
                                                                {/* <TableCell align="center">{row.emailId}</TableCell> */}
                                                                {/* <TableCell align="center">{row.location}</TableCell> */}
                                                                {/* 
                                                        <TableCell align="center">{row.alternateContactNo}</TableCell> */}
                                                                <TableCell align="center">
                                                                    <Button style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#FEF3BD", alignItem: "center", color: "orange", padding: "0px" }}
                                                                        onClick={() => editAgencyContact(row.id, row.agencyTypeId, row.contactPersonName, row.emailId, row.location, row.contactNo, row.alternateContactNo)}
                                                                    >
                                                                        <FaEdit />
                                                                    </Button>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Button
                                                                        style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#ffe6e6", alignItem: "center", color: "red", padding: "0px" }}
                                                                        onClick={() => showDeleteAgencyRecModal(row.id)}
                                                                    >
                                                                        <MdDelete />
                                                                    </Button>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Button
                                                                        color="primary"
                                                                        style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#C4DEF6", alignItem: "center", padding: "0px" }}

                                                                        onClick={() => handleShowRecDetails(row.id)}
                                                                    >
                                                                        <IoIosEye />
                                                                    </Button>
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
                                        count={recrows.length}
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
                        </Col>
                    </Row>

                </CustomTabPanel>

            </Container>

            {/* Aency type modal */}
            <Modal show={show} onHide={handleClose} style={{ zIndex: 1060 }} >
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center" >{isEdit ? "Edit Agency" : "Add Agency"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={isEdit ? handleEditAgency : handleAddAgency}>

                    <Modal.Body>

                        {/* <Form.Control
                            type="text"
                            name="id"
                            value={isEdit ? getagEditData.id : null}
                            autoFocus hidden
                        /> */}

                        <Form.Group
                            className="mb-3"
                            controlId="AgencyTypeName"
                        >
                            <Form.Label>Agency Name :</Form.Label>
                            <Form.Control type="text" placeholder="Enter agency name" name="AgencyTypeName" value={agData.AgencyTypeName} onChange={handleAgDataChange} />
                            {error.AgencyTypeName && <div style={{ color: "red" }}>{error.AgencyTypeName}</div>}
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

            {/* agency contact */}
            < Modal show={showAgRec} size="lg" onHide={handleClose} style={{ zIndex: 1060 }
            }   >
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center" >{isEditRec ? "Edit Agency Contact" : "Add Agency Contact"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={isEditRec ? handleEditContact : handleAddContact}>

                    <Modal.Body>

                        <Form.Control
                            type="text"
                            placeholder="name@example.com" name="memberId"
                            value={isEditRec ? getagEditRecData.id : null}
                            autoFocus

                            hidden
                        />
                        <Row>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Agency Type :</Form.Label>
                                    <Form.Select name="AgencyTypeId" value={contact.AgencyTypeId} onChange={(e) => handleContact({
                                        target: {
                                            name: e.target.name, value: Number(e.target.value)
                                        }
                                    })}>
                                        <option value="">--Select Agency Type--</option>
                                        {agtype.map((agtype) => (
                                            <option key={agtype.id} value={agtype.id}>{agtype.agencyTypeName}</option>

                                        ))}
                                    </Form.Select>
                                    {error.AgencyTypeId && <div style={{ color: "red" }}>{error.AgencyTypeId}</div>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Person name :</Form.Label>
                                    <Form.Control type="text" placeholder="Enter agency person name" name="ContactPersonName" value={contact.ContactPersonName} onChange={handleContact} />
                                    {error.ContactPersonName && <div style={{ color: "red" }}>{error.ContactPersonName}</div>}
                                </Form.Group>

                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Location :</Form.Label>
                                    <Form.Control type="text" placeholder="Enter agency  location" name="Location" value={contact.Location} onChange={handleContact} />
                                    {error.Location && <div style={{ color: "red" }}>{error.Location}</div>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Email-Id :</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>@</InputGroup.Text>
                                        <Form.Control type="email" placeholder="Enter agency email-id" name="EmailId" value={contact.EmailId} onChange={handleContact} />
                                    </InputGroup>
                                    {error.EmailId && <div style={{ color: "red" }}>{error.EmailId}</div>}

                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>

                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Phone no :</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text><FaPhoneAlt /></InputGroup.Text>

                                        <Form.Control type="number" placeholder="Enter agency phone no" name="ContactNo" value={contact.ContactNo} onChange={handleContact} />
                                    </InputGroup>
                                    {error.ContactNo && <div style={{ color: "red" }}>{error.ContactNo}</div>}

                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Alternate Phone no :</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text><FaPhoneAlt /></InputGroup.Text>
                                        <Form.Control type="number" placeholder="Enter alternate phone no" name="AlternateContactNo" value={contact.AlternateContactNo} onChange={handleContact} />
                                    </InputGroup>
                                    {error.AlternateContactNo && <div style={{ color: "red" }}>{error.AlternateContactNo}</div>}

                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" style={{ backgroundColor: "#41d2e7", color: "white" }} type="submit" >
                            Save Changes
                        </Button>&nbsp;
                        <Button type="button" variant="contained" style={{ backgroundColor: "#6C757D", color: "white" }} onClick={handleClose}>
                            Close
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal >
            {/* delete agency record modal */}
            <Modal show={showDeleteModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center">Remove Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body className="w-100 text-center">Are you sure you want to delete this Agency contact record</Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" color="success" onClick={() => handleDeleteRec(getDeleteRecId.id)}>
                        Yes
                    </Button>&nbsp;
                    <Button variant="contained" style={{ backgroundColor: "#D32F2F" }} onClick={handleClose}>
                        No
                    </Button>

                </Modal.Footer>
            </Modal>
            {/* view agency record detail */}
            {/* view agency record detail */}
            <Modal show={showRecView} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center">Agency Contact Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Example: Display details of a selected agency contact */}
                    <div style={{ padding: "10px" }}>
                        <h5 style={{ color: "#41d2e7" }}>{viewData.contactPersonName || "N/A"}</h5>
                        <hr />
                        <p><strong>Agency Type:</strong> {viewData.agencytype || "N/A"}</p>
                        <p><strong>Email:</strong> {viewData.emailId || "N/A"}</p>
                        <p><strong>Location:</strong> {viewData.location || "N/A"}</p>
                        <p><strong>Phone No:</strong> {viewData.contactNo || "N/A"}</p>
                        <p><strong>Alternate Phone No:</strong> {viewData.alternateContactNo || "N/A"}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" style={{ backgroundColor: "#6C757D", color: "white" }} onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}