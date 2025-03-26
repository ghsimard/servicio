import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Payments: React.FC = () => {
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
        {t('payments.title')}
      </Typography>
      <Typography>
        {t('payments.comingSoon')}
      </Typography>
    </Box>
  );
};

export default Payments; 