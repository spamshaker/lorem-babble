import React, {createContext, Dispatch, FormEvent, SetStateAction, useState} from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './login';
import NotFound from './NotFound';
import InternalRoute from './InternalRoute';
import PostsView from './posts';
import PostView from './post';
import {newLocalAuthDAO} from '@lorem-babble/auth';
import {ISessionUser, IUser} from '@lorem-babble/services';

const LoadUsers = async (): Promise<IUser[]> => {
  const JOHN = {
    exp: Date.now() + 60000,
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    password: 'secret',
    username: 'john.doe@example.com'
  };
  const KATE = {
    exp: 0,
    id: '1',
    firstName: 'Kate',
    lastName: 'Smith',
    password: 'secret',
    username: 'kate.smith@example.com'
  };

  return Promise.resolve([JOHN, KATE]);
};

const createUserSession = async () => {
  const authDAO = newLocalAuthDAO(await LoadUsers());
  const invalidateSession = async () => {
    const user = authDAO.getCurrentUser();
    if (user) {
      const currentTime = Date.now() / 1000;
      if (!user.exp || user.exp < currentTime) {
        await authDAO.logout();
      }
    }
  };
};

export const AuthContext = createContext<{user: ISessionUser | undefined}>({user: undefined});

// Hook
function useLocalStorage<S>(key: string, initialValue: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: SetStateAction<S>): void => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const App = (): JSX.Element => {
  const [user, setUser] = useLocalStorage<ISessionUser | undefined>('user', undefined);

  return (
    <AuthContext.Provider value={{user}}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact>
            <Login
              submitHandler={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                setUser({});
                window.location.href = '/posts';
              }}
            />
          </Route>
          <InternalRoute path="/posts" component={PostsView} exact />
          <InternalRoute path="/post/:id" component={PostView} exact />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

render(<App />, document.getElementById('react-content'));
