import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { FieldConfiguration } from './FieldConfiguration';
import UserFieldVisibilityManager from './UserFieldVisibilityManager';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Field Definitions" />
          <Tab label="User Field Visibilities" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <FieldConfiguration />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <UserFieldVisibilityManager />
      </TabPanel>
    </Box>
  );
};

export default AdminPage; 