import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAccessibility } from '../contexts/AccessibilityContext';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { announceMessage } = useAccessibility();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (languageCode: string, label: string) => {
    i18n.changeLanguage(languageCode);
    handleClose();
    announceMessage(t('language.changed', { language: label }));
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language)?.label || 'English';

  return (
    <>
      <Button
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<LanguageIcon aria-hidden="true" />}
        endIcon={<KeyboardArrowDownIcon aria-hidden="true" />}
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {currentLanguage}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
          role: 'listbox',
        }}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 1,
            minWidth: 120
          }
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language.code, language.label)}
            selected={i18n.language === language.code}
            role="option"
            aria-selected={i18n.language === language.code}
            sx={{
              py: 1,
              px: 2
            }}
          >
            {language.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
} 