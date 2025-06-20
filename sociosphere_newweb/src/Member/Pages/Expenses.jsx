import React, { useEffect, useState } from "react";
// import   "../../App.css";
import axios from "axios";
import {
    Typography, Grid, Button, Card, CardContent, Tab, Tabs,
    Table, TableBody, TableCell, TableContainer, Box, TableSortLabel,
    TableHead, TablePagination, TableRow, Paper, TableFooter, useTheme
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
const reccolumns = [
    { id: 'id', label: '#' },
    { id: 'extype', label: 'Expense Type' },
    { id: 'expensesTitle', label: 'Expense Title' },
    { id: 'expensesDate', label: 'Expense Date' },
    { id: 'status', label: 'Payment Status' },
    { id: 'view', label: 'View' },
    
];

export default function Expenses() {
    const [value, setValue] = React.useState(0);
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
    const [billImagePreview, setBillImagePreview] = useState(null);
    const handleClose = () => {
        setShow(false);
        setRecViewModal(false);
        setErrors({});
        // setContactData({
        //     ExpensesTypeId: "",
        //     ExpensesTitle: "",
        //     Description: "",
        //     Price: null,
        //     ExpensesDate: "",
        //     BillImage: "",
        //     Status: ""
        // });
        setBillImagePreview(null);


    };
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
    // fetch All expenses record
    const fetchAllExpensesRecord = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/ExpensesRecord`);
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
    //fetch expenses type
    const fetchExpenseType = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/ExpensesRecord/getActiveExpensesType`);
            setType(res.data);
        } catch (error) {
            console.error("Error fetching expenses types:", error);

        }
    }
    const handleShowRecDetails = (id) => {
        setRecViewModal(true);
        fetchAllRecViewById(id);
    }
    //fetch expenses detail by id
    const fetchAllRecViewById = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/ExpensesRecord/${id}`);
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
    const fetchExpensesRecByType = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/ExpensesRecord/expensesRecordByType/${id}`);
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
        fetchExpenseType();
        fetchAllExpensesRecord();
    }, []);
    return (<>
        <Container>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
                        Expenses
                    </Typography>
                </Grid>

            </Grid>
            <br />
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
                            sx={{ borderRight: 1, borderColor: 'divider', width: '100%' }}>
                            <Tab onClick={() => fetchAllExpensesRecord()} label="All" />
                            {agtype.map((type, index) => (
                                <Tab key={type.id} label={type.expensesName} {...a11yProps(index)} sx={{ alignItems: 'flex-center' }} onClick={() => { fetchExpensesRecByType(type.id) }}
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
                                                        <TableCell align="center">{row.extype}</TableCell>
                                                        <TableCell align="center">{row.expensesTitle}</TableCell>
                                                        <TableCell align="center">{row.expensesDate}</TableCell>
                                                        <TableCell align="center">
                                                            {row.status == "Complete" ? <Badge bg="info">{row.status}</Badge> : <Badge bg="danger">{row.status}</Badge>}

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
        </Container>
        {/* view expenses detail  */}
        <Modal show={showRecView} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">
                    Expense Detail
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{
                    border: "1px solid #e3e3e3",
                    borderRadius: "12px",
                    padding: "32px",
                    background: "#f9fafd",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                    <h4 style={{ color: "#41d2e7", marginBottom: 20 }}>{viewData.expensesTitle || "N/A"}</h4>
                    <hr />
                    <Row className="mb-3">
                        <Col md={4}><strong>Expense Type:</strong></Col>
                        <Col md={8}>{viewData.extype || "N/A"}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={4}><strong>Date:</strong></Col>
                        <Col md={8}>{viewData.expensesDate || "N/A"}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={4}><strong>Amount:</strong></Col>
                        <Col md={8}><FaRupeeSign /> {viewData.price || "N/A"}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={4}><strong>Status:</strong></Col>
                        <Col md={8}>
                            <Badge bg={viewData.status === "Complete" ? "info" : "danger"} >
                                {viewData.status || "N/A"}
                            </Badge>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        {/* Side by side layout */}
                        <Col md={6} xs={12}>
                            <div>
                                <strong>Description:</strong>
                                <div
                                    style={{
                                        minHeight: 100,
                                        background: "#f1f3f6",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        border: "1px solid #e3e3e3",
                                        color: "#333",
                                        wordBreak: "break-word",
                                        marginTop: 10,
                                        fontSize: "1.05rem"
                                    }}
                                    dangerouslySetInnerHTML={{ __html: viewData.description || "N/A" }}
                                />
                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <div>
                                <strong>Bill Image:</strong>
                                {viewData.photo ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 10 }}>
                                        <img
                                            src={viewData.photo}
                                            alt="Bill"
                                            style={{
                                                width: "100%",
                                                maxWidth: "300px",
                                                maxHeight: "220px",
                                                borderRadius: "8px",
                                                border: "1px solid #ccc",
                                                marginBottom: "12px",
                                                objectFit: "contain",
                                                background: "#fff"
                                            }}
                                        />
                                        <Button
                                            variant="outlined" color="primary"
                                            size="sm"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = viewData.photo;
                                                link.download = "bill-image.jpg";
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                        >
                                            <FaDownload style={{ marginRight: 6, fontSize: 18 }} /> Download Bill Image
                                        </Button>
                                    </div>
                                ) : (
                                    <div style={{
                                        minHeight: 100,
                                        background: "#f1f3f6",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        border: "1px solid #e3e3e3",
                                        color: "#888",
                                        marginTop: 10
                                    }}>N/A</div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="contained" style={{ backgroundColor: "#6C757D", color: "white" }} onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}