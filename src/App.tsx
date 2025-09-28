import { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { CurrencyConverter } from './components/CurrencyConverter';
import {
  createSkipLink,
  announceToScreenReader,
  prefersReducedMotion,
} from './utils/accessibility';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }

  html {
    scroll-behavior: ${prefersReducedMotion() ? 'auto' : 'smooth'};
  }

  #root {
    min-height: 100vh;
  }

  button {
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }

  a {
    color: #007bff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Skip to content link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #007bff;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 1000;
  }

  .skip-link:focus {
    top: 0;
  }

  /* Focus styles for better accessibility */
  *:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    body {
      color: #000;
      background-color: #fff;
    }

    a {
      color: #0000ee;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Main = styled.main`
  min-height: calc(100vh - 80px);
`;

const Footer = styled.footer`
  background-color: #343a40;
  color: #fff;
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const FooterLink = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function App() {
  useEffect(() => {
    // Announce app load to screen readers
    announceToScreenReader('Currency converter application loaded');

    // Add skip link for accessibility
    const skipLink = createSkipLink('main-content');
    document.body.insertBefore(skipLink, document.body.firstChild);

    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
    };
  }, []);

  return (
    <AppContainer>
      <GlobalStyle />
      <Main id="main-content" role="main" tabIndex={-1}>
        <CurrencyConverter />
      </Main>
      <Footer role="contentinfo">
        <FooterContent>
          <FooterText>
            Currency Converter powered by Czech National Bank exchange rates
          </FooterText>
          <FooterText>
            Data provided by{' '}
            <FooterLink
              href="https://www.cnb.cz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Czech National Bank website (opens in new tab)"
            >
              Czech National Bank
            </FooterLink>
          </FooterText>
        </FooterContent>
      </Footer>
    </AppContainer>
  );
}

export default App;
