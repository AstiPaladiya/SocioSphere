import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
    Typography, Grid, Button, Card, CardContent, Tab, Tabs,
    Table, TableBody, TableCell, TableContainer, Box, TableSortLabel,
    TableHead, TablePagination, TableRow, Paper, TableFooter, useTheme, TextField
} from "@mui/material";
import { Toast, ToastContainer, Modal, Form, Container, Row, Col, InputGroup } from "react-bootstrap";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReactQuill from "react-quill";
import API_BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';
export default function AddSuggestion() {
    const [showToast, setShowToast] = useState(false);
    const [toastHeader, setToastHeader] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const token = localStorage.getItem("token");
    let userid = null;
    if (token) {
        const decode = jwtDecode(token);
        userid = decode.UserId;

    }
    const [data, setData] = useState({
        SuggestionTitle: "",
        Photo: "",
        Description: "",
    });
    const [errors, setErrors] = useState({});
    const [imagView, setImagePreView] = useState(null);
    const navigate=useNavigate();
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "Photo") {
            setData((prev) => ({
                ...prev,
                Photo: files[0],
            }));
            setImagePreView(URL.createObjectURL(files[0]));
        } else {
            setData((prev) => ({
                ...prev,
                [name]: value
            }));
            setImagePreView(null);
        }
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }
    const handleRemove = () => {
        setImagePreView(null);
    }
    const handleCancle=()=>{
           setData({
                SuggestionTitle: "",
                Photo: "",
                Description: "",
            });

            setImagePreView(null);
        }
    const validate = () => {
        let newErrors = {};
        if (!data.SuggestionTitle.trim()) {
            newErrors.SuggestionTitle = "Post title is requierd";
        }
        if (!data.Description.trim())
            newErrors.Description = "Description is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const formData = new FormData();
        formData.append("userid", userid);
        formData.append("SuggestionTitle", data.SuggestionTitle);
        formData.append("Description", data.Description);
        if (data.Photo) {
            formData.append("Photo", data.Photo); // append the file object
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/Suggestion`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
           navigate("/Admin/Suggestion");
            setData({
                SuggestionTitle: "",
                Photo: "",
                Description: "",
            });

            setImagePreView(null);
        } catch (error) {
            let message =
                error.response?.data?.message || // if API sends { message: "something" }
                error.response?.data ||          // if API sends just a string
                "Some error occured.Please try again";
                console.log(message);
               setData({
                SuggestionTitle: "",
                Photo: "",
                Description: "",
            });
        }
    }
    return (
        <>
       
            <Container>

                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography sx={{ color: "grey", fontSize: '30px', fontWeight: 'bold' }}>
                            Craete New Post
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                {/* Basic Details */}
                <Form onSubmit={handleSubmit}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Row>
                                <Col md={4}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Basic Details
                                    </Typography>
                                </Col>
                                <Col md={8}>
                                    <Form.Group controlId="SuggestionTitle">
                                        <Form.Label>Post Title</Form.Label>
                                        <Form.Control type="text" name="SuggestionTitle" value={data.SuggestionTitle} onChange={handleChange} />
                                        {errors.SuggestionTitle && <div style={{ color: "red" }}>{errors.SuggestionTitle}</div>}
                                    </Form.Group>

                                </Col>
                            </Row>

                        </CardContent>
                    </Card>

                    {/* Post Cover */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Row>
                                <Col md={4}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Post cover
                                    </Typography>
                                </Col>
                                <Col md={8}>

                                    <Box
                                        sx={{
                                            border: '2px dashed #ccc',
                                            borderRadius: '8px',
                                            backgroundColor: '#f9fafb',
                                            padding: '50px',
                                            textAlign: 'center',
                                            mb: 2,
                                            minHeight: 250,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "column"
                                        }}
                                    >
                                        {imagView ? (
                                            <img
                                                src={imagView}
                                                alt="Preview"
                                                style={{ height: "250px", borderRadius: 8, objectFit: "contain" }}
                                            />
                                        ) : (
                                            <>
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    Photo not uploaded
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Image used for the suggestion post cover and also for Open Graph meta
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                    <Button variant="outlined" sx={{ mb: 2 }} name="remove" disabled={!imagView} onClick={handleRemove}>Remove</Button>
                                    <label htmlFor="file-upload" style={{ width: "100%", display: "block", cursor: "pointer" }}>
                                        <input type="file" id="file-upload" name="Photo" accept="image/*" onChange={handleChange} style={{ display: "none" }} />

                                        <Box
                                            sx={{
                                                border: '1px dashed #999',
                                                borderRadius: 2,
                                                textAlign: 'center',
                                                py: 3,
                                                backgroundColor: "#f4f6f8"
                                            }}
                                        >
                                            <CloudUploadIcon sx={{ fontSize: 32, color: "#666" }} />
                                            <Typography component="label" htmlFor="file-upload" sx={{ display: 'block', mt: 1, cursor: 'pointer' }}>
                                                <strong>Click to upload</strong> or drag and drop
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                (JPG, PNG, or JPEG max 900×400)
                                            </Typography>
                                        </Box>
                                    </label>

                                </Col>
                            </Row>
                        </CardContent>
                    </Card>

                    {/* Content */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Row>
                                <Col md={4}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Content
                                    </Typography>
                                </Col>
                                <Col md={8}>
                                    <ReactQuill
                                        //  className="custome-quill-outer"
                                        theme="snow"
                                        name="Description"
                                        value={data.Description}
                                        onChange={value => setData(prev => ({ ...prev, Description: value }))}
                                        // value={contact.Description}
                                        // onChange={value => setContactData(prev => ({ ...prev, Description: value }))}
                                        placeholder="Write Suggestion here..."
                                        style={{ height: 200, borderRadius: "3px" }}
                                    /><br /><br />
                                    {errors.Description && <div style={{ color: "red" }}>{errors.Description}</div>}

                                </Col>
                            </Row>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button type="submit" variant="contained" sx={{ background: "#6366f1" }}>
                           <SaveIcon/>&nbsp; Publish 
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCancle} style={{ backgroundColor: "gray", color: "white" }}>
                            Cancel
                        </Button>
                    </Box>
                </Form>
            </Container>
        </>
    )
}
