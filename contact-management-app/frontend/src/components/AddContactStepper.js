import React, { useState } from 'react';
import { Container, Stepper, Step, StepLabel, Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

const steps = ['Contact Information', 'Category and Status', 'Notes and Attachments'];

const AddContactStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    category: '',
    status: '',
    notes: ''
  });
  const [file, setFile] = useState(null);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/contacts`, formData).then(response => {
      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        axios.post(`${process.env.REACT_APP_API_URL}/contacts/${response.data.id}/upload`, fileData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        });
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      name: '',
      contact_person: '',
      category: '',
      status: '',
      notes: ''
    });
    setFile(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Add New Contact</Typography>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Paper style={{ marginTop: '16px', padding: '16px' }}>
        {activeStep === steps.length ? (
          <div>
            <Typography variant="h5" gutterBottom>Contact added successfully!</Typography>
            <Button onClick={handleReset}>Add Another Contact</Button>
          </div>
        ) : (
          <div>
            {activeStep === 0 && (
              <div>
                <TextField
                  name="name"
                  label="Name"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  name="contact_person"
                  label="Contact Person"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={formData.contact_person}
                  onChange={handleChange}
                />
              </div>
            )}
            {activeStep === 1 && (
              <div>
                <TextField
                  name="category"
                  label="Category"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={formData.category}
                  onChange={handleChange}
                />
                <TextField
                  name="status"
                  label="Status"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={formData.status}
                  onChange={handleChange}
                />
              </div>
            )}
            {activeStep === 2 && (
              <div>
                <TextField
                  name="notes"
                  label="Notes"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                  value={formData.notes}
                  onChange={handleChange}
                />
                <input type="file" onChange={handleFileChange} />
              </div>
            )}
            <div style={{ marginTop: '16px' }}>
              <Button disabled={activeStep === 0} onClick={handleBack} style={{ marginRight: '8px' }}>Back</Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default AddContactStepper;
