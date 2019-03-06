import React from 'react';
import ReactDOMServer from 'react-dom/server';
import OnlineStore from './OnlineStore.jsx';

ReactDOMServer.render(<OnlineStore />, document.getElementById('online-store'));