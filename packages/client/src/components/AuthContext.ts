import {createContext, Dispatch} from 'react';
import {ISessionUser} from '@lorem-babble/services';

type State = {
  isAuthenticated?: boolean;
  user?: ISessionUser;
  token?: string;
  errorMessage?: string;
};
export const AuthContext = createContext<{
  state: State;
  dispatch: Dispatch<{type: string; payload?: unknown}>;
}>({state: {}, dispatch: () => true});
