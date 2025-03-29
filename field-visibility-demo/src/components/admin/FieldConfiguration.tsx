import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useVisibility } from '../../context/VisibilityContext';

interface User {
  id: string;
  email: string;
  name: string;
}

interface FieldDefinition {
  id: string;
  entityType: string;
  fieldName: string;
  displayName: string;
  defaultVisibility: {
    isVisible: boolean;
    availableToUser: boolean;
    helperSwitchable: boolean;
    required: boolean;
  };
}

interface UserFieldVisibility {
  id: string;
  userId: string;
  fieldDefId: string;
  visibilityRules: {
    isVisible: boolean;
    availableToUser: boolean;
    helperSwitchable: boolean;
    required: boolean;
  };
}

export const FieldConfiguration: React.FC = () => {
  const { triggerUpdate } = useVisibility();
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [visibilities, setVisibilities] = useState<UserFieldVisibility[]>([]);
  const [selectedField, setSelectedField] = useState<FieldDefinition | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, string[]>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applyToAll, setApplyToAll] = useState<Record<string, boolean>>({});
  const [allFieldsAvailable, setAllFieldsAvailable] = useState(false);
  const [allFieldsHelperToggle, setAllFieldsHelperToggle] = useState(false);
  const [allFieldsEnabled, setAllFieldsEnabled] = useState(false);

  useEffect(() => {
    fetchFields();
    fetchUsers();
  }, []);

  const fetchFields = async () => {
    try {
      console.log('Fetching fields...');
      const response = await fetch('/api/field-definitions');
      if (!response.ok) throw new Error('Failed to fetch field definitions');
      const data = await response.json();
      console.log('Fields data:', data);
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      console.log('Users data:', data);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchVisibilities = async () => {
    try {
      const response = await fetch('/api/user/field-visibilities');
      if (!response.ok) throw new Error('Failed to fetch field visibilities');
      const data = await response.json();
      setVisibilities(data);
    } catch (err) {
      console.error('Error fetching field visibilities:', err);
    }
  };

  const handleVisibilityUpdate = async (fieldId: string, field: FieldDefinition, key: keyof typeof field.defaultVisibility) => {
    try {
      const updatedVisibility = {
        ...field.defaultVisibility,
        [key]: !field.defaultVisibility[key],
      };

      // Get selected user IDs for this field
      const selectedUserIds = selectedUsers[fieldId] || [];

      // Update the field definition
      const response = await fetch(`/api/field-definitions/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: field.displayName,
          defaultVisibility: updatedVisibility,
          selectedUserIds, // Send selected user IDs to the backend
          changedKey: key, // Send the key that was changed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update field visibility');
      }

      // Update local state
      setFields(fields.map(f =>
        f.id === fieldId
          ? {
              ...f,
              defaultVisibility: updatedVisibility,
            }
          : f
      ));

      // After successful update, trigger a refresh
      triggerUpdate();
    } catch (error) {
      console.error('Error updating field visibility:', error);
      setError('Failed to update visibility settings');
    }
  };

  const handleFieldClick = (field: FieldDefinition) => {
    setSelectedField(field);
    setDialogOpen(true);
  };

  const handleUserToggle = (userId: string) => {
    if (!selectedField) return;
    
    setSelectedUsers(prev => ({
      ...prev,
      [selectedField.id]: prev[selectedField.id]?.includes(userId)
        ? prev[selectedField.id].filter(id => id !== userId)
        : [...(prev[selectedField.id] || []), userId]
    }));
  };

  const handleApplyToAllToggle = (fieldId: string) => {
    const newApplyToAllState = !applyToAll[fieldId];
    setApplyToAll(prev => ({
      ...prev,
      [fieldId]: newApplyToAllState
    }));

    // If "Apply to All" is checked, select all users
    if (newApplyToAllState) {
      setSelectedUsers(prev => ({
        ...prev,
        [fieldId]: users.map(u => u.id)
      }));
    } else {
      // If unchecked, clear the selection
      setSelectedUsers(prev => ({
        ...prev,
        [fieldId]: []
      }));
    }
  };

  const handleUserVisibilityUpdate = async (userId: string, fieldId: string, visibilityRules: any) => {
    try {
      const response = await fetch(`/api/user/field-visibilities/${userId}/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visibilityRules }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visibility');
      }

      // After successful update, trigger a refresh
      triggerUpdate();
    } catch (error) {
      console.error('Error updating visibility:', error);
      setError('Failed to update visibility settings');
    }
  };

  const handleUpdateVisibility = async () => {
    if (!selectedField) return;
    
    try {
      // If "Apply to All" is checked, use all user IDs
      const selectedUserIds = applyToAll[selectedField.id] 
        ? users.map(u => u.id)
        : selectedUsers[selectedField.id] || [];
      
      // If no users are selected and "Apply to All" is not checked, show an error
      if (selectedUserIds.length === 0) {
        setError('Please select at least one user or apply to all users');
        return;
      }

      // Update the field definition and visibility for selected users
      const response = await fetch(`/api/field-definitions/${selectedField.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: selectedField.displayName,
          defaultVisibility: {
            required: false,
            isVisible: false,
            availableToUser: false,
            helperSwitchable: false
          },
          selectedUserIds,
          changedKey: 'isVisible',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update field visibility');
      }

      // After successful update, trigger a refresh
      triggerUpdate();
      setDialogOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error updating visibility:', error);
      setError('Failed to update visibility settings');
    }
  };

  const getFieldVisibility = (fieldId: string, userId: string) => {
    return visibilities.find(
      v => v.fieldDefId === fieldId && v.userId === userId
    );
  };

  const getSelectedUsersCount = (fieldId: string) => {
    return selectedUsers[fieldId]?.length || 0;
  };

  const handleDisplayNameChange = (fieldId: string, newValue: string) => {
    setFields(fields.map(f =>
      f.id === fieldId
        ? { ...f, displayName: newValue }
        : f
    ));
  };

  const handleSetAllFields = async (enabled: boolean) => {
    try {
      // Update all fields to have the specified visibility settings
      await Promise.all(fields.map(field => 
        fetch(`/api/field-definitions/${field.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            displayName: field.displayName,
            defaultVisibility: {
              required: enabled,
              isVisible: enabled,
              availableToUser: enabled,
              helperSwitchable: enabled
            },
            selectedUserIds: users.map(u => u.id),
            changedKey: 'isVisible',
          }),
        })
      ));

      // Update local state
      setAllFieldsEnabled(enabled);
      setAllFieldsAvailable(enabled);
      setAllFieldsHelperToggle(enabled);
      
      // Refresh the fields
      fetchFields();
      triggerUpdate();
      setError(null);
    } catch (error) {
      console.error('Error updating all fields:', error);
      setError('Failed to update all fields');
    }
  };

  const handleSetAllFieldsAvailable = async (available: boolean) => {
    try {
      // Update all fields to have the specified availability
      await Promise.all(fields.map(field => 
        fetch(`/api/field-definitions/${field.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            displayName: field.displayName,
            defaultVisibility: {
              ...field.defaultVisibility,
              availableToUser: available
            },
            selectedUserIds: users.map(u => u.id),
            changedKey: 'availableToUser',
          }),
        })
      ));

      // Update local state
      setAllFieldsAvailable(available);
      fetchFields();
      triggerUpdate();
      setError(null);
    } catch (error) {
      console.error('Error updating all fields:', error);
      setError('Failed to update all fields');
    }
  };

  const handleSetAllFieldsHelperToggle = async (helperToggle: boolean) => {
    try {
      // Update all fields to have the specified helper toggle setting
      await Promise.all(fields.map(field => 
        fetch(`/api/field-definitions/${field.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            displayName: field.displayName,
            defaultVisibility: {
              ...field.defaultVisibility,
              helperSwitchable: helperToggle
            },
            selectedUserIds: users.map(u => u.id),
            changedKey: 'helperSwitchable',
          }),
        })
      ));

      // Update local state
      setAllFieldsHelperToggle(helperToggle);
      fetchFields();
      triggerUpdate();
      setError(null);
    } catch (error) {
      console.error('Error updating all fields:', error);
      setError('Failed to update all fields');
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Typography variant="h5" gutterBottom>
        Field Configuration
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={allFieldsAvailable}
              onChange={(e) => handleSetAllFieldsAvailable(e.target.checked)}
            />
          }
          label="Set All Available to User"
        />
        <FormControlLabel
          control={
            <Switch
              checked={allFieldsHelperToggle}
              onChange={(e) => handleSetAllFieldsHelperToggle(e.target.checked)}
            />
          }
          label="Set All Helper Can Toggle"
        />
        <FormControlLabel
          control={
            <Switch
              checked={allFieldsEnabled}
              onChange={(e) => handleSetAllFields(e.target.checked)}
            />
          }
          label="Set All Fields"
        />
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        minHeight: 0,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        }
      }}>
        {fields.map((field) => (
          <Card key={field.id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Display Name"
                value={field.displayName || ''}
                onChange={(e) => handleDisplayNameChange(field.id, e.target.value)}
                sx={{ mr: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={applyToAll[field.id] || false}
                      onChange={() => handleApplyToAllToggle(field.id)}
                    />
                  }
                  label="Apply to All Users"
                />
                <Button
                  variant="contained"
                  onClick={() => handleFieldClick(field)}
                >
                  Configure Users ({getSelectedUsersCount(field.id)})
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={field.defaultVisibility?.availableToUser === true}
                    onChange={() => handleVisibilityUpdate(field.id, field, 'availableToUser')}
                  />
                }
                label="Available to User"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={field.defaultVisibility?.helperSwitchable === true}
                    onChange={() => handleVisibilityUpdate(field.id, field, 'helperSwitchable')}
                  />
                }
                label="Helper Can Toggle"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={field.defaultVisibility?.required === true}
                    onChange={() => handleVisibilityUpdate(field.id, field, 'required')}
                  />
                }
                label="Required"
              />
            </Box>
          </Card>
        ))}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configure Visibility for {selectedField?.displayName}
        </DialogTitle>
        <DialogContent>
          <List>
            {users.map((user) => {
              const visibility = getFieldVisibility(selectedField?.id || '', user.id);
              const isSelected = selectedField?.id ? selectedUsers[selectedField.id]?.includes(user.id) : false;
              return (
                <ListItem
                  key={user.id}
                  button
                  onClick={() => handleUserToggle(user.id)}
                  disabled={applyToAll[selectedField?.id || '']}
                >
                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                  />
                  <Checkbox
                    edge="end"
                    checked={isSelected}
                    disabled={applyToAll[selectedField?.id || '']}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateVisibility} 
            variant="contained"
            disabled={!applyToAll[selectedField?.id || ''] && !selectedUsers[selectedField?.id || '']?.length}
          >
            Update Visibility
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}; 