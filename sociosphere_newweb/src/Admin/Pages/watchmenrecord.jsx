import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Typography, Grid, Button, Card, CardContent,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, Paper
} from "@mui/material";
import { Container } from "react-bootstrap";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import { FaEdit } from "react-icons/fa";

const columns = [
    { id: 'no', label: 'No', minWidth: 50 },
    { id: 'fullName', label: 'Full Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'phoneNo', label: 'Phone', minWidth: 130 },
    { id: 'gender', label: 'Gender', minWidth: 100 },
    { id: 'shiftStartTime', label: 'Shift Start', minWidth: 100 },
    { id: 'shiftEndTime', label: 'Shift End', minWidth: 100 },
    { id: 'joiningDate', label: 'Joining Date', minWidth: 150 },
    { id: 'salary', label: 'Salary', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'edit', label: 'Edit', minWidth: 100 }
];

export default function Watchmenrecord() {
    const [rows, setRows] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastHeader, setToastHeader] = useState("");

    const [toastVariant, setToastVariant] = useState("success");
    const navigate = useNavigate();
    useEffect(() => {
        fetchWatchmen();
    }, []);

    const fetchWatchmen = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Watchmen/GetAllWatchmen`);
            const formatted = res.data.map((w) => ({
                ...w,
                fullName: `${w.firstName} ${w.middleName} ${w.lastName}`,
            }));
            setRows(formatted);
        } catch (err) {
            console.error("Error fetching watchmen", err);
        }
    };
    const handleAddWatchmen = () => {
        navigate("AddWatchmen");
    }
    const toggleStatus = async (id) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/Watchmen/toggleStatus/${id}`);
            const msg = res.data.message || "Watchmen status successfully";
            setToastHeader("Success!")
            fetchWatchmen(); // Refresh
            setToastMessage(msg);
            setToastVariant("success");
            setShowToast(true);
        } catch (error) {
            const message =
                error.response?.data?.message || // if API sends { message: "something" }
                error.response?.data ||          // if API sends just a string
                "Some error occured.Please try again";
            setToastHeader("Error!")
            setToastMessage(message);
            setToastVariant("danger");
            setShowToast(true);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
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
            <Container sx={{ overflowX: 'auto' }}>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
                            Watchmen
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" style={{ backgroundColor: "#41d2e7", color: "white" }} onClick={handleAddWatchmen}>
                            + Register Watchmen
                        </Button>
                    </Grid>
                </Grid>
                <br />
                <Card>
                    <CardContent>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table" sx={{ width: '100%', tableLayout: 'auto' }}>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align="center"
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
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
                                        rows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                    <TableCell align="center">
                                                        {page * rowsPerPage + index + 1}
                                                    </TableCell>
                                                    <TableCell align="center">{row.fullName}</TableCell>
                                                    <TableCell align="center">{row.email}</TableCell>
                                                    <TableCell align="center">{row.phoneNo}</TableCell>
                                                    <TableCell align="center">{row.gender}</TableCell>
                                                    <TableCell align="center">{row.shiftStartTime}</TableCell>
                                                    <TableCell align="center">{row.shiftEndTime}</TableCell>
                                                    <TableCell align="center">{row.joiningDate}</TableCell>
                                                    <TableCell align="center">{row.salary}</TableCell>
                                                    <TableCell align="center">
                                                        {row.status == "Active" ? <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={() => toggleStatus(row.id)}
                                                        >
                                                            {row.status}
                                                        </Button> : <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() => toggleStatus(row.id)}
                                                        >
                                                            {row.status}
                                                        </Button>}

                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#FEF3BD", alignItem: "center", color: "orange", padding: "0px" }}
                                                            onClick={()=>{navigate(`/Admin/UpdateWatchmen/${row.id}`)}}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </CardContent>
                </Card>

            </Container>
        </>
    );
}