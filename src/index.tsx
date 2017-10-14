import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as WebFontLoader from 'webfontloader';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render(
  <Router><App /></Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
