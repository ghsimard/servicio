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
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

// Generate colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#58D68D', '#F4D03F'];

const AdminAnalytics = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.get('/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analyticsData) {
    return <Alert severity="info">No analytics data available</Alert>;
  }

  // Prepare chart data
  const pageViewsData = analyticsData.pageViewsByPath.map((item: any) => ({
    name: item.page_visited || 'Unknown',
    views: item._count,
  }));

  const actionTypeData = analyticsData.actionTypeCount.map((item: any) => ({
    name: item.action_type || 'Unknown',
    value: item._count,
  }));

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {t('analytics.title', 'Admin Analytics Dashboard')}
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={t('analytics.overview', 'Overview')} />
        <Tab label={t('analytics.userActivity', 'User Activity')} />
        <Tab label={t('analytics.recentActions', 'Recent Actions')} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('analytics.pageViews', 'Page Views')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pageViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('analytics.actionTypes', 'Action Types')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={actionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {actionTypeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('analytics.mostActiveUsers', 'Most Active Users')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('analytics.username', 'Username')}</TableCell>
                      <TableCell>{t('analytics.email', 'Email')}</TableCell>
                      <TableCell align="right">{t('analytics.actions', 'Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.userActivity.map((user: any) => (
                      <TableRow key={user.userId}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="right">{user.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('analytics.recentActivity', 'Recent Activity')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('analytics.user', 'User')}</TableCell>
                      <TableCell>{t('analytics.action', 'Action')}</TableCell>
                      <TableCell>{t('analytics.page', 'Page')}</TableCell>
                      <TableCell>{t('analytics.timestamp', 'Timestamp')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.recentActivity.map((activity: any) => (
                      <TableRow key={activity.analytics_id}>
                        <TableCell>{activity.users?.username || 'Unknown'}</TableCell>
                        <TableCell>{activity.action_type}</TableCell>
                        <TableCell>{activity.page_visited}</TableCell>
                        <TableCell>
                          {activity.timestamp
                            ? format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm:ss')
                            : 'Unknown'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default AdminAnalytics; 