import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../contexts/AccessibilityContext';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { largeText } = useAccessibility();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{
          ...(largeText && { fontSize: '3rem' }),
        }}
      >
        404
      </Typography>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          mb: 2,
          ...(largeText && { fontSize: '2rem' }),
        }}
      >
        {t('notFound.title')}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          ...(largeText && { fontSize: '1.2rem' }),
        }}
      >
        {t('notFound.message')}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{
          ...(largeText && { fontSize: '1.2rem' }),
        }}
      >
        {t('notFound.backToHome')}
      </Button>
    </Box>
  );
};

export default NotFound; 