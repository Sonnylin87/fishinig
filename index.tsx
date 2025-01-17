import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export function init(element: HTMLElement) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    element
  );
}

// Also add this for normal React usage
if (document.getElementById('root')) {
  init(document.getElementById('root')!);
}
