import { ThemeProvider } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Container, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import theme from './theme';
import SearchBar from './components/SearchBar';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          width: '100vw',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden'
        }}
      >
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            width: '100%'
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'flex-end' }}>
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
            >
              {t('app.title')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LanguageSwitcher />
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {t('common.login')}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Spacer for fixed AppBar */}
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
              sx={{
                width: '100%',
                maxWidth: 1400,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'translateY(-10%)'
              }}
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
              >
                SERVICIO
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
              >
                {t('app.subtitle')}
              </Typography>
              <Box sx={{ width: '100%' }}>
                <SearchBar />
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
