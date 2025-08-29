'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle() {
  const { themeMode, toggleTheme } = useThemeStore();
  const { t } = useTranslation();

  return (
    <Tooltip title={t(themeMode === 'light' ? 'theme.toggleDark' : 'theme.toggleLight')}>
      <IconButton onClick={toggleTheme} color="inherit">
        {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}