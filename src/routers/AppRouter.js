import React from 'react';
import { Router, Switch, Redirect } from 'react-router-dom';
import * as createHistory from "history";
// import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
// import AdminRoute from './AdminRoute';

// import BasePage from '../components/BasePage';
import BasicBase from '../components/BasicBase';
import HostPage from '../components/HostPage';
import AboutPage from '../components/AboutPage';

export const history = createHistory.createBrowserHistory();
// export const history = createHistory();

// <Route component={NotFoundPage} />
const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/base" component={BasicBase} exact={true} />
        <PublicRoute path="/host" component={HostPage} exact={true} />
        <PublicRoute path="/about" component={AboutPage} exact={true} />
        <Redirect  from="/" to="/base" component={BasicBase} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
