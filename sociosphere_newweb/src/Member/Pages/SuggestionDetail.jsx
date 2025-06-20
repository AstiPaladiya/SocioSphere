import React, { useState, useEffect } from "react";
import axios from "axios";
import {Container, Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";
import Suggestion from "./Suggestion";
import { red } from '@mui/material/colors';
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

export default function SuggestionDetail() {
  const { id } = useParams();
  const [suggestion, setSuggestion] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchSuggestionDetail();
  }, []);

  const fetchSuggestionDetail = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Suggestion/getSuggestionById/${id}`);
      if (Array.isArray(res.data)) {
        setSuggestion(res.data[0] || {});
      } else {
        setSuggestion(res.data);
      }
    } catch (error) {
      console.error("Error fetching suggestion details:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!suggestion) return <Typography>Loading...</Typography>;

  return (
    // <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Container>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
            Suggestion Detail
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* LEFT CARD: Suggestion Detail */}
        <Grid item sm={7}>
          <Card sx={{ width: "550px" }}>
            <CardContent>
              <Typography variant="h5" >
                {suggestion.suggestionTitle}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ mb: 2 }} dangerouslySetInnerHTML={{ __html: suggestion.description }} />


              {suggestion.photo && (
                <Box sx={{ my: 2, textAlign: "center" }}>
                  <img
                    src={suggestion.photo}
                    alt="Suggestion"
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}


              <hr sx={{ my: 2 }} />

              <Box display="flex" alignItems="center">
                <Avatar src={suggestion.userProfile} sx={{ bgcolor: red[500], mr: 2 }}>
                  {suggestion.userName ? suggestion.userName[0] : "U"}
                </Avatar>
                <Box>
                  <Typography variant="body1" style={{ fontSize: "17px", display: "flex" }}><strong>{suggestion.userName}</strong></Typography>
                  <Typography variant="body1" color="text.secondary">
                    Posted {suggestion.timeAgo}
                  </Typography>

                </Box>
              </Box>



            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT CARD: Votes & Tabs */}


        <Grid item sm={5}>
          <Card sx={{ height: "100%", width: "300px", minHeight: "400px" }}>
            <CardContent>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                sx={{
                  "& .MuiTab-root": {
                    color: "gray", // Default tab color
                  },
                  "& .Mui-selected": {
                    color: tabValue === 0 ? "green" : "red", 
                  },
                }}
              >
                <Tab
                  icon={<ThumbUpAltIcon />}
                  iconPosition="start"
                  label="Upward Votes"
                  sx={{
                    "&.Mui-selected": {
                      color: "green", // Green for upward votes
                    },
                      textTransform:"none"
                  }}
                />
                <Tab
                  icon={<ThumbDownAltIcon />}
                  iconPosition="start"
                  
                  label="Downward Votes"
                  sx={{
                    "&.Mui-selected": {
                      color: "red", // Red for downward votes
                    },
                    textTransform:"none"
                  }}
                />
              </Tabs>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                {tabValue === 0 ? (
                  suggestion.upwardVoters?.length > 0 ? (
                    suggestion.upwardVoters.map((voter, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Avatar src={voter.voterProfile} sx={{ mr: 2 }} />
                        <Typography >{voter.voterName}</Typography><hr/>
                      </Box>
                    ))
                ) : (
                    <Typography>No upward votes yet.</Typography>
                  )
                ) : suggestion.downwardVoters?.length > 0 ? (
                  suggestion.downwardVoters.map((voter, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Avatar src={voter.voterProfile} sx={{ mr: 2 }} />
                      <Typography variant="body1">{voter.voterName}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>No downward votes yet.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
