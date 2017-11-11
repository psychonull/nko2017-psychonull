import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import App from './App';
import Events from './events/CreateEventComponent';

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route exact path="/events" component={Events} />
    </div>
  </Router>
)

export default Routes
