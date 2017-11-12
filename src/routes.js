import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import CreateEvent from './events/create';
import ViewEvent from './events/view';

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={CreateEvent} />
      <Route exact path="/event/:id/:token?" component={ViewEvent} />
    </div>
  </Router>
)

export default Routes
