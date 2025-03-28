import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  useMediaQuery,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalOffer as ServiceIcon,
  Event as BookingIcon,
  Payment as PaymentIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import SessionStats from '../components/dashboard/SessionStats';

interface DashboardStats {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  userGrowth?: number;
  serviceGrowth?: number;
  bookingGrowth?: number;
  revenueGrowth?: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { highContrast, largeText } = useAccessibility();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      const response = await axios.get('http://localhost:3003/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery<RecentActivity[]>({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      const response = await axios.get('http://localhost:3003/dashboard/recent-activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const statCards = [
    {
      title: t('users.title'),
      value: stats?.totalUsers || 0,
      growth: stats?.userGrowth || 0,
      icon: <PeopleIcon />,
      color: '#1976d2',
      path: '/users',
    },
    {
      title: t('services.title'),
      value: stats?.totalServices || 0,
      growth: stats?.serviceGrowth || 0,
      icon: <ServiceIcon />,
      color: '#2e7d32',
      path: '/services',
    },
    {
      title: t('bookings.title'),
      value: stats?.totalBookings || 0,
      growth: stats?.bookingGrowth || 0,
      icon: <BookingIcon />,
      color: '#ed6c02',
      path: '/bookings',
    },
    {
      title: t('payments.title'),
      value: `$${stats?.totalRevenue.toFixed(2) || '0.00'}`,
      growth: stats?.revenueGrowth || 0,
      icon: <PaymentIcon />,
      color: '#9c27b0',
      path: '/payments',
    },
  ];

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          {t('common.pleaseLogin')}
        </Typography>
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
        {t('dashboard.title')}
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {isLoadingStats ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
            </Grid>
          ))
        ) : (
          statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                onClick={() => navigate(card.path)}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  },
                  ...(highContrast && {
                    border: '2px solid black',
                    backgroundColor: '#ffffff',
                  }),
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: `${card.color}20`,
                        borderRadius: '50%',
                        p: { xs: 0.75, sm: 1 },
                        mr: { xs: 1, sm: 2 },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {React.cloneElement(card.icon, { 
                        sx: { fontSize: { xs: '1.25rem', sm: '1.5rem' } } 
                      })}
                    </Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                        ...(largeText && { fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.4rem' } }),
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="baseline">
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        color: card.color,
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        ...(largeText && { fontSize: { xs: '1.7rem', sm: '2rem', md: '2.25rem' } }),
                      }}
                    >
                      {card.value}
                    </Typography>
                    {card.growth !== 0 && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          color: card.growth > 0 ? 'success.main' : 'error.main' 
                        }}
                      >
                        {card.growth > 0 ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                        <Typography variant="body2" component="span">
                          {Math.abs(card.growth)}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 1, sm: 2 } }}>
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2, md: 3 },
              height: '100%',
              ...(highContrast && {
                border: '2px solid black',
                backgroundColor: '#ffffff',
              }),
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                ...(largeText && { fontSize: { xs: '1.5rem', sm: '1.8rem' } }),
              }}
            >
              {t('dashboard.recentActivity')}
            </Typography>
            <List sx={{ 
              p: 0,
              '& .MuiListItem-root': {
                px: { xs: 1, sm: 2 },
                py: { xs: 1, sm: 1.5 }
              }
            }}>
              {isLoadingActivity ? (
                Array.from(new Array(5)).map((_, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                      <Box sx={{ width: '100%' }}>
                        <Skeleton variant="text" height={24} width="80%" />
                        <Skeleton variant="text" height={16} width="40%" />
                      </Box>
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))
              ) : recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: { xs: 36, sm: 40 } }}>
                        <Box
                          sx={{
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: '50%',
                            p: 0.5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <BookingIcon 
                            fontSize="small" 
                            sx={{ color: theme.palette.primary.contrastText }}
                          />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography 
                            sx={{ 
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              ...(largeText && { fontSize: { xs: '1rem', sm: '1.1rem' } })
                            }}
                          >
                            {activity.description}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              ...(largeText && { fontSize: { xs: '0.875rem', sm: '1rem' } })
                            }}
                          >
                            {new Date(activity.timestamp).toLocaleString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary={t('dashboard.noRecentActivity')} />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5} lg={4}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2, md: 3 },
              height: '100%',
              ...(highContrast && {
                border: '2px solid black',
                backgroundColor: '#ffffff',
              }),
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                ...(largeText && { fontSize: { xs: '1.5rem', sm: '1.8rem' } }),
              }}
            >
              {t('dashboard.sessionStats')}
            </Typography>
            <SessionStats />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 