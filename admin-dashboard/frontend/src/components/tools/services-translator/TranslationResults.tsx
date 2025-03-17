import { Card, CardContent, Typography, Alert, AlertTitle } from '@mui/material';
import { TranslationJob } from '../../../services/tools/translationService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface TranslationResultsProps {
  job: TranslationJob;
}

export default function TranslationResults({ job }: TranslationResultsProps) {
  if (job.status !== 'completed' && job.status !== 'error') {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Translation Results
        </Typography>

        {job.status === 'completed' && job.errors.length === 0 && (
          <Alert
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 2 }}
          >
            <AlertTitle>Success</AlertTitle>
            All services have been successfully translated!
          </Alert>
        )}

        {job.errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>
              {job.status === 'completed'
                ? 'Completed with Errors'
                : 'Translation Failed'}
            </AlertTitle>
            <Typography component="div">
              The following errors occurred:
              <ul>
                {job.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 