import React from "react";
import AdminPanel from "../AdminPanel";
import { Typography, Box, Grid, Button, Card, CardContent } from "@mui/material";
import { Container } from "react-bootstrap";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'Code', minWidth: 100 },
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'size',
        label: 'Size',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
    },
];

// Empty data
const rows = [];
export default function Member() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            <Container sx={{ mt: 4 }}>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
                            Member
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary">
                            + Add Member
                        </Button>
                    </Grid>
                </Grid>
                <br/>
                <Card>
                    <CardContent>
                        {/* <Paper sx={{ width: '100%', overflow: 'hidden' ,marginRight:'30%'}}>ß */}
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
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
                                                .map((row) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                        {columns.map((column) => (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {row[column.id]}
                                                            </TableCell>
                                                        ))}
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
                        {/* </Paper> */}
                        </CardContent>
</Card>
                    </Container>
                </>
                )
}