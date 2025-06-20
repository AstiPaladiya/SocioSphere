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
import { Toast, ToastContainer, Modal, Form, Container, Row, Col, InputGroup, Badge } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";

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
    { id: 'complainName', label: 'Complain Name' },
    { id: 'edit', label: 'Edit' },
    { id: 'status', label: 'Status' },
    // { id: 'View', label: 'View More', minWidth: 100 },
];

export default function Complain() {
    const [rows, setRows] = useState([]);
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
    const [isEdit, setIsEdit] = useState(false);
    const [editComId, setEditComplainId] = useState({ id: "" });
    const [comData, setComplainData] = useState({
        ComplainName: ""
    })
    const handleClose = () => {
        setShow(false);
        setComplainData({ ComplainName: "" });
        setEditComplainId({ id: "" });
        setIsEdit(false);
        setErrors({});
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
    const handleAddBtnClick = () => {
        setIsEdit(false);
        setShow(true);
    }
    const editComplain = (id, complainName) => {
        setEditComplainId({ id });
        setComplainData({ ComplainName: complainName });
        setIsEdit(true);
        setShow(true);
    }
    const handleAgDataChange = (e) => {
        const { name, value } = e.target;
        setComplainData((prev) => ({
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
        if (!comData.ComplainName.trim()) {
            newErrors.ComplainName = "Complain name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    //add complain
    const handleAddComplain = async (e) => {
        try {
            e.preventDefault();
            if (!validate()) {
                return;
            }
            const res = await axios.post(`${API_BASE_URL}/Complaintype`, comData);
            const msg = res.data.message || "Complain type Added successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setComplainData({
                ComplainName: ""
            });
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
            handleClose();
            fetchAllComplain();
        }
    }
    //edit complain
    const handleEditComplain = async (e) => {
        try {
            e.preventDefault();
            if (!validate()) {
                return;
            }
            const res = await axios.put(`${API_BASE_URL}/Complaintype/${editComId.id}`, comData);
            const msg = res.data.message || "Complain type updated  successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
            setComplainData({
                ComplainName: ""
            });
            setEditComplainId({
                id: ""
            });
            handleClose();
            fetchAllComplain();
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
            fetchAllComplain();
        }
    }
    //fetch all complain
    const fetchAllComplain = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Complaintype`);
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
    //handle status
    const handleStatusChange = async (id) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/Complaintype/toggleStatus/${id}`, {});
            const msg = res.data.message || "Complain type status updated successfully";
            setToastHeader("Success!")
            setToastMessage(`${msg}`);
            setToastVariant("success");
            setShowToast(true);
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
    }, [])
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
                            Complain Type
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" style={{ backgroundColor: "#41d2e7", color: "white" }} onClick={handleAddBtnClick} >
                            + Add Complain Type
                        </Button>
                    </Grid>
                </Grid>
                <br />
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
                                                    <TableCell align="center">{row.complainName}</TableCell>
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
                                                            onClick={() => editComplain(row.id, row.complainName)}
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
            </Container>

            {/* Aency type modal */}
            <Modal show={show} onHide={handleClose} style={{ zIndex: 1060 }} >
                <Modal.Header closeButton >
                    <Modal.Title className="w-100 text-center" >{isEdit ? "Edit Complain Type " : "Add Complain Type"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={isEdit ? handleEditComplain : handleAddComplain}>

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
                            <Form.Label>Complain Name :</Form.Label>
                            <Form.Control type="text" placeholder="Enter complain name" name="ComplainName" value={comData.ComplainName} onChange={handleAgDataChange} />
                            {error.ComplainName && <div style={{ color: "red" }}>{error.ComplainName}</div>}
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
         
        </>
    )
}