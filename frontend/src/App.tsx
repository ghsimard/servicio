import { Box, AppBar, Toolbar, Container, Typography, Button, Avatar, IconButton, Menu, MenuItem, Paper, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import theme from './theme';
import ThemeProvider from './theme/ThemeProvider';
import SearchBar from './components/SearchBar';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoggingProvider } from './contexts/LoggingContext';
import PageTrackingLayout from './components/PageTrackingLayout';
import AuthTestPage from './pages/AuthTestPage';
import AccountPage from './pages/AccountPage';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth-test?tab=1" />;
  }
  
  return children;
};

// Navigation component that changes based on auth state
const Navigation = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      // If menu is already open, close it
      setAnchorEl(null);
    } else {
      // If menu is closed, open it
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };
  
  return (
    <Box 
      component="div"
      sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
      role="group"
      aria-label={t('navigation.actions')}
    >
      <Box
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          padding: '4px',
          bgcolor: 'background.paper'
        }}
      >
        <IconButton
          size="small"
          aria-label="Menu"
          onClick={handleMenu}
          sx={{
            color: 'text.primary',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto' }} />
        {isAuthenticated ? (
          <Avatar 
            sx={{ 
              width: 30, 
              height: 30,
              bgcolor: menuOpen ? theme.palette.secondary.dark : theme.palette.secondary.main,
              fontSize: '0.875rem',
              transition: 'background-color 0.3s'
            }}
          >
            {user?.username.substring(0, 1).toUpperCase()}
          </Avatar>
        ) : (
          <IconButton
            size="small"
            aria-label="User account"
            onClick={handleMenu}
            sx={{
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <PersonOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={menuOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200
          }
        }}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
          role: 'menu'
        }}
        keepMounted
      >
        {isAuthenticated ? (
          [
            <MenuItem 
              key="account"
              component={Link} 
              to="/account" 
              onClick={handleClose}
            >
              {t('common.profile', 'Account')}
            </MenuItem>,
            <MenuItem 
              key="logout"
              onClick={handleLogout}
            >
              {t('common.logout', 'Logout')}
            </MenuItem>
          ]
        ) : (
          <Box component="div">
            <MenuItem 
              key="login"
              component={Link} 
              to="/auth-test?tab=1" 
              onClick={handleClose}
            >
              {t('common.login', 'Sign in')}
            </MenuItem>
            <MenuItem 
              key="signup"
              component={Link} 
              to="/auth-test?tab=0" 
              onClick={handleClose}
            >
              {t('common.signUp', 'Sign up')}
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem 
              key="offer-service"
              component={Link} 
              to="/offer-service"
              onClick={handleClose}
            >
              {t('common.offerService', 'Offer your service')}
            </MenuItem>
            <MenuItem 
              key="help-center"
              component={Link} 
              to="/help"
              onClick={handleClose}
            >
              {t('common.helpCenter', 'Help Center')}
            </MenuItem>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

// Footer component
const Footer = () => {
  const { t, i18n } = useTranslation();
  const { announceMessage } = useAccessibility();
  const [currencyAnchorEl, setCurrencyAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  
  const currencyOpen = Boolean(currencyAnchorEl);
  const langOpen = Boolean(langAnchorEl);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
  ];

  const handleCurrencyClick = (event: React.MouseEvent<HTMLElement>) => {
    setCurrencyAnchorEl(event.currentTarget);
  };

  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setCurrencyAnchorEl(null);
    setLangAnchorEl(null);
  };

  const handleLanguageSelect = (languageCode: string, label: string) => {
    i18n.changeLanguage(languageCode);
    handleClose();
    announceMessage(t('language.changed', { language: label }));
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language)?.label || 'English';

  return (
    <Paper 
      component="footer" 
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        zIndex: theme.zIndex.appBar - 1
      }}
    >
      <Container maxWidth="lg">
        <Box 
          component="div"
          sx={{ 
            py: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Language selector */}
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Button
              id="language-button"
              aria-controls={langOpen ? 'language-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={langOpen ? 'true' : undefined}
              onClick={handleLangClick}
              startIcon={<LanguageIcon fontSize="small" />}
              endIcon={<KeyboardArrowDownIcon fontSize="small" />}
              size="small"
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              {currentLanguage}
            </Button>
            <Menu
              id="language-menu"
              anchorEl={langAnchorEl}
              open={langOpen}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'language-button',
                role: 'listbox',
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 120
                }
              }}
              keepMounted
            >
              {languages.map((language) => (
                <MenuItem
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code, language.label)}
                  selected={i18n.language === language.code}
                  role="option"
                  aria-selected={i18n.language === language.code}
                >
                  {language.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Currency selector */}
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Button
              id="currency-button"
              aria-controls={currencyOpen ? 'currency-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={currencyOpen ? 'true' : undefined}
              onClick={handleCurrencyClick}
              startIcon={<AttachMoneyIcon fontSize="small" />}
              endIcon={<KeyboardArrowDownIcon fontSize="small" />}
              size="small"
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              CAD
            </Button>
            <Menu
              id="currency-menu"
              anchorEl={currencyAnchorEl}
              open={currencyOpen}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'currency-button',
                role: 'listbox',
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 120
                }
              }}
              keepMounted
            >
              <MenuItem onClick={handleClose}>$ CAD</MenuItem>
              <MenuItem onClick={handleClose}>$ USD</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

function AppContent() {
  const { t } = useTranslation();

  return (
    <Router>
      <Box 
        component="div"
        sx={{ 
          width: '100vw',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden'
        }}
        role="application"
        aria-label={t('app.title')}
      >
        <AppBar 
          position="fixed" 
          elevation={0}
          component="header"
          sx={{
            width: '100%'
          }}
        >
          <Toolbar 
            sx={{ px: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
            role="navigation"
            aria-label={t('navigation.main')}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                position: 'absolute',
                left: { xs: 16, sm: 32 },
                fontWeight: 600,
                letterSpacing: '-0.5px',
                color: 'white',
                display: { xs: 'block', sm: 'none' }
              }}
              role="heading"
              aria-level={1}
            >
              {t('app.title')}
            </Typography>
            <Button
              component={Link}
              to="/offer-service"
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {t('common.offerService', 'Offer your service')}
            </Button>
            <Navigation />
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Routes>
          <Route path="/auth-test" element={
            <PageTrackingLayout>
              <AuthTestPage />
            </PageTrackingLayout>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <PageTrackingLayout>
                <AccountPage />
              </PageTrackingLayout>
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <Navigate to="/account" replace />
          } />
          <Route path="/profile" element={
            <Navigate to="/account" replace />
          } />
          <Route path="/" element={
            <PageTrackingLayout>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 'calc(100vh - 64px)',
                  py: { xs: 2, sm: 3 }
                }}
                role="main"
                aria-label={t('app.mainContent')}
              >
                <Container 
                  maxWidth="lg"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: { xs: 2, sm: 4 },
                    height: '100%'
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      width: '100%',
                      maxWidth: 1400,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transform: 'translateY(-10%)'
                    }}
                    role="region"
                    aria-label={t('app.searchSection')}
                  >
                    <Typography 
                      variant="h1" 
                      component="div"
                      sx={{
                        fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem' },
                        fontWeight: 900,
                        color: theme.palette.primary.main,
                        mb: 0,
                        letterSpacing: '0.2em',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        width: '100%',
                        display: { xs: 'none', sm: 'block' }
                      }}
                      role="heading"
                      aria-level={1}
                    >
                      {t('app.title')}
                    </Typography>
                    <Typography 
                      variant="h2" 
                      component="h1"
                      sx={{
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        mb: 1.5,
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        width: '100%'
                      }}
                      role="heading"
                      aria-level={2}
                    >
                      {t('app.mainHeading')}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="p"
                      sx={{
                        color: 'text.secondary',
                        mb: 3,
                        maxWidth: '600px',
                        width: '100%',
                        mx: 'auto',
                        lineHeight: 1.4,
                        fontSize: { xs: '1rem', sm: '1.125rem' }
                      }}
                      role="contentinfo"
                    >
                      {t('app.subtitle')}
                    </Typography>
                    <Box 
                      sx={{ width: '100%' }}
                      role="search"
                      aria-label={t('search.label')}
                    >
                      <SearchBar />
                    </Box>
                  </Box>
                </Container>
              </Box>
            </PageTrackingLayout>
          } />
        </Routes>
        <Footer />
      </Box>
    </Router>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <ThemeProvider>
        <AuthProvider>
          <LoggingProvider>
            <AppContent />
          </LoggingProvider>
        </AuthProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );
}

export default App;
