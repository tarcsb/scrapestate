import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';

const ParserPage = () => {
  const [text, setText] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const handleParse = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/parse`, { text }).then(response => {
      setParsedData(response.data);
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Text Parser</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleParse} style={{ marginTop: '16px' }}>
        Parse
      </Button>
      {parsedData && (
        <Paper style={{ marginTop: '16px', padding: '16px' }}>
          <Typography variant="h6">Parsed Data:</Typography>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </Paper>
      )}
    </Container>
  );
};

export default ParserPage;
