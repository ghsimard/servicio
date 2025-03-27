import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { highContrast, largeText } = useAccessibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          mx: 2,
          ...(highContrast && {
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'primary.main',
          }),
          ...(largeText && {
            '& .MuiTypography-root': {
              fontSize: '1.2rem',
            },
            '& .MuiTextField-root': {
              '& input': {
                fontSize: '1.2rem',
              },
            },
          }),
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Servicio Admin
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              disabled={loading}
            />
            <TextField
              fullWidth
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              disabled={loading}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('auth.login')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 