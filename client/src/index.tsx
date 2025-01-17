import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export function init(element: HTMLElement) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    element
  );
}

// 為正常的React使用添加這個
if (document.getElementById('root')) {
  init(document.getElementById('root')!);
}

