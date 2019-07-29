import React from 'react';
import { Router, Switch, Redirect } from 'react-router-dom';
import * as createHistory from "history";
// import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
// import AdminRoute from './AdminRoute';

import BasePage from '../components/BasePage';;

export const history = createHistory.createBrowserHistory();
// export const history = createHistory();

// <Route component={NotFoundPage} />
const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        
        <PublicRoute path="/base" component={BasePage} exact={true} />
        <Redirect  from="/" to="/base" component={BasePage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
