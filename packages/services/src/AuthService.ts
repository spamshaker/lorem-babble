import {ISessionUser, IUserService} from './services';

export const AUTH_ERROR = 'User doesnt exists or wrong password';
export const AUTH_SESSION_ERROR = 'User is not logged in';

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
      return Promise.resolve();
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
