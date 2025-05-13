import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Typography, Grid, Button, Card, CardContent,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, Paper
} from "@mui/material";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";


const columns = [
    { id: 'no', label: 'No', minWidth: 50 },
    { id: 'fullName', label: 'Full Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'phoneNo', label: 'Phone', minWidth: 130 },
    { id: 'gender', label: 'Gender', minWidth: 100 },
    { id: 'squarfootSize', label: 'SquareFoot Size', minWidth: 100 },
    { id: 'livingDate', label: 'Living Since', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 100 },
    // { id: 'View', label: 'View More', minWidth: 100 },
];

export default function Member() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success"); // success or danger

    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await axios.get("http://192.168.229.34:5175/api/Member/GetAllMembers");
            const formatted  = res.data.map((m) => ({
                ...m,
                fullName: `${m.firstName} ${m.middleName} ${m.lastName}`,
            }));
            setRows(formatted);
        } catch (err) {
            console.error("Error fetching members", err);
        }
    };

    // const toggleStatus = async (memberId) => {
    //     try {
    //         await axios.put(`http://192.168.229.34:5175/api/Member/toggleStatus/${memberId}`);
    //         fetchMembers(); // Refresh data
    //     } catch (err) {
    //         console.error("Error toggling status", err);
    //     }
    // };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleAddMember = () => {
       navigate("AddMember");
    };
    const toggleStatus = async (memberId) => {
        try {
            const res = await axios.put(`http://192.168.229.34:5175/api/Member/toggleStatus/${memberId}`, {});
            fetchMembers(); // Refresh data
            setToastMessage("Status updated successfully");
            setToastVariant("success");
            setShowToast(true);
        } catch (err) {
            console.error("Error toggling status", err);
            setToastMessage("Failed to update status.");
            setToastVariant("danger");
            setShowToast(true);
        }
    };

    return (
        <Container>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
                        Member
                    </Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained"  style={{backgroundColor:"#41d2e7",color:"white"}} onClick={handleAddMember}>
                        + Add Member
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
                                            style={{ minWidth: column.minWidth }} >
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
                                                <TableCell align="center">{row.squarfootSize}</TableCell>
                                                <TableCell align="center">{row.livingDate}</TableCell>

                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        color={row.status === "Block" ? "success" : "error"}
                                                        onClick={() => toggleStatus(row.id)}
                                                    >
                                                        {row.status === "Active" ? "Block" : "Active"}
                                                    </Button>
                                                </TableCell>
                                                {/* <TableCell align="center">
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => navigate(`Admin/Member/ViewMember/${row.id}`)}
                                                    >
                                                        👁️ View
                                                    </Button>
                                                </TableCell> */}
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/*<TablePagination*/}
                    {/*    rowsPerPageOptions={[10, 25, 100]}*/}
                    {/*    component="div"*/}
                    {/*    count={rows.length}*/}
                    {/*    rowsPerPage={rowsPerPage}*/}
                    {/*    page={page}*/}
                    {/*    onPageChange={handleChangePage}*/}
                    {/*    onRowsPerPageChange={handleChangeRowsPerPage}*/}
                    {/*/>*/}
                </CardContent>
            </Card>
            <ToastContainer
                position="top-center"
                className="p-3"
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                }}
            >
                <Toast
                    bg={toastVariant}
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">Member Status</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

        </Container>
    );
}
