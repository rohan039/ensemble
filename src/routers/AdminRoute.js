import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
// import Header from '../components/Header';

export const AdminRoute = ({
  isAuthenticated,
  isAdmin,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => (
      isAuthenticated ? (
        isAdmin ? (<div>
          
          <Component {...props} />
        </div>) : (
          <Redirect to="/base" />
        )
        
      ) : (
        <Redirect to="/base" />
      )
    )} />
  );

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.uid,
  isAdmin: !!state.auth.isAdmin
});

export default connect(mapStateToProps)(AdminRoute);
