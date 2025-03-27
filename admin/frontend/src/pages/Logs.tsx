import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Log {
  log_id: string;
  table_name: string;
  action: 'insert' | 'update' | 'delete';
  record_id: string;
  details: any;
  operation_details: any;
  timestamp: string;
  users?: {
    username: string;
    email: string;
    user_roles: {
      role: string;
    }[];
  };
}

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
      id={`logs-tabpanel-${index}`}
      aria-labelledby={`logs-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Logs: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3003/logs');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteAllLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3003/logs/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting logs:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'insert':
        return 'success';
      case 'update':
        return 'warning';
      case 'delete':
        return 'error';
      default:
        return 'default';
    }
  };

  const uniqueTables = Array.from(new Set(logs.map((log) => log.table_name)));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('logs.title')}
        </Typography>
        <Box>
          <Tooltip title={t('logs.refresh')}>
            <span>
              <IconButton onClick={fetchLogs} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('logs.filter')}>
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('logs.deleteAll')}>
            <span>
              <IconButton 
                color="error" 
                onClick={() => setDeleteDialogOpen(true)}
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="logs tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={t('logs.all')} />
          {uniqueTables.map((table) => (
            <Tab key={table} label={table} />
          ))}
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('logs.timestamp')}</TableCell>
                  <TableCell>{t('logs.table')}</TableCell>
                  <TableCell>{t('logs.action')}</TableCell>
                  <TableCell>{t('logs.user')}</TableCell>
                  <TableCell>{t('logs.role')}</TableCell>
                  <TableCell>{t('logs.details')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.log_id}>
                    <TableCell>
                      {format(new Date(log.timestamp), 'PPpp')}
                    </TableCell>
                    <TableCell>{log.table_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={getActionColor(log.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {log.users?.username || log.users?.email || 'System'}
                    </TableCell>
                    <TableCell>
                      {log.users?.user_roles?.[0]?.role || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <pre style={{ maxHeight: '100px', overflow: 'auto' }}>
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {uniqueTables.map((table, index) => (
          <TabPanel key={table} value={tabValue} index={index + 1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('logs.timestamp')}</TableCell>
                    <TableCell>{t('logs.action')}</TableCell>
                    <TableCell>{t('logs.user')}</TableCell>
                    <TableCell>{t('logs.role')}</TableCell>
                    <TableCell>{t('logs.details')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs
                    .filter((log) => log.table_name === table)
                    .map((log) => (
                      <TableRow key={log.log_id}>
                        <TableCell>
                          {format(new Date(log.timestamp), 'PPpp')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.action}
                            color={getActionColor(log.action)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {log.users?.username || log.users?.email || 'System'}
                        </TableCell>
                        <TableCell>
                          {log.users?.user_roles?.[0]?.role || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <pre style={{ maxHeight: '100px', overflow: 'auto' }}>
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        ))}
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('logs.deleteAllConfirm')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('logs.deleteAllWarning')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteAllLogs} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Logs; 