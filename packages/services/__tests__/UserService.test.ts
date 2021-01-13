import {IUser, IUserService, newLocalUserService} from '../src/UserService';
import {JOHN, KATE} from '../__mocks__/users';

describe('LocalUserService test suite', () => {
  describe('given two users list', () => {
    let users: IUser[];
    let service: IUserService;
    let john: IUser;
    let kate: IUser;
    beforeEach(() => {
      john = JOHN;
      kate = KATE;
      users = [john, kate];
      service = newLocalUserService(users);
    });

    it('should find John by username = john.doe@example.com', async () => {
      const found = await service.find({username: john.username, password: john.password});
      expect(found).not.toBeNull();
      expect(found).not.toBeUndefined();
      expect(found).toEqual(john);
    });

    it('should find Kate by username = kate.smith@example.com', async () => {
      const found = await service.find({username: kate.username, password: kate.password});
      expect(found).not.toBeNull();
      expect(found).not.toBeUndefined();
      expect(found).toEqual(kate);
    });

    it('should not find George by username = george.brown@example.com', async () => {
      const found = await service.find({username: 'george.brown@example.com', password: 'secret'});
      expect(found).toBeUndefined();
    });
  });
});
