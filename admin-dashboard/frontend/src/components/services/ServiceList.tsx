import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Paper,
  Collapse,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Service, ServiceError, getAllServices, deleteService } from '../../services/serviceManagement';

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<ServiceError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllServices();
      console.log('Loaded services:', data); // Debug log
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error); // Debug log
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to load services. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      setServices(services.filter(service => service.id !== id));
      setDeleteError(null);
    } catch (error) {
      console.error('Error deleting service:', error); // Debug log
      if ((error as ServiceError).details) {
        setDeleteError(error as ServiceError);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to delete service. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Services Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Collapse in={!!deleteError} sx={{ mb: 2 }}>
        {deleteError && (
          <Alert severity="error">
            <Typography variant="subtitle1" gutterBottom>
              {deleteError.message}
            </Typography>
            {deleteError.details && (
              <Box>
                <Typography variant="body2">
                  Service: {deleteError.details.serviceName}
                </Typography>
                <Typography variant="body2">
                  Number of translations: {deleteError.details.translationCount}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Existing translations:
                </Typography>
                <ul>
                  {deleteError.details.translations.map((translation, index) => (
                    <li key={index}>
                      {translation.language}: {translation.translatedName}
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Alert>
        )}
      </Collapse>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Translations</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No services found
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        {service.translations.map((translation) => (
                          <Typography key={translation.id} variant="body2">
                            {translation.language}: {translation.translatedName}
                          </Typography>
                        ))}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleDelete(service.id)}
                          color="error"
                          aria-label="delete service"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
} 