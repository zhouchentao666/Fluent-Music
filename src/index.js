import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-windows-ui/config/app-config.css';
import 'react-windows-ui/dist/react-windows-ui.min.css';
import 'react-windows-ui/icons/winui-icons.min.css';

// 添加全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', message, source, lineno, colno, error);
};

window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

console.log('Starting FluentMusic app...');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    console.log('React root created');
    root.render(<App />);
    console.log('App rendered');
  } catch (error) {
    console.error('Error rendering app:', error);
  }
}
