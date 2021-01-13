import {ISessionUser, IAuthService} from '@lorem-babble/services';

export interface IAuthDAO {
  login: (authUsername: string, authPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<ISessionUser>;
}

export interface IAuthModel {
  currentUser?: ISessionUser;
  authUsername?: string;
  authPassword?: string;
  isAuthenticated?: boolean;
}

export const createAuthDAO = (service: IAuthService): IAuthDAO | never => {
  const model: IAuthModel = {};
  const login = async (authUsername: string, authPassword: string): Promise<void> => {
    const {doAuth, getUser} = service;
    model.authUsername = authUsername;
    model.authPassword = authPassword;
    model.isAuthenticated = false;

    await doAuth(authUsername, authPassword);
    model.currentUser = await getUser();
    model.isAuthenticated = true;
  };

  const toUser = (): ISessionUser => {
    const {currentUser} = model;
    if (!currentUser) {
      return {};
    }
    const {firstName, id, lastName, username} = currentUser;
    return {
      firstName,
      id,
      lastName,
      username
    };
  };

  const logout = async () => {
    await service.doLogout();
    model.isAuthenticated = false;
    window.location.href = '/login';
  };

  const getCurrentUser = async (): Promise<ISessionUser> => {
    const {isAuthenticated, currentUser = {id: '', exp: NaN}} = model;
    if (isAuthenticated) {
      const currentTime = Date.now() / 1000;
      if (!currentUser.exp || currentUser.exp < currentTime) {
        await logout();
      }
    }
    return new Promise((resolve, reject) => {
      if (currentUser) {
        resolve(toUser());
      } else {
        reject();
      }
    });
  };
  return {
    login,
    logout,
    getCurrentUser
  };
};

export default 'Auth';
