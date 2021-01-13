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

export interface IUserService {
  find(example: Partial<IUser>): Promise<IUser | undefined>;
}

export const newLocalUserService = (list: IUser[]): IUserService => {
  const users: IUser[] = list;

  return {
    find(example: Partial<IUser>): Promise<IUser | undefined> {
      const props = Object.keys(example);
      return Promise.resolve(
        users.find((user) => !props.some((prop) => Reflect.get(example, prop) !== Reflect.get(user, prop)))
      );
    }
  };
};

// TODO: newRemoteUserService
