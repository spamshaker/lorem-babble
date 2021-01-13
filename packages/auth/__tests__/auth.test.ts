import {createAuthDAO, IAuthDAO} from '../src/auth';
import {newAuthService, newLocalUserService} from '@lorem-babble/services';
import {JOHN, KATE} from '../../services/__mocks__/users';

describe('@lorem-babble/auth', () => {
  let dao: IAuthDAO;
  beforeEach(() => {
    dao = createAuthDAO(newAuthService(newLocalUserService([KATE, JOHN])));
  });
  it('given valid credentials should authorize user for internal content', async () => {
    await dao.login('john.doe@example.com', 'secret');
    return expect(dao.getCurrentUser()).resolves.toEqual({
      firstName: 'John',
      lastName: 'Doe',
      username: 'john.doe@example.com',
      id: '1'
    });
  });

  it('given wrong password should reject', () => {
    return expect(dao.login('john-doe@example.com', 'wrong')).rejects.toEqual(
      new Error('User doesnt exists or wrong password')
    );
  });

  it('given wrong username should reject', () => {
    return expect(dao.login('john@example.com', 'wrong')).rejects.toEqual(
      new Error('User doesnt exists or wrong password')
    );
  });
});
