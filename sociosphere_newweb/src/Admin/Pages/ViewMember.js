// ViewMember.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography } from "@mui/material";

const ViewMember = () => {
    const { id } = useParams();
    const [member, setMember] = useState(null);

    useEffect(() => {
        axios.get(`http://192.168.229.34:5175/api/Member/${id}`)
            .then(res => setMember(res.data))
            .catch(err => console.error("Error fetching member details:", err));
    }, [id]);

    if (!member) return <Typography>Loading...</Typography>;

    return (
        <Card sx={{ m: 4 }}>
            <CardContent>
                <Typography variant="h5">Member Details</Typography>
                <Typography><strong>Name:</strong> {member.firstName} {member.middleName} {member.lastName}</Typography>
                <Typography><strong>Email:</strong> {member.email}</Typography>
                <Typography><strong>Phone:</strong> {member.phoneNo}</Typography>
                <Typography><strong>Gender:</strong> {member.gender}</Typography>
                <Typography><strong>Living Since:</strong> {member.livingDate}</Typography>
                <Typography><strong>Status:</strong> {member.status}</Typography>
                <Typography><strong>Square Foot Size:</strong> {member.squarfootSize}</Typography>
            </CardContent>
        </Card>
    );
};

export default ViewMember;
