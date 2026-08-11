import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle<{ $bg?: string; $color?: string }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: ${({ $bg }) => $bg || '#0f0f23'};
    color: ${({ $color }) => $color || '#ffffff'};
    min-height: 100vh;
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyles;