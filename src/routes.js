import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import CreateEvent from './events/create';
import ViewEvent from './events/view';
import NotFound from './layouts/NotFound';

const Routes = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={CreateEvent} />
        <Route exact path="/events/:id/:token?" component={ViewEvent} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
)

export default Routes
