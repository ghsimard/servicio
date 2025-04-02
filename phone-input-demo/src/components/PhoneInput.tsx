import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Menu,
  MenuItem,
  styled,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface PhoneNumber {
  id: string;
  type: string;
  number: string;
  countryCode: string;
  extension: string;
  error?: string;
}

const phoneTypes = [
  'iPhone',
  'mobile',
  'home',
  'work',
  'main',
  'home fax',
  'work fax',
  'pager',
  'other'
];

const StyledInput = styled('input')({
  border: 'none',
  outline: 'none',
  padding: '8px',
  fontSize: '16px',
  width: '100%',
  '&::placeholder': {
    color: '#999',
  },
});

const CountryCodeInput = styled(StyledInput)({
  width: '60px',
  textAlign: 'right',
  '&::placeholder': {
    textAlign: 'right',
  },
});

const ExtensionInput = styled(StyledInput)({
  width: '80px',
});

const TypeButton = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  minWidth: '100px',
  fontSize: '16px',
  '&:hover': {
    opacity: 0.8,
  },
}));

const validatePhoneNumber = (number: string): string | undefined => {
  const digits = number.replace(/\D/g, '');
  if (digits.length !== 10) {
    return 'Phone number must be 10 digits';
  }
  const areaCode = digits.substring(0, 3);
  if (areaCode[0] === '0' || areaCode[0] === '1') {
    return 'Area code cannot start with 0 or 1';
  }
  return undefined;
};

export const PhoneInput: React.FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { id: '1', type: 'iPhone', number: '', countryCode: '+1', extension: '' }
  ]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string>('');
  const [customTypeValue, setCustomTypeValue] = useState('');
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);

  const handleDeletePhone = (id: string) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter(phone => phone.id !== id));
    }
  };

  const handleTypeClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedPhoneId(id);
  };

  const handleTypeSelect = (newType: string) => {
    if (newType === 'custom') {
      setCustomTypeValue('');
      setIsCustomDialogOpen(true);
      setMenuAnchorEl(null);
      return;
    }
    
    setPhoneNumbers(phoneNumbers.map(phone => 
      phone.id === selectedPhoneId ? { ...phone, type: newType } : phone
    ));
    setMenuAnchorEl(null);
  };

  const handleCustomTypeSubmit = () => {
    if (customTypeValue.trim()) {
      setPhoneNumbers(phoneNumbers.map(phone => 
        phone.id === selectedPhoneId ? { ...phone, type: customTypeValue.trim() } : phone
      ));
      setIsCustomDialogOpen(false);
      setCustomTypeValue('');
    }
  };

  const handleCountryCodeChange = (id: string, value: string) => {
    const sanitizedValue = value.replace(/[^\d+]/g, '');
    if (sanitizedValue.includes('+') && !sanitizedValue.startsWith('+')) {
      return;
    }
    setPhoneNumbers(phoneNumbers.map(phone => 
      phone.id === id ? { ...phone, countryCode: sanitizedValue } : phone
    ));
  };

  const handleExtensionChange = (id: string, value: string) => {
    const sanitizedValue = value.replace(/\D/g, '');
    setPhoneNumbers(phoneNumbers.map(phone => 
      phone.id === id ? { ...phone, extension: sanitizedValue } : phone
    ));
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value;
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handleNumberChange = (id: string, newNumber: string) => {
    // Get the actual input value
    const inputValue = newNumber;
    
    // If it's just digits, use them directly
    if (/^\d+$/.test(inputValue)) {
      setPhoneNumbers(phoneNumbers.map(phone => 
        phone.id === id ? { ...phone, number: inputValue } : phone
      ));

      // Add new field if it's the last one and we have our first digit
      const lastPhone = phoneNumbers[phoneNumbers.length - 1];
      if (id === lastPhone.id && inputValue.length === 1) {
        setPhoneNumbers(prev => [...prev, { 
          id: Date.now().toString(), 
          type: 'mobile', 
          number: '',
          countryCode: '+1',
          extension: ''
        }]);
      }
      return;
    }

    // For inputs with formatting characters, handle formatting
    const digits = inputValue.replace(/\D/g, '');
    if (digits.length > 0) {
      const formattedNumber = formatPhoneNumber(digits);
      const error = validatePhoneNumber(digits);
      
      setPhoneNumbers(phoneNumbers.map(phone => 
        phone.id === id ? { ...phone, number: formattedNumber, error } : phone
      ));
    } else {
      setPhoneNumbers(phoneNumbers.map(phone => 
        phone.id === id ? { ...phone, number: '', error: undefined } : phone
      ));
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      {phoneNumbers.map((phone) => (
        <Box 
          key={phone.id} 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: '40px 120px 80px 1fr 100px',
            alignItems: 'center', 
            gap: 2, 
            py: 1,
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Box sx={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
            {phoneNumbers.length > 1 && phone.number.length > 0 && (
              <IconButton 
                onClick={() => handleDeletePhone(phone.id)}
                sx={{ 
                  color: '#ff3b30',
                  p: 0.5,
                }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
          <TypeButton onClick={(e) => handleTypeClick(e, phone.id)}>
            {phone.type}
            <KeyboardArrowDownIcon sx={{ ml: 0.5, fontSize: 20 }} />
          </TypeButton>
          <CountryCodeInput
            placeholder="+1"
            value={phone.countryCode}
            onChange={(e) => handleCountryCodeChange(phone.id, e.target.value)}
          />
          <StyledInput
            placeholder="Phone"
            value={phone.number}
            onChange={(e) => handleNumberChange(phone.id, e.target.value)}
          />
          <ExtensionInput
            placeholder="ext."
            value={phone.extension}
            onChange={(e) => handleExtensionChange(phone.id, e.target.value)}
          />
        </Box>
      ))}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        {phoneTypes.map((type) => (
          <MenuItem 
            key={type} 
            onClick={() => handleTypeSelect(type)}
            sx={{ minWidth: 150 }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem 
          onClick={() => handleTypeSelect('custom')}
          sx={{ minWidth: 150 }}
        >
          Custom...
        </MenuItem>
      </Menu>

      <Dialog 
        open={isCustomDialogOpen} 
        onClose={() => setIsCustomDialogOpen(false)}
        PaperProps={{
          sx: { minWidth: '300px' }
        }}
      >
        <DialogTitle>Which type would you like?</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={customTypeValue}
            onChange={(e) => setCustomTypeValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCustomTypeSubmit();
              }
            }}
            placeholder="Enter type..."
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCustomDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCustomTypeSubmit} variant="contained" color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 