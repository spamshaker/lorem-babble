import {IUser, newLocalUserDAO} from '../src/UserService';
import {JOHN, KATE} from '../__mocks__/users';
import {IUserService, newLocalUserService} from '../lib/UserService';

describe('newLocalUserService test suite', () => {
  describe('given two users list', () => {
    let users: IUser[];
    let service: IUserService;
    let john: IUser;
    let kate: IUser;
    beforeEach(() => {
      john = JOHN;
      kate = KATE;
      users = [john, kate];
      service = newLocalUserService(newLocalUserDAO(users));
    });

    it('should find John by username = john.doe@example.com', async () => {
      const found = await service.findByNameAndPassword(john.username, john.password);
      expect(found).not.toBeNull();
      expect(found).not.toBeUndefined();
      const {password, ...johnDetails} = john;
      expect(found).toEqual(johnDetails);
    });

    it('should find Kate by username = kate.smith@example.com', async () => {
      const found = await service.findByNameAndPassword(kate.username, kate.password);
      expect(found).not.toBeNull();
      expect(found).not.toBeUndefined();
      const {password, ...kateDetails} = kate;
      expect(found).toEqual(kateDetails);
    });

    it('should not find George by username = george.brown@example.com', async () => {
      const found = await service.findByNameAndPassword('george.brown@example.com', 'secret');
      expect(found).toBeUndefined();
    });
  });
});
