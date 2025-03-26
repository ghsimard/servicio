import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Alert,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';

interface User {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  preferred_language: string;
  createdAt: string;
  updatedAt: string;
  user_roles: { role: string }[];
}

interface UserFormData {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  preferred_language?: string;
  password?: string;
  roles: string[];
}

const Users: React.FC = () => {
  const { t } = useTranslation();
  const { highContrast, largeText } = useAccessibility();
  const { isAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstname: '',
    lastname: '',
    username: '',
    preferred_language: '',
    roles: [],
  });

  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      const response = await axios.get('http://localhost:3003/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      const response = await axios.post('http://localhost:3003/users', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
      showSnackbar(t('users.createSuccess'), 'success');
    },
    onError: () => {
      showSnackbar(t('users.createError'), 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserFormData }) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      const response = await axios.patch(`http://localhost:3003/users/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
      showSnackbar(t('users.updateSuccess'), 'success');
    },
    onError: () => {
      showSnackbar(t('users.updateError'), 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      await axios.delete(`http://localhost:3003/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSnackbar(t('users.deleteSuccess'), 'success');
    },
    onError: () => {
      showSnackbar(t('users.deleteError'), 'error');
    },
  });

  const handleOpen = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        preferred_language: user.preferred_language,
        roles: user.user_roles.map(ur => ur.role),
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        preferred_language: '',
        roles: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setFormData({
      email: '',
      firstname: '',
      lastname: '',
      username: '',
      preferred_language: '',
      roles: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await updateMutation.mutateAsync({
        id: editingUser.userId,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('common.confirmDelete'))) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            ...(largeText && { fontSize: '2rem' }),
          }}
        >
          {t('users.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            ...(largeText && { fontSize: '1.2rem' }),
          }}
        >
          {t('users.create')}
        </Button>
      </Box>

      {isLoading ? (
        <Typography>{t('common.loading')}</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            ...(highContrast && {
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main',
            }),
            ...(largeText && {
              '& .MuiTableCell-root': {
                fontSize: '1.2rem',
              },
            }),
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('users.firstName')}</TableCell>
                <TableCell>{t('users.lastName')}</TableCell>
                <TableCell>{t('users.email')}</TableCell>
                <TableCell>{t('users.preferredLanguage')}</TableCell>
                <TableCell>{t('users.roles')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={`user-row-${user.userId}`}>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.preferred_language}</TableCell>
                  <TableCell>
                    {user.user_roles.map((ur, index) => (
                      <Typography
                        key={`role-${index}`}
                        component="span"
                        sx={{
                          display: 'inline-block',
                          mr: 1,
                          mb: 0.5,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          fontSize: '0.875rem',
                        }}
                      >
                        {t(`users.roles.${ur.role}`)}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpen(user)}
                      aria-label={t('common.edit')}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user.userId)}
                      aria-label={t('common.delete')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          ...(largeText && {
            '& .MuiDialogTitle-root': {
              fontSize: '1.5rem',
            },
            '& .MuiDialogContent-root': {
              fontSize: '1.2rem',
            },
          }),
        }}
      >
        <DialogTitle>
          {editingUser ? t('users.edit') : t('users.create')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label={t('users.email')}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              margin="normal"
              required
              disabled={!!editingUser}
            />
            <TextField
              fullWidth
              label={t('users.firstName')}
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('users.lastName')}
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('users.username')}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('users.preferredLanguage')}
              value={formData.preferred_language}
              onChange={(e) =>
                setFormData({ ...formData, preferred_language: e.target.value })
              }
              margin="normal"
            />
            <FormControl component="fieldset" margin="normal">
              <Typography component="legend">{t('users.roles')}</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.roles.includes('admin')}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.roles, 'admin']
                          : formData.roles.filter(role => role !== 'admin');
                        setFormData({ ...formData, roles: newRoles });
                      }}
                    />
                  }
                  label={t('users.roles.admin')}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.roles.includes('moderator')}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.roles, 'moderator']
                          : formData.roles.filter(role => role !== 'moderator');
                        setFormData({ ...formData, roles: newRoles });
                      }}
                    />
                  }
                  label={t('users.roles.moderator')}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.roles.includes('helper')}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.roles, 'helper']
                          : formData.roles.filter(role => role !== 'helper');
                        setFormData({ ...formData, roles: newRoles });
                      }}
                    />
                  }
                  label={t('users.roles.helper')}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.roles.includes('needer')}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.roles, 'needer']
                          : formData.roles.filter(role => role !== 'needer');
                        setFormData({ ...formData, roles: newRoles });
                      }}
                    />
                  }
                  label={t('users.roles.needer')}
                />
              </FormGroup>
            </FormControl>
            {!editingUser && (
              <TextField
                fullWidth
                label={t('auth.password')}
                type="password"
                value={formData.password || ''}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                margin="normal"
                required={!editingUser}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingUser ? t('common.save') : t('common.create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Users; 