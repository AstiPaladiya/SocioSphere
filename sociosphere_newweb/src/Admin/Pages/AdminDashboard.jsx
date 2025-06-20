import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,Grid
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExpenseIcon from "@mui/icons-material/Receipt";
import TodayIcon from "@mui/icons-material/Today";
import API_BASE_URL from "../../config";

export default function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState(null); // State to store dashboard data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token"); // Get token from localStorage
            const response = await axios.get(`${API_BASE_URL}/AdminDashboard/dashboard`);
            setDashboardData(response.data); // Set the fetched data
        } catch (err) {
            setError(err.message || "Failed to fetch dashboard data."); // Handle errors
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchDashboardData(); // Fetch data on component mount
    }, []);

    if (loading) {
        return (
            <Container>
                <Typography variant="h5" align="center" sx={{ mt: 4 }}>
                    Loading Dashboard...
                </Typography>
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h5" align="center" sx={{ mt: 4, color: "red" }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
          <Container>
        
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
                                    Dashboard
                                </Typography>
                            </Grid>
                          
                        </Grid>
<br/>
            {/* Row 1 */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                {/* Total Members */}
                <Card
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        background: "linear-gradient(135deg,rgb(133, 189, 229),rgb(206, 220, 234))", // Light blue gradient
                        color: "black", // Dark text for contrast
                        boxShadow: 3,
                    
                    }}
                >
                    <Box sx={{ mr: 2 }}>
                        <PeopleIcon sx={{ fontSize: 50,color:"rgb(3, 121, 206)" }} />
                    </Box>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold"}}>
                            Total Members
                        </Typography>
                        <Typography variant="h4" >{dashboardData.totalMembers}</Typography>
                    </CardContent>
                </Card>

                {/* Total Watchmen */}
                <Card
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        background: "linear-gradient(135deg,rgb(184, 151, 238),rgb(220, 216, 226))", // Light purple gradient
                        color: "black", // Dark text for contrast
                        boxShadow: 3,
                    }}
                >
                    <Box sx={{ mr: 2 }}>
                        <SecurityIcon sx={{ fontSize: 50,color:"rgb(127, 72, 215)" }} />
                    </Box>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Total Watchmen
                        </Typography>
                        <Typography variant="h4" >{dashboardData.totalWatchmen}</Typography>
                    </CardContent>
                </Card>
                <Card
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        background: "linear-gradient(135deg,rgb(239, 203, 146),rgb(239, 225, 205))", // Light orange gradient
                        color: "black", // Dark text for contrast
                        boxShadow: 3,
                    }}
                >
                    <Box sx={{ mr: 2 }}>
                        <TodayIcon sx={{ fontSize: 50 ,color:"rgb(218, 151, 42)"}} />
                    </Box>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold"}}>
                            Today's Visitors
                        </Typography>
                        <Typography variant="h4">{dashboardData.todayVisitorCount}</Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Row 2 */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                {/* Current Year Total Maintenance */}
                <Card
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        background: "linear-gradient(135deg,rgb(149, 225, 156), #c8e6c9)", // Light green gradient
                        color: "black", // Dark text for contrast
                        boxShadow: 3,
                    }}
                >
                    <Box sx={{ mr: 2 }}>
                        <AttachMoneyIcon sx={{ fontSize: 50,color:"rgb(5, 190, 24)" }} />
                    </Box>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Current Year Maintenance
                        </Typography>
                        <Typography variant="h4" >₹{dashboardData.currentYearTotalMaintenance}</Typography>
                    </CardContent>
                </Card>

                {/* Current Year Total Expenses */}
                <Card
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        background: "linear-gradient(135deg,rgb(240, 130, 147),rgb(231, 190, 195))", // Light red gradient
                        color: "black", // Dark text for contrast
                        boxShadow: 3,
                    }}
                >
                    <Box sx={{ mr: 2 }}>
                        <ExpenseIcon sx={{ fontSize: 50 ,color:"rgb(204, 21, 48)"}} />
                    </Box>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold"}}>
                            Current Year Expenses
                        </Typography>
                        <Typography variant="h4" >₹{dashboardData.currentYearTotalExpenses}</Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Row 3 */}
            <Box sx={{ display: "flex", gap: 2 }}>
                {/* Today's Visitor Count */}
                
            </Box>
        </Container>
    );
}