import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Grid, Paper } from '@mui/material';
import { FieldConfiguration } from './components/admin/FieldConfiguration';
import { VisibilityManager } from './components/helper/VisibilityManager';
import { VisibilityProvider } from './context/VisibilityContext';

const App: React.FC = () => {
  return (
    <VisibilityProvider>
      <Router>
        <Box sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div">
                Field Visibility Demo
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            overflow: 'hidden',
            p: 2,
            gap: 2,
            minHeight: 0
          }}>
            <Paper sx={{ 
              flex: 1, 
              overflow: 'hidden',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h5" gutterBottom>
                Admin View
              </Typography>
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                minHeight: 0,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555',
                }
              }}>
                <FieldConfiguration />
              </Box>
            </Paper>
            <Paper sx={{ 
              flex: 1, 
              overflow: 'hidden',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h5" gutterBottom>
                Helper View
              </Typography>
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                minHeight: 0,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555',
                }
              }}>
                <VisibilityManager />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Router>
    </VisibilityProvider>
  );
};

export default App; 