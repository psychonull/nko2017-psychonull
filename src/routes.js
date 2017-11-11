import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import CreateEvent from './events/create';

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={CreateEvent} />
    </div>
  </Router>
)

export default Routes
