import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  Translate,
  Dashboard as DashboardIcon,
  Build as BuildIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const adminTools = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: DashboardIcon,
    path: '/',
    description: 'Admin Dashboard Overview'
  },
  {
    id: 'services',
    name: 'Services Management',
    icon: BuildIcon,
    path: '/services',
    description: 'Manage service listings and translations'
  },
  {
    id: 'translator',
    name: 'Services Translator',
    icon: Translate,
    path: '/tools/translator',
    description: 'Translate service names to multiple languages'
  },
  // Add more tools here as needed
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, backgroundColor: 'primary.main' }}>
        <Typography variant="h6" color="white" noWrap>
          Admin Tools
        </Typography>
      </Box>
      <Divider />
      <List>
        {adminTools.map((tool) => (
          <ListItem key={tool.id} disablePadding>
            <ListItemButton
              component={Link}
              to={tool.path}
              selected={location.pathname === tool.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <tool.icon />
              </ListItemIcon>
              <ListItemText 
                primary={tool.name}
                secondary={tool.description}
                secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
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
    </Box>
  );
} 