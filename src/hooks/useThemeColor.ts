import { useTheme } from '../context/ThemeContext';

export function useThemeColor() {
  const { colors, isDark } = useTheme();
  return { colors, isDark };
}
