import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';

interface User {
  id: string;
  email: string;
  name: string;
}

interface FieldDefinition {
  id: string;
  fieldName: string;
  displayName: string;
  entityType: string;
  visibilityRules: {
    required: boolean;
    adminControlled: boolean;
    helperSwitchable: boolean;
    isVisible: boolean;
  };
}

interface UserFieldVisibility {
  id: string;
  userId: string;
  fieldDefId: string;
  visibilityRules: {
    required: boolean;
    adminControlled: boolean;
    helperSwitchable: boolean;
    isVisible: boolean;
  };
  fieldDefinition: FieldDefinition;
}

const UserFieldVisibilityManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [fieldVisibilities, setFieldVisibilities] = useState<UserFieldVisibility[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserFieldVisibilities(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    }
  };

  const fetchUserFieldVisibilities = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/field-visibilities/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch field visibilities');
      const data = await response.json();
      setFieldVisibilities(data);
    } catch (err) {
      setError('Failed to fetch field visibilities');
      console.error(err);
    }
  };

  const handleVisibilityToggle = async (userId: string, fieldId: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/user/field-visibilities/${userId}/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visibilityRules: {
            isVisible: !currentVisibility,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update visibility');
      }

      setSuccess('Visibility updated successfully');
      fetchUserFieldVisibilities(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update visibility');
      console.error(err);
    }
  };

  const groupFieldsByCategory = (visibilities: UserFieldVisibility[]) => {
    return visibilities.reduce((acc, visibility) => {
      const category = visibility.fieldDefinition.entityType;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(visibility);
      return acc;
    }, {} as Record<string, UserFieldVisibility[]>);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Field Visibility Manager
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select User</InputLabel>
        <Select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          label="Select User"
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} ({user.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedUser && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Admin Controlled</TableCell>
                <TableCell>Helper Can Toggle</TableCell>
                <TableCell>Visible</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupFieldsByCategory(fieldVisibilities)).map(([category, visibilities]) => (
                <React.Fragment key={category}>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        {category}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {visibilities.map((visibility) => (
                    <TableRow key={visibility.id}>
                      <TableCell>{visibility.fieldDefinition.displayName}</TableCell>
                      <TableCell>{visibility.fieldDefinition.entityType}</TableCell>
                      <TableCell>{visibility.visibilityRules.required ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{visibility.visibilityRules.adminControlled ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{visibility.visibilityRules.helperSwitchable ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <FormControlLabel
                          label=""
                          control={
                            <Switch
                              checked={visibility.visibilityRules.isVisible}
                              onChange={() =>
                                handleVisibilityToggle(
                                  visibility.userId,
                                  visibility.fieldDefId,
                                  visibility.visibilityRules.isVisible
                                )
                              }
                              disabled={
                                visibility.visibilityRules.required ||
                                visibility.visibilityRules.adminControlled
                              }
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserFieldVisibilityManager; 