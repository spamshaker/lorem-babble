import React from 'react';
import {Redirect, Route, RouteComponentProps, RouteProps} from 'react-router-dom';
import {AuthContext} from './client';

type InternalRouteProps = {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
} & RouteProps;

const InternalRoute = ({component: Component, ...routeProps}: InternalRouteProps): JSX.Element => {
  return (
    <AuthContext.Consumer>
      {({user}) => {
        return (
          <Route
            {...routeProps}
            render={(props: RouteComponentProps) => (user ? <Component {...props} /> : <Redirect to="/login" />)}
          />
        );
      }}
    </AuthContext.Consumer>
  );
};

export default InternalRoute;
