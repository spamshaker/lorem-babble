export interface ISessionUser {
  username?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  exp?: number;
}

export interface IUser extends ISessionUser {
  password: string;
}

export interface IUserDAO {
  find(example: Partial<IUser>): Promise<IUser | undefined>;
}

export interface IUserService {
  findByNameAndPassword(username?: string, password?: string): Promise<ISessionUser | undefined>;
}

export const newLocalUserDAO = (users: IUser[]): IUserDAO => {
  return {
    find(example: Partial<IUser>): Promise<IUser | undefined> {
      const props = Object.keys(example);
      const user = users.find((user) => {
        return !props.some((prop) => {
          return Reflect.get(example, prop) !== Reflect.get(user, prop);
        });
      });
      return Promise.resolve(user);
    }
  };
};

export const newLocalUserService = (dao: IUserDAO): IUserService => {
  return {
    async findByNameAndPassword(username?: string, password?: string): Promise<ISessionUser | undefined> {
      //TODO: Escape username, password
      const user: IUser | undefined = await dao.find({username, password});
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password, ...sessionUser} = user;
        return Promise.resolve(sessionUser);
      }
      return undefined;
    }
  };
};

// TODO: newRemoteUserService
