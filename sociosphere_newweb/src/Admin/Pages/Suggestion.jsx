import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Grid, Card, CardContent, Button, CardMedia, CardHeader, Box, IconButton, Avatar, Tabs, Tab, Fab,
  Divider
} from "@mui/material";
import { Toast, ToastContainer, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import Pagination from '@mui/material/Pagination';
import AddIcon from "@mui/icons-material/Add";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'; 
import { MdDelete } from "react-icons/md";
import { styled } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../../config';
import { jwtDecode } from "jwt-decode";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Badge } from "react-bootstrap";
import ViewListIcon from '@mui/icons-material/ViewList';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import { IoEyeOutline } from "react-icons/io5";
import DeleteIcon from '@mui/icons-material/Delete';

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


export default function Suggestion() {
  const token = localStorage.getItem("token");

  let UserId = null;
  if (token) {
    const decode = jwtDecode(token);
    UserId = decode.UserId;

  }
  const [showToast, setShowToast] = useState(false);
  const [toastHeader, setToastHeader] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [value, setValue] = React.useState(0);
  const [suggestion, setSuggestions] = useState([]);
  const [suggestionLoginMember, setSuggestionsLoginMember] = useState([]);

  const [recentFilter, setRecentFilter] = useState(false);
  const [recentFilterMy, setRecentFilterMy] = useState(false);

  const handleChange = (event, newValue) => {
    setRecentFilter(false);

    setValue(newValue);
  };
  const [member, setMemberDropDown] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [liked, setLike] = useState({ SuggestionId: null, UserId: null, IsLiked: false })
  //padination
  const [page, setPage] = useState(1);
  const [suggestMember, setSuggestMemberData] = useState([]);
  const itemsPerPage = 6; // or any number you want

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const pageCount = Math.ceil(suggestion.length / itemsPerPage);
  const paginatedSuggestions = suggestion.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const pageCountMember = Math.ceil(suggestionLoginMember.length / itemsPerPage);
  const paginatedSuggestionsMember = suggestionLoginMember.slice(
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
  // Add to your component state:
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };
  const navigate = useNavigate();
  const handleAddSuggestion = () => {
    navigate("/Admin/AddSuggestion"); // Make sure this route exists and renders your add suggestion form
  };
  const [setting, ShowSetting] = useState(null);
  //set upward data
  const handleAddUpward = (id, UserId, isLiked) => {
    addUpward(id, UserId, isLiked);
  }
  const showMemberDropDown = () => {
    fetchMemberList();
    setMemberDropDown(true);
  }
  //displaysetting box
  const handleShowSettigs = (id) => {
    ShowSetting((prev) => (prev == id ? null : id));
  }
  const addUpward = async (id, UserId, isLiked) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/Suggestion/addSuggestionVote`, {
        SuggestionId: id,
        UserId: UserId,
        Isliked: isLiked // match backend property name exactly!
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      );
      fetchAllSuggestion();
      fetchAllSuggestionByMember();
    } catch (error) {
      console.log(error);
    }
  }
  //fetch all suggestion
  const fetchAllSuggestion = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Suggestion/displayAllSuggestion`, {
        headers: {
          memberId: UserId
        }
      });
      setSuggestions(res.data);
      setRecentFilter(false);
      setMemberDropDown(false);
    } catch (error) {
      console.log(error);
    }
  }
  //fetch all suggestion
  const fetchAllSuggestionByMember = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Suggestion/allSuggestionByMember`, {
        headers: {
          memberId: UserId,
        }
      });
      setSuggestionsLoginMember(res.data);
      setRecentFilterMy(false);
      setMemberDropDown(false);
    } catch (error) {
      console.log(error);
    }
  }

  //all suggetion filter
  const fetchRecentData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Suggestion/allRecentSuggestion`, {
        headers: {
          memberId: UserId
        }
      });
      setSuggestions(res.data);
      setRecentFilter(true);
    } catch (error) {
      console.log(error);
    }
  }
  //particular login member recent filter
  const fetchRecentDataMy = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Suggestion/allRecentSuggestion`, {
        headers: {
          memberId: UserId
        }
      });
      setSuggestionsLoginMember(res.data);
      setRecentFilterMy(true);
    } catch (error) {
      console.log(error);
    }
  }
  //fetch member list
  const fetchMemberList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Suggestion/allPostedSuggestionMember`, {
        headers: {
          memberId: UserId
        }
      });
      setSuggestMemberData(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  //fetch data by particular member
  const handleSelectMember = (id) => {
    setSelectedMember(id);
    fetchSuggestionByMember(id);
  }
  const fetchSuggestionByMember = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Suggestion/getSuggestionByMemberId/${id}`, {
        headers: {
          memberId: UserId
        }
      });
      setSuggestions(res.data);
      setMemberDropDown(false);
    } catch (error) {
      console.log(error);
    }
  }
  //delete suggestion
  const handleDeleteSuggestion = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/Suggestion/deleteSuggestion/${id}`);
      const msg = res.data.message || "Suggestion deleted successfully";
      setToastHeader("Success!")
      setToastMessage(`${msg}`);
      setToastVariant("success");
      setShowToast(true);
      fetchAllSuggestionByMember();
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
    setRecentFilter(false);
    setRecentFilterMy(false);
    setMemberDropDown(false);
    fetchAllSuggestion();
    fetchAllSuggestionByMember();

  }, []);
  return (
    <>
      <ToastContainer position="top-right"
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
              Suggestions
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Box sx={{ borderBottom: 1, borderColor: 'lightgrey', bgcolor: "whitesmoke" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="All Suggestions"  {...a11yProps(0)} sx={{ fontSize: '14px' }} />
            <Tab label="My Suggestions" {...a11yProps(1)} sx={{ fontSize: '14px' }} />
          </Tabs>
        </Box>
        {/* tab for all sggestions */}
        <CustomTabPanel value={value} index={0}>
          <Button onClick={fetchRecentData}
            style={{

              alignItems: "center",
              backgroundColor: "#E8E8E8", // light grey
              borderRadius: "2px",
              padding: "4px",
              fontWeight: 400,
              fontSize: "15px",
              color: "#333",
              // border:"1px solid black" ,
              textTransform: "none",

            }}
          ><AccessTimeIcon />&nbsp;Recent</Button> {recentFilter && (<Chip
            label="Clear filter"
            onDelete={fetchAllSuggestion}
            deleteIcon={<CloseIcon />}
            color="primary"
            variant="outlined"
            sx={{ ml: 1 }}
          />
          )}
          <Button
            style={{

              alignItems: "center",
              // backgroundColor: "#E8E8E8", // light grey
              borderRadius: "2px",
              padding: "4px",
              fontWeight: 400,
              fontSize: "15px",
              color: "#333",
              float: "right",
              textTransform: "none",
            }}
            onClick={showMemberDropDown}
          ><ViewListIcon /></Button>
          {member && (
            <Box
              sx={{
                position: "fixed", // or "fixed" if you want it to stay on screen
                //  top: 100,             // adjust as needed
                right: 100,            // adjust as needed
                width: 200,
                maxHeight: 250,
                bgcolor: "background.paper",
                boxShadow: 3,
                borderRadius: 1,
                overflowY: "auto",
                zIndex: 1200,
                p: 1,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  cursor: "pointer",
                  borderRadius: 1,
                  bgcolor: selectedMember === "" ? "primary.light" : "transparent",
                  "&:hover": { bgcolor: "grey.100" }
                }} onClick={() => {
                  setSelectedMember("");
                  fetchAllSuggestion();
                }}>All</Box>
              {suggestMember.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    bgcolor: selectedMember === m.id ? "primary.light" : "transparent",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "grey.100" }
                  }}
                  onClick={() => handleSelectMember(m.id)}
                >
                  {m.username}
                </Box>
              ))}
            </Box>
          )}
          <hr />
          {chunkArray(paginatedSuggestions, 2).map((row, rowIdx) => (
            <Box
              key={rowIdx}
              display="flex"
              justifyContent="center"
              alignItems="stretch"
              mb={3}
              sx={{
                gap: 3,

              }}
            >
              {row.map((sug) => {
                const isExpanded = expandedCard === sug.id;
                const showSettings = setting == sug.id;
                return (
                  <Card
                    key={sug.id}
                    sx={{
                      flex: 1,
                      minWidth: 320,
                      maxWidth: 400,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      position:"relative"
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar src={sug.userProfile} sx={{ bgcolor: red[500] }}>
                          {sug.userName ? sug.userName[0] : "U"}
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings" onClick={() => handleShowSettigs(sug.id)}>
                          <MoreVertIcon />
                        </IconButton>

                      }
                      title={sug.userName}
                      subheader={sug.timeAgo}
                    />
                    {showSettings && (
                      <Box
                        sx={{
                               position: "absolute",
                          alignItems: "center",
                          top: 50,
                          left: 220,
                          width: 150,
                          maxHeight: 250,
                          bgcolor: "background.paper",
                          boxShadow: 3,
                          borderRadius: 1,
                          overflowY: "auto",
                          zIndex: 1200,
                          p: 2,
                        }}
                      >
                        <Box
                          onClick={()=>navigate(`/Admin/SuggestionDetail/${sug.id}`)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          fontSize: 15,
                          color: "black",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          transition: "background-color 0.3s",
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                        }}>
                          <IoEyeOutline />
                          View
                        </Box>
                      </Box>
                    )}

                    {/* Only render CardMedia if sug.photo exists */}
                    {sug.photo && (
                      <CardMedia
                        component="img"
                        image={sug.photo}
                        alt="Suggestion Cover"
                        sx={{ objectFit: "cover", maxHeight: 200 }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, pb: 0, mb: 0 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {sug.suggestionTitle}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          display: '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'unset' : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: isExpanded ? 'normal' : 'initial',
                          transition: 'all 0.2s',
                          pb: 0
                        }}
                        // component="div"
                        dangerouslySetInnerHTML={{ __html: sug.description }}
                      />
                      {sug.description && sug.description.length > 120 && (
                        <Box>
                          <Button
                            size="small"
                            onClick={() => handleExpandClick(sug.id)}
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton
                        aria-label="like"
                        onClick={() => handleAddUpward(sug.id, UserId, true)}
                      >
                        {sug.isLiked === true ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                        <span style={{ marginLeft: 4, fontSize: "19px" }}>{sug.totalLikes}</span>
                      </IconButton>
                      <IconButton
                        aria-label="dislike"
                        onClick={() => handleAddUpward(sug.id, UserId, false)}
                      >
                        {sug.isLiked === false ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                        <span style={{ marginLeft: 4, fontSize: "19px" }}>{sug.totalDislike}</span>
                      </IconButton>
                    </CardActions>
                  </Card>
                );
              })}
            </Box>
          ))}
          {/* Centered Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </CustomTabPanel>
        {/* tab for login member sggestions */}
        <CustomTabPanel value={value} index={1}>
          <Button onClick={fetchRecentDataMy}
            style={{

              alignItems: "center",
              backgroundColor: "#E8E8E8", // light grey
              borderRadius: "2px",
              padding: "4px",
              fontWeight: 400,
              fontSize: "15px",
              color: "#333",
              // border:"1px solid black" ,
              textTransform: "none",

            }}
          ><AccessTimeIcon />&nbsp;Recent</Button> {recentFilterMy && (<Chip
            label="Clear filter"
            onDelete={fetchAllSuggestionByMember}
            deleteIcon={<CloseIcon />}
            color="primary"
            variant="outlined"
            sx={{ ml: 1 }}
          />
          )}

          <hr />
          {chunkArray(paginatedSuggestionsMember, 2).map((row, rowIdx) => (
            <Box
              key={rowIdx}
              display="flex"
              justifyContent="center"
              alignItems="stretch"
              mb={3}
              sx={{
                gap: 3,

              }}
            >
              {row.map((sug) => {
                const isExpanded = expandedCard === sug.id;
                const showSettings = setting === sug.id;

                return (
                  <Card
                    key={sug.id}
                    sx={{
                      flex: 1,
                      minWidth: 320,
                      maxWidth: 400,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      position: "relative"
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar src={sug.userProfile} sx={{ bgcolor: red[500] }}>
                          {sug.userName ? sug.userName[0] : "U"}
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings" onClick={() => handleShowSettigs(sug.id)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={sug.userName}
                      subheader={sug.timeAgo}
                    />
                    {showSettings && (
                      <Box
                        sx={{
                          position: "absolute",
                          alignItems: "center",

                          // right: 10,
                          top: 50,
                          left: 220,
                          width: 150,
                          maxHeight: 250,
                          bgcolor: "background.paper",
                          boxShadow: 3,
                          borderRadius: 1,
                          overflowY: "auto",
                          zIndex: 1200,
                          p: 2,
                        }}
                      >
                        <Box 
                          onClick={()=>navigate(`/Admin/SuggestionDetail/${sug.id}`)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          cursor: "pointer",
                          fontSize: 15,
                          color: "black",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          transition: "background-color 0.3s",
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                        }}>
                          <IoEyeOutline />
                          View
                        </Box>
                        <Box
                          onClick={() => handleDeleteSuggestion(sug.id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            fontSize: 15,
                            color: "black",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            transition: "background-color 0.3s",
                            '&:hover': {
                              backgroundColor: '#f0f0f0',
                            },
                          }}>
                          <DeleteIcon />
                          Delete
                        </Box>
                      </Box>
                    )}
                    {/* Only render CardMedia if sug.photo exists */}
                    {sug.photo && (
                      <CardMedia
                        component="img"
                        image={sug.photo}
                        alt="Suggestion Cover"
                        sx={{ objectFit: "cover", maxHeight: 200 }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, pb: 0, mb: 0 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {sug.suggestionTitle}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          display: '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'unset' : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: isExpanded ? 'normal' : 'initial',
                          transition: 'all 0.2s',
                          pb: 0
                        }}
                        // component="div"
                        dangerouslySetInnerHTML={{ __html: sug.description }}
                      />
                      {sug.description && sug.description.length > 120 && (
                        <Box>
                          <Button
                            size="small"
                            onClick={() => handleExpandClick(sug.id)}
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton
                        aria-label="like"
                        onClick={() => handleAddUpward(sug.id, UserId, true)}
                      >
                        {sug.isLiked === true ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                        <span style={{ marginLeft: 4, fontSize: "19px" }}>{sug.totalLikes}</span>
                      </IconButton>
                      <IconButton
                        aria-label="dislike"
                        onClick={() => handleAddUpward(sug.id, UserId, false)}
                      >
                        {sug.isLiked === false ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                        <span style={{ marginLeft: 4, fontSize: "19px" }}>{sug.totalDislike}</span>
                      </IconButton>
                    </CardActions>
                  </Card>
                );
              })}
            </Box>
          ))}
          {/* Centered Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={pageCountMember}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </CustomTabPanel>

        {/* Floating "New Post" Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 2000
          }}
          onClick={handleAddSuggestion}
        >
          <AddIcon />
        </Fab>
      </Container>
    </>
  );
}