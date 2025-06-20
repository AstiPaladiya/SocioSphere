import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Box
} from "@mui/material";
import API_BASE_URL from "../../config";
import { useParams } from "react-router-dom";

const ViewMember = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Member/${id}`);
        setMember(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    fetchMember();
  }, []);

  if (!member) return <Typography>Loading...</Typography>;

  const {
    firstName, middleName, lastName, email, phoneNo, gender, address,
    totalFamilyMember, adharcardNo, squarfootSize, livingDate, status,
    createdAt, updatedAt, photo,
    flatNo, fatherName, motherName, spouseName, spouseOccupation,
    anotherPhoneNo, noOfChild, relationshipStatus, occupation,
    anotherIdProof
  } = member;

  const getInitials = () => {
    return firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : "?";
  };

  const renderField = (label, value) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="subtitle2" fontWeight="bold">{label}</Typography>
      <Typography variant="body2" color="textSecondary">{value ?? "N/A"}</Typography>
    </Grid>
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }} gutterBottom>
        Member Details
      </Typography>

      {/* 👤 Personal Information */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            👤 Personal Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box display="flex" alignItems="center" mb={3}>
            <Avatar src={photo} sx={{ width: 80, height: 80, mr: 2 }}>
              {!photo && getInitials()}
            </Avatar>
            <Typography variant="h6">
              {firstName} {middleName} {lastName}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {renderField("Gender", gender)}
            {renderField("Email", email)}
            {renderField("Phone No", phoneNo)}
            {renderField("Address", address)}
            {renderField("Aadhar Card No", adharcardNo)}
            {renderField("Status", status)}
          </Grid>
        </CardContent>
      </Card>

      {/* 🏠 Residential Details */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            🏠 Residential Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {renderField("Flat No", flatNo)}
            {renderField("Square Foot Size", squarfootSize)}
            {renderField("Living Since", livingDate)}
            {renderField("Total Family Members", totalFamilyMember)}
          </Grid>
        </CardContent>
      </Card>

      {/* 👪 Family Information */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            👪 Family Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {renderField("Father Name", fatherName)}
            {renderField("Mother Name", motherName)}
            {renderField("Spouse Name", spouseName)}
            {renderField("Spouse Occupation", spouseOccupation)}
            {renderField("Another Phone No", anotherPhoneNo)}
            {renderField("No. of Children", noOfChild)}
            {renderField("Relationship Status", relationshipStatus)}
          </Grid>
        </CardContent>
      </Card>

      {/* 🧾 Additional Details */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            🧾 Additional Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {renderField("Occupation", occupation)}
           
          </Grid>

          {anotherIdProof && (
            <Box mt={3}>
              <Typography variant="subtitle2" fontWeight="bold">Another ID Proof</Typography>
              <img
                src={anotherIdProof}
                alt="ID Proof"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: 300,
                  marginTop: 10,
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  padding: 5
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewMember;
