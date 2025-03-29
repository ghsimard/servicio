import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Switch,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useVisibility } from '../../context/VisibilityContext';

interface FieldDefinition {
  id: string;
  entityType: string;
  fieldName: string;
  displayName: string;
  fieldType: string;
  defaultVisibility: {
    isVisible: boolean;
    availableToUser: boolean;
    helperSwitchable: boolean;
    required: boolean;
  };
}

interface FieldVisibility {
  id: string;
  fieldName: string;
  displayName: string;
  isVisible: boolean;
  helperSwitchable: boolean;
  category: string;
  fieldType: string;
  value?: string;
  entityType: string;
  availableToUser: boolean;
  required: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
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

export const VisibilityManager: React.FC = () => {
  const { updateTrigger } = useVisibility();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, Record<string, string>>>({});
  const [visibilities, setVisibilities] = useState<UserFieldVisibility[]>([]);
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchFields();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchVisibilities();
    }
  }, [selectedUser, updateTrigger]);

  const fetchFields = async () => {
    try {
      const response = await fetch('/api/field-definitions');
      if (!response.ok) throw new Error('Failed to fetch field definitions');
      const data = await response.json();
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setError('Failed to fetch field definitions');
    }
  };

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    }
  };

  // Function to fetch field visibilities for a specific user
  const fetchVisibilities = async () => {
    try {
      const response = await fetch(`/api/user/field-visibilities/${selectedUser}`);
      if (!response.ok) {
        throw new Error('Failed to fetch visibilities');
      }
      const data = await response.json();
      setVisibilities(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching visibilities:', error);
      setError('Failed to load visibility settings');
    }
  };

  // Handler for updating a field's visibility
  const handleVisibilityUpdate = async (userId: string, fieldId: string, currentVisibility: boolean) => {
    try {
      console.log('Updating visibility for field:', fieldId, 'Current visibility:', currentVisibility);
      
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
        throw new Error('Failed to update visibility');
      }

      const updatedVisibility = await response.json();
      console.log('Updated visibility:', updatedVisibility);

      setVisibilities(prev => prev.map(v =>
        v.id === fieldId
          ? updatedVisibility
          : v
      ));
      setError(null);
    } catch (error) {
      console.error('Error updating visibility:', error);
      setError('Failed to update visibility setting');
    }
  };

  // Handler for updating field values
  const handleFieldValueChange = (userId: string, fieldId: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [fieldId]: value
      }
    }));
  };

  // Group fields by their category for display in accordions
  const getGroupedVisibilities = (userId: string) => {
    const grouped: Record<string, FieldVisibility[]> = {};
    
    // Get all field definitions
    fields.forEach(field => {
      const visibility = visibilities.find(v => v.fieldDefId === field.id && v.userId === userId);
      
      // Create a field visibility object
      const fieldVisibility: FieldVisibility = {
        id: field.id,
        fieldName: field.fieldName,
        displayName: field.displayName,
        isVisible: visibility?.visibilityRules.isVisible ?? field.defaultVisibility.isVisible,
        helperSwitchable: visibility?.visibilityRules.helperSwitchable ?? field.defaultVisibility.helperSwitchable,
        availableToUser: visibility?.visibilityRules.availableToUser ?? field.defaultVisibility.availableToUser,
        required: visibility?.visibilityRules.required ?? field.defaultVisibility.required,
        category: field.entityType,
        fieldType: field.fieldType,
        entityType: field.entityType
      };

      // Only add fields that are visible and available to user
      if (fieldVisibility.isVisible && fieldVisibility.availableToUser) {
        if (!grouped[field.entityType]) {
          grouped[field.entityType] = [];
        }
        grouped[field.entityType].push(fieldVisibility);
      }
    });

    return grouped;
  };

  // Render input field based on field type
  const renderField = (field: FieldVisibility, userId: string) => {
    const value = fieldValues[userId]?.[field.id] || '';
    
    // If the field is not visible, don't show it
    if (!field.isVisible) {
      return null;
    }

    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
        {field.helperSwitchable && (
          <FormControlLabel
            control={
              <Switch
                checked={field.isVisible}
                onChange={() => handleVisibilityUpdate(userId, field.id, field.isVisible)}
              />
            }
            label={
              <Typography variant="subtitle1">
                {field.displayName}
              </Typography>
            }
          />
        )}
        {!field.helperSwitchable && (
          <Typography variant="subtitle1" sx={{ flex: 1 }}>
            {field.displayName}
          </Typography>
        )}
        <TextField
          fullWidth
          value={value}
          onChange={(e) => handleFieldValueChange(userId, field.id, e.target.value)}
          type={field.fieldType === 'date' ? 'date' : field.fieldType === 'number' ? 'number' : 'text'}
          disabled={!field.isVisible}
          InputLabelProps={field.fieldType === 'date' ? { shrink: true } : undefined}
          sx={{ flex: 1 }}
        />
      </Box>
    );
  };

  // Define a consistent order for categories
  const categoryOrder = [
    'Basic Information',
    'Professional Information',
    'Additional Information',
    'Skills',
    'user_profile'
  ];

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select User</InputLabel>
        <Select
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value as string)}
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
        <Box>
          {categoryOrder.map((category) => {
            const fields = getGroupedVisibilities(selectedUser)[category] || [];
            if (fields.length === 0) return null;
            
            return (
              <Accordion key={category}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {fields.map((field) => (
                      <Grid item xs={12} key={field.id}>
                        {renderField(field, selectedUser)}
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
}; 