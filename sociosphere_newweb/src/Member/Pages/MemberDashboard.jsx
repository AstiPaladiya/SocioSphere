import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Grid,Box
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ComplaintIcon from "@mui/icons-material/ReportProblem";
import VisitorIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import API_BASE_URL from "../../config";
import {jwtDecode} from "jwt-decode";

export default function MemberDashboard() {
    const token = localStorage.getItem("token");
    let userid = null;
    if (token) {
        const decode = jwtDecode(token);
        userid = decode.UserId;
    }

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/MemberDashboard/dashboard`, {
                headers: { userid },
            });
            setDashboardData(response.data);
        } catch (err) {
            setError(err.message || "Failed to fetch dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
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
            <Typography
                sx={{ fontSize: "30px", fontWeight: "bold", mb: 3, color: "grey" }}
            >
                Dashboard
            </Typography>

            {/* <Grid container spacing={2} sx={{display:"flex"}}> */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Card
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            boxShadow: 3,
                            background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                        }}
                    >
                        <AttachMoneyIcon sx={{ fontSize: 50, color: "blue", mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                Awaiting Approval
                            </Typography>
                            <Typography variant="body1">
                                ₹
                                {dashboardData.maintenanceDetails.pendingMaintenance
                                    ?.totalMaintenance || 0}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Due Date:{" "}
                                {dashboardData.maintenanceDetails.pendingMaintenance?.paidDate ||
                                    "N/A"}
                            </Typography>
                        </CardContent>
                    </Card>
                

                {/* Today's Visitors */}
              
                    <Card
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            boxShadow: 3,
                            background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
                        }}
                    >
                        <VisitorIcon sx={{ fontSize: 50, color: "green", mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                Today's Visitors
                            </Typography>
                            <Typography variant="body1">
                                {dashboardData.visitorLogs.todayVisitorCount}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            boxShadow: 3,
                            background: "linear-gradient(135deg, #ffebee, #ffcdd2)",
                        }}
                    >
                        <ComplaintIcon sx={{ fontSize: 50, color: "red", mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                Pending Complaints
                            </Typography>
                            <Typography variant="body1">
                                {dashboardData.complaints.pendingCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

           

                {/* In Progress Complaints */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Card
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            boxShadow: 3,
                            background: "linear-gradient(135deg, #ede7f6, #d1c4e9)",
                        }}
                    >
                        <ComplaintIcon sx={{ fontSize: 50, color: "purple", mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                In Progress Complaints
                            </Typography>
                            <Typography variant="body1">
                                {dashboardData.complaints.resolvedCount}
                            </Typography>
                        </CardContent>
                    </Card>
               
                    <Card
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            boxShadow: 3,
                            background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 50, color: "teal", mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                Completed Complaints
                            </Typography>
                            <Typography variant="body1">
                                {dashboardData.complaints.completedCount}
                            </Typography>
                        </CardContent>
                    </Card>
               
                    <Card
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            boxShadow: 3,
                            background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
                        }}
                    >
                        <CancelIcon sx={{ fontSize: 50, color: "orange", mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                Rejected Complaints
                            </Typography>
                            <Typography variant="body1">
                                {dashboardData.complaints.rejectedCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            {/* </Grid> */}
        </Container>
    );
}
