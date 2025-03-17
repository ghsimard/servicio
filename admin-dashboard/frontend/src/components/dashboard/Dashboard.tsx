import { Box, Typography, Paper, Grid } from '@mui/material';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to the Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Services Translation Tool
            </Typography>
            <Typography>
              Use our translation tool to automatically translate service names
              into multiple languages. This helps maintain consistency across
              different language versions of the platform.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Typography>
              • Total Services: Coming soon
            </Typography>
            <Typography>
              • Languages Supported: French, Spanish
            </Typography>
            <Typography>
              • Last Translation: Coming soon
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 