import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AddContactStepper from './components/AddContactStepper';
import HomePage from './components/HomePage';
import ParserPage from './components/ParserPage';
import React from 'react';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/parse" element={<ParserPage />} />
          <Route path="/add" element={<AddContactStepper />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
