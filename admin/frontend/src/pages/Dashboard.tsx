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
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalOffer as ServiceIcon,
  Event as BookingIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
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
      icon: <PeopleIcon />,
      color: '#1976d2',
      path: '/users',
    },
    {
      title: t('services.title'),
      value: stats?.totalServices || 0,
      icon: <ServiceIcon />,
      color: '#2e7d32',
      path: '/services',
    },
    {
      title: t('bookings.title'),
      value: stats?.totalBookings || 0,
      icon: <BookingIcon />,
      color: '#ed6c02',
      path: '/bookings',
    },
    {
      title: t('payments.title'),
      value: `$${stats?.totalRevenue.toFixed(2) || '0.00'}`,
      icon: <PaymentIcon />,
      color: '#9c27b0',
      path: '/payments',
    },
  ];

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
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
          ...(largeText && { fontSize: '2rem' }),
        }}
      >
        {t('dashboard.title')}
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
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
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      backgroundColor: `${card.color}20`,
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      ...(largeText && { fontSize: '1.2rem' }),
                    }}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    color: card.color,
                    ...(largeText && { fontSize: '2rem' }),
                  }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            ...(largeText && { fontSize: '1.8rem' }),
          }}
        >
          {t('dashboard.recentActivity')}
        </Typography>
        <Card
          sx={{
            ...(highContrast && {
              border: '2px solid black',
              backgroundColor: '#ffffff',
            }),
          }}
        >
          <List>
            {isLoadingActivity ? (
              <ListItem>
                <ListItemText primary={t('common.loading')} />
              </ListItem>
            ) : recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      <BookingIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={new Date(activity.timestamp).toLocaleString()}
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
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard; 