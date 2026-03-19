import React from 'react';
import { View, Text, ViewProps, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'primary';
}

export function ThemedView({ style, variant = 'default', ...props }: ThemedViewProps) {
  const { colors } = useTheme();

  const backgroundColor = {
    default: colors.background,
    surface: colors.surface,
    primary: colors.primaryLight,
  }[variant];

  return (
    <View
      style={[{ backgroundColor }, style]}
      {...props}
    />
  );
}

interface ThemedTextProps extends TextProps {
  variant?: 'default' | 'secondary' | 'primary' | 'title' | 'subtitle';
}

export function ThemedText({ style, variant = 'default', ...props }: ThemedTextProps) {
  const { colors } = useTheme();

  const color = {
    default: colors.text,
    secondary: colors.textSecondary,
    primary: colors.primary,
    title: colors.text,
    subtitle: colors.textSecondary,
  }[variant];

  const fontSize = {
    default: 16,
    secondary: 14,
    primary: 16,
    title: 24,
    subtitle: 18,
  }[variant];

  const fontWeight = {
    default: '400',
    secondary: '400',
    primary: '600',
    title: '700',
    subtitle: '600',
  }[variant] as '400' | '600' | '700';

  return (
    <Text
      style={[{ color, fontSize, fontWeight }, style]}
      {...props}
    />
  );
}

export function Card({ children, style, ...props }: ViewProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  style,
  ...props
}: ViewProps & { onPress?: () => void; variant?: 'primary' | 'secondary' | 'outline' }) {
  const { colors } = useTheme();

  const backgroundColor = {
    primary: colors.primary,
    secondary: colors.surface,
    outline: 'transparent',
  }[variant];

  const borderColor = {
    primary: colors.primary,
    secondary: colors.border,
    outline: colors.primary,
  }[variant];

  const textColor = {
    primary: '#FFFFFF',
    secondary: colors.text,
    outline: colors.primary,
  }[variant];

  return (
    <View
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 2 : 1,
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
