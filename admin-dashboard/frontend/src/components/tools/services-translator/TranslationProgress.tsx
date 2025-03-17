import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material';
import { TranslationJob } from '../../../services/tools/translationService';

interface TranslationProgressProps {
  job: TranslationJob;
}

export default function TranslationProgress({ job }: TranslationProgressProps) {
  const progress = job.totalServices > 0
    ? (job.completedServices / job.totalServices) * 100
    : 0;

  const getStatusColor = () => {
    switch (job.status) {
      case 'error':
        return 'error.main';
      case 'completed':
        return 'success.main';
      default:
        return 'primary.main';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Translation Progress
        </Typography>
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={job.status === 'error' ? 'error' : 'primary'}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>
            {job.completedServices} of {job.totalServices} services translated
          </Typography>
          <Typography sx={{ color: getStatusColor() }}>
            Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
} 