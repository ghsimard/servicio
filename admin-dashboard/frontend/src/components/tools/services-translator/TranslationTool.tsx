import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TranslationProgress from './TranslationProgress';
import TranslationResults from './TranslationResults';
import {
  TranslationJob,
  translateExistingServices,
} from '../../../services/tools/translationService';

export default function TranslationTool() {
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<TranslationJob | null>(null);

  const handleTranslateExisting = async () => {
    try {
      setLoading(true);
      const newJob = await translateExistingServices();
      setJob(newJob);
    } catch (error) {
      console.error('Failed to translate existing services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Services Translation Tool
      </Typography>
      <Typography variant="body1" paragraph>
        This tool helps you automatically translate existing service names into French from the main database.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AutorenewIcon />}
              onClick={handleTranslateExisting}
              disabled={loading}
            >
              Translate Existing Services
            </Button>
          </Box>
        </CardContent>
      </Card>

      {job && (
        <>
          <TranslationProgress job={job} />
          <TranslationResults job={job} />
        </>
      )}
    </Box>
  );
} 