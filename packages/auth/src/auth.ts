import {IAuthService, ISessionUser, IUser, newAuthService, newLocalUserService} from '@lorem-babble/services';
export interface IAuthDAO {
  login: (authUsername: string, authPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => ISessionUser | undefined;
}

export interface IAuthModel {
  currentUser?: ISessionUser;
  authUsername?: string;
  authPassword?: string;
}

export const newAuthDAO = (service: IAuthService): IAuthDAO | never => {
  const model: IAuthModel = {};
  const login = async (authUsername: string, authPassword: string): Promise<void> => {
    const {doAuth, getUser} = service;
    model.authUsername = authUsername;
    model.authPassword = authPassword;
    model.currentUser = undefined;

    await doAuth(authUsername, authPassword);
    const {username, firstName, lastName, exp, id} = await getUser();
    model.currentUser = {username, firstName, lastName, exp, id};
  };

  const logout = async () => {
    await service.doLogout();
    model.currentUser = undefined;
    window.location.href = '/login';
  };

  const getCurrentUser = (): ISessionUser | undefined => {
    const {currentUser} = model;
    return currentUser && {...currentUser};
  };
  return {
    login,
    logout,
    getCurrentUser
  };
};

export const newLocalAuthDAO = (users: IUser[]): IAuthDAO => newAuthDAO(newAuthService(newLocalUserService(users)));
