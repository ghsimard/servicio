import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Tooltip
} from '@mui/material';
import { format } from 'date-fns';
import DeviceIcon from '@mui/icons-material/Devices';
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';

interface UserSession {
  session_id: string;
  user_id: string;
  login_time: string;
  logout_time?: string;
  device_type: string;
  browser: string;
  os: string;
  is_active: boolean;
  duration?: number;
  user_agent: string;
}

interface SessionsTableProps {
  sessions: UserSession[];
  title?: string;
}

const SessionsTable: React.FC<SessionsTableProps> = ({ 
  sessions, 
  title = "User Sessions" 
}) => {
  // Extract source from user_agent if available
  const getSourceFromUserAgent = (userAgent: string): string => {
    if (!userAgent) return 'unknown';
    
    const sourceMatch = userAgent.match(/\[source:([^\]]+)\]/);
    if (sourceMatch && sourceMatch[1]) {
      return sourceMatch[1];
    }
    
    // Apply heuristics based on user agent content
    if (userAgent.includes('Admin')) {
      return 'admin-app';
    } else if (userAgent.includes('Mozilla') || userAgent.includes('Chrome')) {
      return 'main-app';
    }
    
    return 'unknown';
  };

  // Get appropriate device icon
  const getDeviceIcon = (deviceType: string) => {
    switch(deviceType.toLowerCase()) {
      case 'desktop':
        return <ComputerIcon />;
      case 'mobile':
        return <PhoneAndroidIcon />;
      case 'tablet':
        return <TabletIcon />;
      default:
        return <DeviceIcon />;
    }
  };

  // Format duration in a human-readable way
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Device</TableCell>
              <TableCell>Browser / OS</TableCell>
              <TableCell>Login Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No session data available
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => {
                const source = getSourceFromUserAgent(session.user_agent);
                return (
                  <TableRow key={session.session_id}>
                    <TableCell>
                      <Tooltip title={session.device_type}>
                        <Box display="flex" alignItems="center">
                          {getDeviceIcon(session.device_type)}
                          <Box ml={1}>{session.device_type}</Box>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{session.browser}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {session.os}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(session.login_time), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>{formatDuration(session.duration)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={session.is_active ? 'Active' : 'Ended'} 
                        color={session.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={source}
                        color={
                          source === 'admin-app' 
                            ? 'secondary' 
                            : source === 'main-app' 
                              ? 'primary' 
                              : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SessionsTable; 