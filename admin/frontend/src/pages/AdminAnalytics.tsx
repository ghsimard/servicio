import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import SourceBreakdown from '../components/analytics/SourceBreakdown';
import SessionsTable from '../components/analytics/SessionsTable';
import PageViewsChart from '../components/analytics/PageViewsChart';
import { useAccessibility } from '../contexts/AccessibilityContext';

// Generate colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [sessions, setSessions] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { highContrast, largeText } = useAccessibility();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Function to extract source from user agent
  const getSourceFromUserAgent = (userAgent: string) => {
    if (!userAgent) return 'unknown';
    const sourceMatch = userAgent.match(/\[source:([^\]]+)\]/);
    return sourceMatch ? sourceMatch[1] : 'unknown';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch active sessions
        const sessionsResponse = await axios.get('http://localhost:3002/api/sessions');
        setSessions(sessionsResponse.data);

        // Fetch analytics data
        const analyticsResponse = await axios.get('http://localhost:3002/api/analytics');
        setAnalyticsData(analyticsResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Prepare data for action type pie chart
  const actionTypeData = analyticsData.actionCounts
    ? Object.entries(analyticsData.actionCounts).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column',
          p: 3 
        }}
      >
        <CircularProgress size={isMobile ? 40 : 60} thickness={4} />
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            ...(largeText && { fontSize: { xs: '1.2rem', sm: '1.4rem' } })
          }}
        >
          {t('analytics.loading', 'Loading analytics data...')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          mb: { xs: 2, sm: 3 },
          ...(largeText && { fontSize: { xs: '1.8rem', sm: '2.3rem', md: '2.5rem' } }),
        }}
      >
        {t('analytics.title', 'Analytics Dashboard')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 2, sm: 3 } }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          scrollButtons={isMobile ? "auto" : undefined}
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              ...(largeText && { fontSize: { xs: '0.9rem', sm: '1rem' } }),
              minWidth: { xs: 'auto', sm: 100 }
            }
          }}
        >
          <Tab 
            label={t('analytics.overview', 'Overview')} 
            id="analytics-tab-0"
            aria-controls="analytics-tabpanel-0"
          />
          <Tab 
            label={t('analytics.sessions', 'User Sessions')} 
            id="analytics-tab-1"
            aria-controls="analytics-tabpanel-1"
          />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={8} lg={9}>
                {!analyticsData.topPages ? (
                  <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
                ) : (
                  <PageViewsChart pageData={analyticsData.topPages} />
                )}
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <Paper 
                  sx={{ 
                    p: { xs: 1.5, sm: 2, md: 3 }, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    ...(highContrast && {
                      border: '2px solid black',
                      backgroundColor: '#ffffff',
                    }),
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      ...(largeText && { fontSize: { xs: '1.25rem', sm: '1.4rem' } })
                    }}
                  >
                    {t('analytics.actionTypes', 'Action Types')}
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!actionTypeData.length ? (
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                        {t('analytics.noData', 'No action data available')}
                      </Typography>
                    ) : (
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={actionTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={isMobile ? 60 : 70}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => 
                              isMobile ? 
                                `${percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ''}` : 
                                `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {actionTypeData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} actions`, 'Count']} />
                          <Legend 
                            layout={isMobile ? "horizontal" : "vertical"}
                            verticalAlign={isMobile ? "bottom" : "middle"}
                            align={isMobile ? "center" : "right"}
                            wrapperStyle={isMobile ? { fontSize: '0.7rem' } : { fontSize: '0.8rem' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={6}>
                {!analyticsData.sourceCounts ? (
                  <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 1 }} />
                ) : (
                  <SourceBreakdown sourceData={analyticsData.sourceCounts} />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: { xs: 1.5, sm: 2, md: 3 }, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    ...(highContrast && {
                      border: '2px solid black',
                      backgroundColor: '#ffffff',
                    }),
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      ...(largeText && { fontSize: { xs: '1.25rem', sm: '1.4rem' } })
                    }}
                  >
                    {t('analytics.activeSessions', 'Active Sessions Overview')}
                  </Typography>
                  <Box 
                    display="flex" 
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="space-around" 
                    alignItems="center" 
                    sx={{ 
                      flexGrow: 1, 
                      py: 2,
                      gap: isMobile ? 2 : 0
                    }}
                  >
                    <Box textAlign="center">
                      <Typography 
                        variant="h4"
                        sx={{
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                          ...(largeText && { fontSize: { xs: '1.8rem', sm: '2.3rem' } }),
                        }}
                      >
                        {sessions.filter(s => s.is_active).length}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          ...(largeText && { fontSize: { xs: '0.875rem', sm: '1rem' } }),
                        }}
                      >
                        {t('analytics.activeSessions', 'Active Sessions')}
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography 
                        variant="h4"
                        sx={{
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                          ...(largeText && { fontSize: { xs: '1.8rem', sm: '2.3rem' } }),
                        }}
                      >
                        {sessions.filter(s => s.is_active && getSourceFromUserAgent(s.user_agent) === 'main-app').length}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          ...(largeText && { fontSize: { xs: '0.875rem', sm: '1rem' } }),
                        }}
                      >
                        {t('analytics.mainApp', 'Main App')}
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography 
                        variant="h4"
                        sx={{
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                          ...(largeText && { fontSize: { xs: '1.8rem', sm: '2.3rem' } }),
                        }}
                      >
                        {sessions.filter(s => s.is_active && getSourceFromUserAgent(s.user_agent) === 'admin-app').length}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          ...(largeText && { fontSize: { xs: '0.875rem', sm: '1rem' } }),
                        }}
                      >
                        {t('analytics.adminApp', 'Admin App')}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          <Paper
            sx={{ 
              p: { xs: 1, sm: 2, md: 3 },
              ...(highContrast && {
                border: '2px solid black',
                backgroundColor: '#ffffff',
              }),
            }}
          >
            {loading ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  p: 3 
                }}
              >
                <CircularProgress size={40} />
              </Box>
            ) : sessions.length === 0 ? (
              <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                {t('analytics.noSessions', 'No active sessions found')}
              </Typography>
            ) : (
              <TableContainer sx={{ overflowX: 'auto' }}>
                <SessionsTable sessions={sessions} title={t('analytics.activeSessions', 'Active Sessions')} />
              </TableContainer>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AdminAnalytics; 