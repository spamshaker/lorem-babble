import {IAuthService, IUserDTO, AuthService} from '@lorem-babble/services';
import {createAuthDAO, IAuthDAO} from '../src/auth';

describe('@lorem-babble/auth', () => {
  it('given valid credentials should authorize user for internal content', async () => {
    const dao: IAuthDAO = createAuthDAO(AuthService);
    await dao.login('john-doe@example.com', 'secret');
    const result = await dao.getCurrentUser();
    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      username: 'john-doe@example.com',
      id: '1'
    });
  });
});
