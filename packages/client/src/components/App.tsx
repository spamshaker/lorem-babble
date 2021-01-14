/* eslint-disable import/no-named-as-default */
import React, {useEffect, useState} from 'react';
import './App.scss';
import Login from './Login';
import Header from './Header';
import {AuthContext} from './AuthContext';
import {SearchContext} from './SearchContext';
import {useReducerWithMiddleware} from '@lorem-babble/utils';
import {IUser, newAuthService, newLocalUserDAO, newLocalUserService} from '@lorem-babble/services';
import {newAuthController} from '@lorem-babble/auth';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import InternalRoute from './InternalRoute';
import NotFound from './NotFound';
import PostsView from './Posts';
import PostDetails from './PostDetails';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  errorMessage: null,
  initialized: false
};

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'SET_CREDENTIALS':
      if (payload) {
        const {user, token} = payload || {};
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));
        window.location.href = '/posts';
        return {
          isAuthenticated: true,
          user,
          token
        };
      } else {
        localStorage.clear();
        window.location.href = '/login';
        return {initialState, initialized: true};
      }
    case 'INITIALIZE':
      try {
        const user = JSON.parse(localStorage.getItem('user') as string);
        const token = JSON.parse(localStorage.getItem('token') as string);
        return {user, token, isAuthenticated: user && token, initialized: true};
      } catch (e) {
        console.log(e);
      }
      return {initialState, initialized: true};
    case 'SET_ERROR':
      localStorage.clear();
      return {
        ...initialState,
        errorMessage: payload
      };
    default:
      return state;
  }
};

const getUsers = (): IUser[] => {
  const JOHN = {
    exp: Date.now() + 60000,
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Secret123',
    username: 'john.doe@example.com'
  };
  const KATE = {
    exp: 0,
    id: '1',
    firstName: 'Kate',
    lastName: 'Smith',
    password: 'Secret123',
    username: 'kate.smith@example.com'
  };

  return [JOHN, KATE];
};

const authController: (action: any) => Promise<any> = newAuthController(
  newAuthService(newLocalUserService(newLocalUserDAO(getUsers())))
);

function App(): JSX.Element {
  const [state, dispatch] = useReducerWithMiddleware(reducer, initialState, authController);
  const [text, updateSearch] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch({type: 'INITIALIZE'});
  }, []);
  return (
    <AuthContext.Provider value={{state, dispatch}}>
      <SearchContext.Provider value={{text, updateSearch}}>
        <BrowserRouter>
          <Header />
          <div className="App">
            {/*  {!state.isAuthenticated ? <Login /> : <Posts />}*/}
            {state.initialized && (
              <Switch>
                <InternalRoute path="/posts" component={PostsView} exact isAuthenticated={state.isAuthenticated} />
                <InternalRoute path="/post/:id" component={PostDetails} exact isAuthenticated={state.isAuthenticated} />
                <Redirect from="/" to={state.isAuthenticated ? '/posts' : '/login'} exact />
                <Route path="/login" component={Login} exact />
                <Route component={NotFound} />
              </Switch>
            )}
          </div>
        </BrowserRouter>
      </SearchContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
