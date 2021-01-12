import {IUserDTO, IAuthService} from '@lorem-babble/services';

export interface IUser {
  username?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
}

export interface IAuthDAO {
  login: (authUsername: string, authPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<IUser>;
}

export interface IAuthModel {
  currentUser?: IUserDTO;
  authUsername?: string;
  authPassword?: string;
  isAuthenticated?: boolean;
}

export const createAuthDAO = (service: IAuthService): IAuthDAO => {
  const model: IAuthModel = {};
  const login = async (authUsername: string, authPassword: string): Promise<void> => {
    if (!(authUsername === model.authUsername && authPassword === model.authPassword && model.isAuthenticated)) {
      const {doAuth, getUser} = service;
      model.authUsername = authUsername;
      model.authPassword = authPassword;

      await doAuth(authUsername, authPassword);
      model.currentUser = await getUser();
      model.isAuthenticated = true;
    }
  };

  const toUser = (): IUser => {
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

  const getCurrentUser = async (): Promise<IUser> => {
    const {isAuthenticated, currentUser = {id: '', exp: NaN}} = model;
    if (isAuthenticated) {
      const currentTime = Date.now() / 1000;
      if (isNaN(currentUser.exp) || currentUser.exp < currentTime) {
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
