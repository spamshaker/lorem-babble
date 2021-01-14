import React, {useContext, useEffect} from 'react';
import {Redirect, Route, RouteComponentProps, RouteProps} from 'react-router-dom';

type InternalRouteProps = {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  isAuthenticated: boolean;
} & RouteProps;

const InternalRoute = ({component: Component, isAuthenticated, ...routeProps}: InternalRouteProps): JSX.Element => {
  console.log(isAuthenticated);
  return (
    <Route
      {...routeProps}
      render={(props: RouteComponentProps) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default InternalRoute;
