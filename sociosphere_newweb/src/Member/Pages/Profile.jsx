import React, { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Divider,
    Box,
    Button,
    Avatar,
} from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../../config";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const [member, setMember] = useState(null);
    const [isRefresh, setIsRefresh] = useState(false);
    const [errors, setErrors] = useState({});
    const [profilePreview, setProfilePreview] = useState(null);
    const [idProofPreview, setIdProofPreview] = useState(null);

    const validate = () => {
        const newErrors = {};
        if (!member.firstName) newErrors.firstName = "First Name is required";
        if (!member.lastName) newErrors.lastName = "Last Name is required";
        if (!member.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(member.email)) newErrors.email = "Invalid email";
        if (!member.phoneNo) newErrors.phoneNo = "Phone number is required";
        else if (!/^\d{10}$/.test(member.phoneNo)) newErrors.phoneNo = "Phone number must be 10 digits";
        if (!member.adharcardNo) newErrors.adharcardNo = "Aadhar number is required";
        if (!member.gender) newErrors.gender = "Gender is required";
        if (!member.status) newErrors.status = "Status is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchMember = async () => {
        try {
            const token = localStorage.getItem("token");
            let UserId = null;
            if (token) {
                const decode = jwtDecode(token);
                UserId = decode.UserId;
            }

            const res = await axios.get(`${API_BASE_URL}/Member/${UserId}`);
            setMember(Array.isArray(res.data) ? res.data[0] : res.data);
        } catch (error) {
            console.error("Error fetching member:", error);
        }
    };

    useEffect(() => {
        fetchMember();
    }, [isRefresh]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "profilePhoto") {
            const file = files[0];
            setProfilePreview(URL.createObjectURL(file));
            setMember((prev) => ({ ...prev, profilePhoto: file }));
        } else if (name === "anotherIdProofFile") {
            const file = files[0];
            setIdProofPreview(URL.createObjectURL(file));
            setMember((prev) => ({ ...prev, anotherIdProofFile: file }));
        } else {
            setMember((prev) => ({ ...prev, [name]: value }));
        }

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleUpdate = async () => {
        if (!validate()) return;

        try {
            const form = new FormData();
            form.append("FirstName", member.firstName ?? "");
            form.append("MiddleName", member.middleName ?? "");
            form.append("LastName", member.lastName ?? "");
            form.append("Email", member.email ?? "");
            form.append("PhoneNo", member.phoneNo ?? "");
            form.append("Gender", member.gender ?? "");
            form.append("Address", member.address ?? "");
            form.append("TotalFamilyMember", member.totalFamilyMember ?? "");
            form.append("AdharcardNo", member.adharcardNo ?? "");
            form.append("SquarfootSize", member.squarfootSize ?? "");
            form.append("LivingDate", member.livingDate ?? "");
            form.append("Status", member.status ?? "");
            form.append("FlatNo", member.flatNo ?? "");
            form.append("FatherName", member.fatherName ?? "");
            form.append("MotherName", member.motherName ?? "");
            form.append("SpouseName", member.spouseName ?? "");
            form.append("SpouseOccupation", member.spouseOccupation ?? "");
            form.append("AnotherPhoneNo", member.anotherPhoneNo ?? "");
            form.append("NoOfChild", member.noOfChild ?? "");
            form.append("RelationshipStatus", member.relationshipStatus ?? "");
            form.append("Occupation", member.occupation ?? "");
            form.append("DateOfBirth", member.dateOfBirth ?? "");

            if (member.profilePhoto instanceof File) {
                form.append("ProfilePhoto", member.profilePhoto);
            }
            if (member.anotherIdProofFile instanceof File) {
                form.append("AnotherIdProof", member.anotherIdProofFile);
            }

            const token = localStorage.getItem("token");
            let UserId = null;
            if (token) {
                const decode = jwtDecode(token);
                UserId = decode.UserId;
            }

            const response = await fetch(`${API_BASE_URL}/Member/updateMember/${UserId}`, {
                method: "PUT",
                body: form,
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Member updated successfully!");
                setIsRefresh(!isRefresh);
            } else {
                alert("❌ Failed to update member: " + result.message);
            }
        } catch (error) {
            console.error("Error during update:", error);
            alert("❌ Something went wrong during update.");
        }
    };

    if (!member) return <Typography>Loading...</Typography>;

    const renderInput = (label, name, type = "text", readOnly = false) => (
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                variant="outlined"
                label={label}
                name={name}
                type={type}
                value={member[name] ?? ""}
                onChange={handleChange}
                size="small"
                error={!!errors[name]}
                helperText={errors[name]}
                InputProps={{ readOnly }}
            />
        </Grid>
    );

    return (
        <Box sx={{ padding: 4 }}>
              <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
               Profile
            </Typography>

            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* Personal Information */}
                <Grid item xs={12}>
                    <Card elevation={4}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                👤 Personal Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box display="flex" alignItems="center">
                                        <Avatar
                                            src={profilePreview || member.photo}
                                            sx={{ width: 80, height: 80, mr: 2 }}
                                        >
                                            {member.firstName?.[0] ?? "?"}
                                        </Avatar>
                                        <label htmlFor="profilePhoto">Upload Profile Photo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            name="profilePhoto"
                                            onChange={handleChange}
                                            id="profilePhoto"
                                        />
                                    </Box>
                                </Grid>
                                {renderInput("First Name", "firstName")}
                                {renderInput("Middle Name", "middleName")}
                                {renderInput("Last Name", "lastName")}
                                {renderInput("Gender", "gender")}
                                {renderInput("Email", "email", "email", true)}
                                {renderInput("Phone Number", "phoneNo")}
                                {renderInput("Address", "address")}
                                {renderInput("Aadhar Card Number", "adharcardNo")}
                                {renderInput("Status", "status")}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Residential Details */}
                <Grid item xs={12}>
                    <Card elevation={4}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                🏠 Residential Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {renderInput("Flat No", "flatNo")}
                                {renderInput("Square Foot Size", "squarfootSize")}
                                {renderInput("Living Since", "livingDate", "date")}
                                {renderInput("Total Family Members", "totalFamilyMember")}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Family Info */}
                <Grid item xs={12}>
                    <Card elevation={4}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                👪 Family Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {renderInput("Father Name", "fatherName")}
                                {renderInput("Mother Name", "motherName")}
                                {renderInput("Spouse Name", "spouseName")}
                                {renderInput("Spouse Occupation", "spouseOccupation")}
                                {renderInput("Another Phone Number", "anotherPhoneNo")}
                                {renderInput("No. of Children", "noOfChild")}
                                {renderInput("Relationship Status", "relationshipStatus")}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Additional Info */}
                <Grid item xs={12}>
                    <Card elevation={12}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                🧾 Additional Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {renderInput("Occupation", "occupation")}
                                <Grid item xs={12} md={6}>
                                    <label htmlFor="anotherIdProofFile">Upload ID Proof</label>
                                    <input
                                        type="file"
                                        name="anotherIdProofFile"
                                        accept="image/*"
                                        onChange={handleChange}
                                        style={{ display: "block", marginTop: 8 }}
                                    />
                                    {idProofPreview && (
                                        <img
                                            src={idProofPreview}
                                            alt="ID Preview"
                                            style={{ width: 120, height: "auto", marginTop: 8, borderRadius: 8 }}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
