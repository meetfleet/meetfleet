/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0033FF';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: 'rgba(0, 0, 0, 0.3)',
    tabIconSelected: tintColorLight,
    primary: '#0033FF',
    secondary: '#FF6B00',
    success: '#00CC66',
    warning: '#FFB800',
    error: '#FF3B30',
    card: '#FFFFFF',
    border: '#E5E5E5',
    shadow: 'rgba(0, 0, 0, 0.1)',
    navbarBackground: '#F4F7FB',
    navbarInactive: 'rgba(0, 0, 0, 0.3)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#0033FF',
    secondary: '#FF6B00',
    success: '#00CC66',
    warning: '#FFB800',
    error: '#FF3B30',
    card: '#1C1C1E',
    border: '#2C2C2E',
    shadow: 'rgba(0, 0, 0, 0.3)',
    navbarBackground: '#1C1C1E',
    navbarInactive: '#9BA1A6',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});