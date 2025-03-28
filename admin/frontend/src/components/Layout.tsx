import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  CssBaseline,
  ListItemButton,
  Avatar,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalOffer as ServiceIcon,
  Event as BookingIcon,
  Star as ReviewIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  AccessibilityNew as AccessibilityIcon,
  Translate as TranslateIcon,
  History as HistoryIcon,
  BarChart as AnalyticsIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Language as LanguageIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = React.useState(false);
  const { logout, user } = useAuth();
  const { highContrast, toggleHighContrast, largeText, toggleLargeText } = useAccessibility();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAccessibilityToggle = () => {
    setAccessibilityOpen(!accessibilityOpen);
  };

  const handleLanguageChange = () => {
    const currentLang = i18n.language;
    let newLang;
    switch (currentLang) {
      case 'en':
        newLang = 'es';
        break;
      case 'es':
        newLang = 'fr';
        break;
      case 'fr':
        newLang = 'en';
        break;
      default:
        newLang = 'en';
    }
    i18n.changeLanguage(newLang);
  };

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'en':
        return 'English';
      case 'es':
        return 'Español';
      case 'fr':
        return 'Français';
      default:
        return 'English';
    }
  };

  const menuItems = [
    { text: t('dashboard.title'), icon: <DashboardIcon />, path: '/' },
    { text: t('users.title'), icon: <PeopleIcon />, path: '/users' },
    { text: t('services.title'), icon: <ServiceIcon />, path: '/services' },
    { text: t('bookings.title'), icon: <BookingIcon />, path: '/bookings' },
    { text: t('reviews.title'), icon: <ReviewIcon />, path: '/reviews' },
    { text: t('payments.title'), icon: <PaymentIcon />, path: '/payments' },
    { text: t('logs.title'), icon: <HistoryIcon />, path: '/logs' },
    { text: t('analytics.title'), icon: <AnalyticsIcon />, path: '/analytics' },
    { text: t('settings.title'), icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: highContrast ? '#ffffff' : 'inherit'
    }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: [1],
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Servicio Admin
        </Typography>
        {isTablet && (
          <IconButton onClick={handleDrawerToggle} color="inherit">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List component="nav" sx={{ flexGrow: 1, overflow: 'auto', pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            disablePadding
            sx={{ 
              display: 'block',
              backgroundColor: location.pathname === item.path ? 
                (highContrast ? '#000' : theme.palette.action.selected) : 
                'transparent',
              '&:hover': {
                backgroundColor: highContrast ? 
                  '#444' : 
                  theme.palette.action.hover,
              }
            }}
          >
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isTablet) setMobileOpen(false);
              }}
              sx={{
                minHeight: 48,
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                  color: location.pathname === item.path ? 
                    (highContrast ? '#fff' : theme.palette.primary.main) : 
                    'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: largeText ? '1.1rem' : '0.9rem',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  color: location.pathname === item.path && highContrast ? '#fff' : 'inherit' 
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleAccessibilityToggle}>
            <ListItemIcon>
              <AccessibilityIcon />
            </ListItemIcon>
            <ListItemText primary={t('accessibility.title')} />
            {accessibilityOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={accessibilityOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={toggleHighContrast}>
              <ListItemText 
                primary={t('accessibility.highContrast')} 
                primaryTypographyProps={{ fontSize: largeText ? '1rem' : '0.85rem' }}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={toggleLargeText}>
              <ListItemText 
                primary={t('accessibility.largeText')} 
                primaryTypographyProps={{ fontSize: largeText ? '1rem' : '0.85rem' }}
              />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLanguageChange}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary={getLanguageName(i18n.language)} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t('auth.logout')} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
          {user?.firstname?.charAt(0) || 'A'}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {user?.firstname} {user?.lastname}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: highContrast ? '0 4px 0 0 #000' : undefined,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Servicio Admin'}
          </Typography>
          <Tooltip title={t('accessibility.largeText')}>
            <IconButton color="inherit" onClick={toggleLargeText} size="small" sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>A</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title={t('accessibility.highContrast')}>
            <IconButton color="inherit" onClick={toggleHighContrast} size="small" sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
              <AccessibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: '80%',
              maxWidth: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: highContrast ? '2px solid black' : undefined,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: '56px', sm: '64px' },
          backgroundColor: highContrast ? '#f5f5f5' : undefined,
          overflow: 'auto',
          height: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 