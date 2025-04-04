import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Bookings: React.FC = () => {
  const { t } = useTranslation();
  const { largeText } = useAccessibility();

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          ...(largeText && { fontSize: '2rem' }),
        }}
      >
        {t('bookings.title')}
      </Typography>
      <Typography>
        {t('bookings.comingSoon')}
      </Typography>
    </Box>
  );
};

export default Bookings; 