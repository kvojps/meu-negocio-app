import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './styles.css';
import './theme.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import { App } from './App';

const storedTheme = localStorage.getItem('meu-negocio-theme');
const initialTheme =
  storedTheme === 'dark' ||
  (storedTheme !== 'light' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light';
document.documentElement.setAttribute('data-theme', initialTheme);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
