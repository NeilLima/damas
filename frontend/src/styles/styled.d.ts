import 'styled-components';
import type { Theme } from '@/context/theme/ThemeContext';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    backgroundColor: string;
    textColor: string;
    primaryColor: string;
    secondaryColor: string;
    gradientDirection: string;
    boxShadow: string;
    boxShadowHover: string;
    borderRadius: string;
  }
}
