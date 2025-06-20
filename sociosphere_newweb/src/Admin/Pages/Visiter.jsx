import React, { useDebugValue, useEffect, useState } from "react";
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
import { IoIosEye } from "react-icons/io";
import { IoPerson } from "react-icons/io5";


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
//today visiter column
const columns = [
  { id: 'id', label: '#', minWidth: 10 },
  { id: 'name', label: 'Visitor Name', minWidth: 150 },         // changed
  { id: "entryDate", label: "Entry Date", minWidth: 120 },      // changed
  { id: "entryTime", label: "Entry Time", minWidth: 50 },       // changed
  { id: "membername", label: "Whome to meet", minWidth: 150 },  // changed
  { id: "watchmen", label: "Watchmen", minWidth: 100 },         // changed
  { id: 'view', label: 'View', minWidth: 10 },
];
//all visiter
const allVcolumns = [
  { id: 'id', label: '#', minWidth: 10 },
  { id: 'name', label: 'Visitor Name', minWidth: 150 },         // changed
  { id: "entryDate", label: "Entry Date", minWidth: 120 },      // changed
  { id: "entryTime", label: "Entry Time", minWidth: 50 },       // changed
  { id: "membername", label: "Whome to meet", minWidth: 150 },  // changed
  { id: "watchmen", label: "Watchmen", minWidth: 100 },         // changed
  { id: 'view', label: 'View', minWidth: 10 },
];
export default function Visiter() {
  const [value, setValue] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [vrows, setVRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showToast, setShowToast] = useState(false);
  const [toastHeader, setToastHeader] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // success or danger
  const [orderDirection, setOrderDirection] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(''); // initially no column is sorted
  const [showModalView, setShowModalView] = useState(false);
  const [viewData, setViewData] = useState([]);
  const handleClose = () => {
    setShowModalView(false);
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
  const handleShowTodayDetails = async (id) => {
    setShowModalView(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/Visiter/getVisiterById/${id}`);
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
      setShowModalView(false);
    }

  }
  // get today visiter record
  const fetchTodayAllVisiter = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Visiter/allVisiterForToday`);
      setRows(res.data);
    } catch (error) {
      // let message =
      //   error.response?.data?.message || // if API sends { message: "something" }
      //   error.response?.data ||          // if API sends just a string
      //   "Some error occured.Please try again";
      // // If message is an object, convert to string
      // if (typeof message === "object") {
      //   message = JSON.stringify(message);
      // }
      // setToastHeader("Error!")
      // setToastMessage(message);
      // setToastVariant("danger");
      // setShowToast(true);
    }
  }
  // get today visiter record
  const fetchAllVisiter = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Visiter`);
      setVRows(res.data);
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
    fetchTodayAllVisiter();
    fetchAllVisiter();
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
              Visitor
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Box sx={{ borderBottom: 1, borderColor: 'lightgrey', bgcolor: "whitesmoke" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Today"  {...a11yProps(0)} sx={{ fontSize: '14px' }} />
            <Tab label="History" {...a11yProps(1)} sx={{ fontSize: '14px' }} />
          </Tabs>
        </Box>
        {/* today today visiter */}
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
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">{row.entryDate}</TableCell>

                            <TableCell align="center">{row.entryTime}</TableCell>
                            <TableCell align="center">{row.membername}</TableCell>
                            <TableCell align="center">{row.watchmen}</TableCell>
                            <TableCell align="center">
                              <Button
                                color="primary"
                                style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#C4DEF6", alignItem: "center", padding: "0px" }}

                                onClick={() => handleShowTodayDetails(row.id)}
                              >
                                <IoIosEye />
                              </Button>
                            </TableCell>


                          </TableRow>
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
        </CustomTabPanel>
        {/* All visiter */}
        <CustomTabPanel value={value} index={1}>
          <Card>
            <CardContent>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table" sx={{ width: '100%', tableLayout: 'auto' }}>
                  <TableHead >
                    <TableRow >
                      {allVcolumns.map((column) => (
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
                    {vrows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={allVcolumns.length} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      [...vrows].sort(getComparator(orderDirection, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                            <TableCell align="center">
                              {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">{row.entryDate}</TableCell>

                            <TableCell align="center">{row.entryTime}</TableCell>
                            <TableCell align="center">{row.membername}</TableCell>
                            <TableCell align="center">{row.watchmen}</TableCell>
                            <TableCell align="center">
                              <Button
                                color="primary"
                                style={{ height: "40px", minWidth: "50px", fontSize: "20px", backgroundColor: "#C4DEF6", alignItem: "center", padding: "0px" }}

                                onClick={() => handleShowTodayDetails(row.id)}
                              >
                                <IoIosEye />
                              </Button>
                            </TableCell>


                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                colSpan={3}
                component="div"
                count={vrows.length}
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

      {/* view agency record detail */}
      <Modal show={showModalView} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Visiter Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              maxWidth: 400,
              margin: "0 auto",
              background: "#f8f9fa",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              padding: 10,
              textAlign: "center"
            }}
          >
            <div style={{ marginBottom: 10 }}>
              {viewData.photo ? (
                <img
                  src={viewData.photo}
                  alt="Visitor"
                  style={{
                    width: 160,
                    height: 150,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #41d2e7",
                    boxShadow: "0 2px 8px rgba(65,210,231,0.15)"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: "#e0e0e0",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 50,
                    color: "#888"
                  }}
                >
                  <IoPerson />
                </div>
              )}
            </div>
            <div style={{ fontWeight: "bold", fontSize: 24, color: "#1976d2" }}>
              {viewData.name || "N/A"}
            </div>
            <div style={{ color: "#666", fontSize: 16, marginBottom: 10 }}>
              {viewData.phoneNo || "N/A"}
            </div>
            <hr />
            <div style={{ textAlign: "left", marginTop: 10 }}>
              <Row>
                <Col xs={6}>
                  <p style={{ marginBottom: 3 }}>
                    <strong>Entry Date:</strong><br />{viewData.entryDate || "N/A"}
                  </p>
                  <p style={{ marginBottom: 3 }}>
                    <strong>Entry Time:</strong><br />{viewData.entryTime || "N/A"}
                  </p>
                  <p style={{ marginBottom: 3 }}>
                    <strong>Exit Date:</strong><br />{viewData.exitDate || "N/A"}
                  </p>
                  <p style={{ marginBottom: 3 }}>
                    <strong>Exit Time:</strong><br />{viewData.exitTime || "N/A"}
                  </p>
                </Col>
                <Col xs={6}>
                  <p style={{ marginBottom: 3 }}>
                    <strong>Whom to Meet:</strong><br />{viewData.membername || "N/A"}
                  </p>
                  <p style={{ marginBottom: 3 }}>
                    <strong>Flat No:</strong><br />{viewData.flatno || "N/A"}
                  </p>
                  <p style={{ marginBottom: 3 }}>
                    <strong>Watchman:</strong><br />{viewData.watchmen || "N/A"}
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" style={{ backgroundColor: "#6C757D", color: "white" }} onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}