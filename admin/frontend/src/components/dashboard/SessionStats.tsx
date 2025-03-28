import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../../contexts/AccessibilityContext';

// Generate colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SessionStats: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { highContrast, largeText } = useAccessibility();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/sessions/stats');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching session stats:', err);
        setError('Failed to load session statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {error}
      </Typography>
    );
  }

  if (!data) {
    return (
      <Typography sx={{ p: 2 }}>
        {t('sessions.noData', 'No session data available')}
      </Typography>
    );
  }

  // Prepare data for device type pie chart
  const deviceData = data?.deviceStats?.length 
    ? data.deviceStats.map((item: any) => ({
        name: item.device_type || 'unknown',
        value: item.count,
      }))
    : [{ name: 'No Data', value: 1 }];

  // Prepare data for browser bar chart
  const browserData = data?.browserStats?.length 
    ? data.browserStats.map((item: any) => ({
        name: item.browser || 'unknown',
        count: item.count,
      }))
    : [{ name: 'No Data', count: 0 }];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography 
            variant="subtitle1" 
            gutterBottom
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'medium',
              textAlign: 'center',
              ...(largeText && { fontSize: { xs: '1rem', sm: '1.1rem' } }),
            }}
          >
            {t('sessions.deviceTypes', 'Device Types')}
          </Typography>
          <Box 
            sx={{ 
              height: { xs: 200, sm: 220 },
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    isMobile ? 
                      `${percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ''}` : 
                      `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} sessions`, 'Count']} />
                <Legend
                  layout={isMobile ? "horizontal" : "vertical"}
                  verticalAlign={isMobile ? "bottom" : "middle"}
                  align={isMobile ? "center" : "right"}
                  wrapperStyle={isMobile ? { fontSize: '0.7rem', paddingTop: '10px' } : { fontSize: '0.8rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography 
            variant="subtitle1" 
            gutterBottom
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'medium',
              textAlign: 'center',
              ...(largeText && { fontSize: { xs: '1rem', sm: '1.1rem' } }),
            }}
          >
            {t('sessions.browsers', 'Browsers')}
          </Typography>
          <Box 
            sx={{ 
              height: { xs: 200, sm: 220 },
              width: '100%'
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={browserData}
                layout={isMobile ? "vertical" : "horizontal"}
                margin={{
                  top: 5,
                  right: 30,
                  left: isMobile ? 60 : 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {isMobile ? (
                  <>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 10 }} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                  </>
                )}
                <Tooltip formatter={(value) => [`${value} sessions`, 'Count']} />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Bar dataKey="count" name="Sessions" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box 
            sx={{ 
              mt: 1, 
              p: { xs: 1, sm: 2 },
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6"
                sx={{
                  fontSize: { xs: '1.2rem', sm: '1.4rem' },
                  ...(largeText && { fontSize: { xs: '1.4rem', sm: '1.6rem' } }),
                }}
              >
                {data?.totalSessions ?? 0}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  ...(largeText && { fontSize: { xs: '0.875rem', sm: '1rem' } }),
                }}
              >
                {t('sessions.total', 'Total Sessions')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.2rem', sm: '1.4rem' },
                  ...(largeText && { fontSize: { xs: '1.4rem', sm: '1.6rem' } }),
                }}
              >
                {data?.activeSessions ?? 0}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  ...(largeText && { fontSize: { xs: '0.875rem', sm: '1rem' } }),
                }}
              >
                {t('sessions.active', 'Active Sessions')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.2rem', sm: '1.4rem' },
                  ...(largeText && { fontSize: { xs: '1.4rem', sm: '1.6rem' } }),
                }}
              >
                {data?.avgSessionTime ? Math.round(data.avgSessionTime / 60) : 0}m
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  ...(largeText && { fontSize: { xs: '0.875rem', sm: '1rem' } }),
                }}
              >
                {t('sessions.avgTime', 'Avg. Session Time')}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionStats; 