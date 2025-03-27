import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { logout } = useAuth();
  const { highContrast, toggleHighContrast, largeText, toggleLargeText } = useAccessibility();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
    { text: t('settings.title'), icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Servicio Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={toggleHighContrast}>
          <ListItemIcon>
            <AccessibilityIcon />
          </ListItemIcon>
          <ListItemText primary={t('accessibility.highContrast')} />
        </ListItem>
        <ListItem button onClick={toggleLargeText}>
          <ListItemIcon>
            <AccessibilityIcon />
          </ListItemIcon>
          <ListItemText primary={t('accessibility.largeText')} />
        </ListItem>
        <ListItem button onClick={handleLanguageChange}>
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <ListItemText primary={getLanguageName(i18n.language)} />
        </ListItem>
        <ListItem button onClick={logout}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('auth.logout')} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
          <Typography variant="h6" noWrap component="div">
            Servicio Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
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
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 