import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Global styles
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #111317;
    color: #ffffff;
    overflow-x: hidden;
  }

  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Navbar hover effects */
  .nav-link-hover::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 0;
    left: 0;
    bottom: 0;
    background-color: #f9ac54;
    transition: 0.3s;
  }

  .nav-link-hover:hover::after {
    width: 50%;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(249, 172, 84, 0.5);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(249, 172, 84, 0.8);
  }

  ::-webkit-scrollbar-track {
    background-color: #1f2125;
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
