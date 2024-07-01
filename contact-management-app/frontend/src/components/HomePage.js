import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, IconButton, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';

const HomePage = () => {
  const [contacts, setContacts] = useState([]);
  const statusColors = {
    INITIAL: '#e0e0e0',
    ACKNOWLEDGED: '#ffc107',
    'IN PROGRESS': '#2196f3',
    PENDING: '#9c27b0',
    'PENDING WAITING': '#ff5722',
    'PENDING FINAL': '#4caf50',
    DISQUALIFIED: '#f44336'
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/contacts`).then(response => {
      setContacts(response.data);
    });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    axios.put(`${process.env.REACT_APP_API_URL}/contacts/${id}/status`, { status: newStatus }).then(response => {
      setContacts(contacts.map(contact => (contact.id === id ? { ...contact, status: newStatus } : contact)));
    });
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    axios.post(`${process.env.REACT_APP_API_URL}/contacts/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => {
      if (response.data.message) {
        alert(`File uploaded successfully: ${response.data.filename}`);
      } else {
        alert(`File upload failed: ${response.data.error}\nDetails: ${response.data.details}`);
      }
    });
  };

  const handleFileDownload = (id, filename) => {
    axios.get(`${process.env.REACT_APP_API_URL}/contacts/${id}/download/${filename}`, { responseType: 'blob' }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Contact Management System</Typography>
      <Paper>
        <List>
          {contacts.map(contact => (
            <ListItem key={contact.id} style={{ backgroundColor: statusColors[contact.status], margin: '8px 0' }}>
              <ListItemText primary={contact.name} secondary={contact.contact_person} />
              <Select value={contact.status} onChange={e => handleStatusChange(contact.id, e.target.value)}>
                {Object.keys(statusColors).map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
              <input
                accept=".docx,.txt,.pdf,.doc,.rtf,.json,.xml,.html,.zip,.tar"
                style={{ display: 'none' }}
                id={`upload-button-${contact.id}`}
                type="file"
                onChange={e => handleFileChange(contact.id, e)}
              />
              <label htmlFor={`upload-button-${contact.id}`}>
                <IconButton color="primary" component="span">
                  <UploadFileIcon />
                </IconButton>
              </label>
              {contact.filename && (
                <IconButton color="secondary" onClick={() => handleFileDownload(contact.id, contact.filename)}>
                  <DownloadIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default HomePage;
