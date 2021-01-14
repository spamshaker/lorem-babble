import {AUTH_ERROR} from '@lorem-babble/errors';
import {ISessionUser, IUserService} from './UserService';

export interface IAuthModel {
  currentUser?: ISessionUser;
}

export interface IAuthService {
  doAuth: (authUsername: string, authPassword: string) => Promise<void>;
  getUser: () => ISessionUser | undefined;
  doLogout: () => Promise<void>;
}

export const newAuthService = (userService: IUserService, currentUser?: ISessionUser): IAuthService => {
  const model: IAuthModel = {currentUser};
  return {
    async doAuth(authUsername: string, authPassword: string): Promise<void> {
      const user = await userService.findByNameAndPassword(authUsername, authPassword);
      return new Promise((resolve, reject) => {
        if (user) {
          model.currentUser = user;
          resolve();
        } else {
          model.currentUser = undefined;
          reject(new Error(AUTH_ERROR));
        }
      });
    },
    doLogout(): Promise<void> {
      model.currentUser = undefined;
      return Promise.resolve(undefined);
    },
    getUser(): ISessionUser | undefined {
      return model.currentUser;
    }
  };
};
