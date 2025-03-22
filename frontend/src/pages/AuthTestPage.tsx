import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Tabs,
  Tab,
  CircularProgress,
  Paper,
  Alert,
  Container
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      sx={{
        display: value === index ? 'block' : 'none',
        p: 3,
        width: '100%'
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    'aria-controls': `auth-tabpanel-${index}`,
  };
}

// Update API URL to include port explicitly
const API_URL = 'http://localhost:3001/api';

// Common styles for input fields
const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: 'orange', borderWidth: '2px' },
    '&.Mui-error fieldset': { borderColor: 'error.main' }
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': { color: 'orange' }
  }
};

const AuthTestPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use auth context instead of local state
  const { login, register, verifyEmail, token, user, loading, error: authError, requestPasswordReset, resetPassword } = useAuth();

  // Set default tab to 0 (Register) if not otherwise specified
  const [tabValue, setTabValue] = useState(0);
  const [apiResponse, setApiResponse] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerLastName2, setRegisterLastName2] = useState('');

  // Verify email state
  const [verifyToken, setVerifyToken] = useState('');

  // Protected endpoint test state
  const [protectedEndpointUrl, setProtectedEndpointUrl] = useState('/api/dashboard/profile');

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Update error state when authError changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Check for tab query parameter on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam) {
      const tabIndex = parseInt(tabParam, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 4) {
        setTabValue(tabIndex);
      }
    }
  }, [location.search]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setApiResponse(null);
    
    try {
      await login(loginEmail, loginPassword);
      
      // Redirect to main search page
      navigate('/');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('auth.login.failed');
      setError(errorMessage);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setApiResponse(null);
    
    try {
      // Combine firstname and lastname as the name parameter
      const fullName = `${registerFirstName} ${registerLastName}`;
      
      const result = await register({
        email: registerEmail, 
        password: registerPassword,
        username: registerFirstName,
        firstname: registerFirstName,
        lastname: registerLastName,
        lastname2: registerLastName2,
        name: fullName // Add the name field required by the backend
      });
      
      setApiResponse({
        userId: result.userId,
        verificationToken: result.verificationToken,
        message: t('auth.register.success')
      });
      
      // If we received a verification token, automatically set it for the verify tab
      if (result.verificationToken) {
        setVerifyToken(result.verificationToken);
        // Switch to the verification tab
        setTabValue(2);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setApiResponse(null);
    
    try {
      const result = await verifyEmail(verifyToken);
      
      setApiResponse({
        message: t('auth.verify.success'),
        userId: result.userId
      });
      
      // Show success message briefly, then redirect to login tab
      setTimeout(() => {
        navigate('/auth-test?tab=1'); // Navigate to login tab with query parameter
      }, 1500); 
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('auth.verify.failed');
      setError(errorMessage);
    }
  };

  const testProtectedEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError(t('auth.protected.noToken'));
      return;
    }
    
    setError('');
    setApiResponse(null);
    
    try {
      const response = await fetch(`${API_URL}${protectedEndpointUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setApiResponse(data);
      } else {
        setError(data.message || t('auth.protected.failed'));
      }
    } catch (error: unknown) {
      console.error('Protected endpoint error:', error);
      setError(t('auth.protected.connectionError'));
    }
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setApiResponse(null);
    
    try {
      const result = await requestPasswordReset(resetEmail);
      setApiResponse({
        message: t('auth.forgotPassword.success'),
        resetToken: result.resetToken
      });
      
      // If we received a reset token, automatically set it for the reset password tab
      if (result.resetToken) {
        setResetToken(result.resetToken);
        // Switch to the reset password tab
        setTabValue(4);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('auth.forgotPassword.failed');
      setError(errorMessage);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setApiResponse(null);
    
    try {
      const result = await resetPassword(resetToken, newPassword);
      setApiResponse({
        message: t('auth.resetPassword.success')
      });
      
      // Show success message briefly, then redirect to login tab
      setTimeout(() => {
        navigate('/auth-test?tab=1'); // Navigate to login tab
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('auth.resetPassword.failed');
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {tabValue === 0 ? t('auth.register.title', 'Registration') : 
         tabValue === 1 ? t('auth.login.title', 'Sign In') : 
         tabValue === 2 ? t('auth.verify.title') :
         tabValue === 3 ? t('auth.forgotPassword.title') :
         t('auth.resetPassword.title')}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="auth tabs"
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab 
            label={t('common.register')} 
            {...a11yProps(0)} 
            sx={{ fontWeight: tabValue === 0 ? 'bold' : 'normal' }}
          />
          <Tab 
            label={t('common.login')} 
            {...a11yProps(1)} 
            sx={{ fontWeight: tabValue === 1 ? 'bold' : 'normal' }}
          />
          <Tab 
            label={t('common.verifyEmail')} 
            {...a11yProps(2)} 
            sx={{ fontWeight: tabValue === 2 ? 'bold' : 'normal' }}
          />
          <Tab 
            label={t('auth.forgotPassword.title')} 
            {...a11yProps(3)} 
            sx={{ fontWeight: tabValue === 3 ? 'bold' : 'normal' }}
          />
          <Tab 
            label={t('auth.resetPassword.title')} 
            {...a11yProps(4)} 
            sx={{ fontWeight: tabValue === 4 ? 'bold' : 'normal' }}
          />
        </Tabs>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {apiResponse && (
        <Paper sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', maxHeight: 200, overflow: 'auto' }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('auth.apiResponse')}:
          </Typography>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
            {JSON.stringify(apiResponse, null, 2)}
          </Box>
        </Paper>
      )}
      
      {/* Authentication status */}
      <Paper sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('auth.status.title')}:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2">
            {t('auth.status.userId')}: {user?.user_id || t('auth.status.notLoggedIn')}
          </Typography>
          <Typography variant="body2">
            {t('auth.status.token')}: {token ? `${token.substring(0, 15)}...` : t('auth.status.noToken')}
          </Typography>
        </Box>
      </Paper>
      
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          {t('auth.register.title')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          {t('auth.register.description')}
        </Typography>
        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('auth.register.firstName', 'First Name')}
                value={registerFirstName}
                onChange={(e) => setRegisterFirstName(e.target.value)}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('auth.register.lastName', 'Last Name')}
                value={registerLastName}
                onChange={(e) => setRegisterLastName(e.target.value)}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('auth.register.lastName2', 'Second Last Name')}
                value={registerLastName2}
                onChange={(e) => setRegisterLastName2(e.target.value)}
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label={t('auth.register.email')}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label={t('auth.register.password')}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                helperText={t('auth.register.passwordHelp')}
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                fullWidth
                size="large"
                sx={{ 
                  mt: 3, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: 3,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    boxShadow: 5
                  }
                }}
              >
                REGISTER
              </Button>
            </Grid>
          </Grid>
        </form>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          {t('auth.login.title')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          {t('auth.login.description')}
        </Typography>
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label={t('auth.login.email')}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label={t('auth.login.password')}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                fullWidth
                size="large"
                sx={{ 
                  mt: 2, 
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {t('auth.login.buttonText')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          {t('auth.verify.title')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          {t('auth.verify.description')}
        </Typography>
        <form onSubmit={handleVerifyEmail}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('auth.verify.token')}
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                fullWidth
                size="large"
                sx={{ 
                  mt: 2, 
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {t('auth.verify.buttonText')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          {t('auth.forgotPassword.title')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          {t('auth.forgotPassword.description')}
        </Typography>
        <form onSubmit={handleRequestPasswordReset}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('auth.forgotPassword.email')}
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                fullWidth
                size="large"
                sx={{ 
                  mt: 2, 
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {t('auth.forgotPassword.buttonText')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <Typography variant="h6" gutterBottom>
          {t('auth.resetPassword.title')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          {t('auth.resetPassword.description')}
        </Typography>
        <form onSubmit={handleResetPassword}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('auth.resetPassword.token')}
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('auth.resetPassword.newPassword')}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                variant="outlined"
                helperText={t('auth.resetPassword.passwordRequirements')}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                fullWidth
                size="large"
                sx={{ 
                  mt: 2, 
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {t('auth.resetPassword.buttonText')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </TabPanel>
    </Container>
  );
};

export default AuthTestPage; 