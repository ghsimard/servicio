import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Container, 
  Button, 
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import { Person, Email, Badge, ArrowBack, Close } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            You need to be logged in to view this page
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/auth-test?tab=1')}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
          aria-label="Back to home"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">Back to Home</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: 'secondary.main',
              fontSize: '2.5rem',
              mb: 2
            }}
          >
            {user.username.substring(0, 1).toUpperCase()}
          </Avatar>
          <Typography variant="h4" gutterBottom>
            {user.username}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            User ID: {user.user_id}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom sx={{ ml: 2 }}>
          Account Information
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText 
              primary="Username" 
              secondary={user.username} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText 
              primary="Email" 
              secondary={user.email} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Badge />
            </ListItemIcon>
            <ListItemText 
              primary="Account ID" 
              secondary={user.user_id}
            />
          </ListItem>
        </List>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container justifyContent="center">
          <Grid item>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => navigate('/')}
              startIcon={<Close />}
              sx={{ px: 4 }}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AccountPage; 