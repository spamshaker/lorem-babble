export interface IUserDTO {
  username?: string;
  firstName?: string;
  lastName?: string;
  id: string;
  exp: number;
}

export interface IAuthService {
  doAuth: (authUsername: string, authPassword: string) => Promise<void>;
  getUser: () => Promise<IUserDTO>;
  doLogout: () => Promise<void>;
}

const sessionUser: IUserDTO = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'john-doe@example.com',
  exp: NaN,
  id: '1'
};

const existingDBUser: IUserDTO & {password: string} = {
  ...sessionUser,
  password: 'secret'
};

let currentUser: IUserDTO;

export const AuthService: IAuthService = {
  doAuth(authUsername: string, authPassword: string): Promise<void> {
    const {username, password} = existingDBUser;
    return new Promise((resolve, reject) => {
      if (authUsername === username && authPassword === password) {
        currentUser = {...sessionUser, exp: Date.now() + (1000 * 60) / 1000};
        resolve();
      } else {
        reject(new Error('User doesnt exists or wrong password'));
      }
    });
  },
  doLogout(): Promise<void> {
    return Promise.resolve();
  },
  getUser(): Promise<IUserDTO> {
    return new Promise((resolve, reject) => {
      if (currentUser) {
        resolve(currentUser);
      } else {
        reject(new Error('User is not logged in'));
      }
    });
  }
};
