import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './theme.css'
import Routes from './routes';

const render = Component => ReactDOM.render(<Component />, document.getElementById('root'));

render(Routes);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const NextApp = require('./routes').default;
    render(NextApp);
  });
}
