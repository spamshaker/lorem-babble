import {ISessionUser, IUserService} from './services';
import {AUTH_ERROR, AUTH_SESSION_ERROR} from '@lorem-babble/errors';

export interface IAuthService {
  doAuth: (authUsername: string, authPassword: string) => Promise<void>;
  getUser: () => Promise<ISessionUser>;
  doLogout: () => Promise<void>;
}

export const newAuthService = (userService: IUserService, sessionUser?: ISessionUser): IAuthService => {
  let currentUser = sessionUser;
  return {
    async doAuth(authUsername: string, authPassword: string): Promise<void> {
      const user = await userService.find({username: authUsername, password: authPassword});
      const {password, ...userDetails} = user || {};
      return new Promise((resolve, reject) => {
        if (user) {
          currentUser = {...userDetails};
          resolve();
        } else {
          reject(new Error(AUTH_ERROR));
        }
      });
    },
    doLogout(): Promise<void> {
      currentUser = undefined;
      return Promise.resolve(undefined);
    },
    getUser(): Promise<ISessionUser> {
      return new Promise((resolve, reject) => {
        if (currentUser) {
          resolve(currentUser);
        } else {
          reject(new Error(AUTH_SESSION_ERROR));
        }
      });
    }
  };
};
