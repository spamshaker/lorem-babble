/**
 * @jest-environment jsdom
 */
import {IAuthDAO, newLocalAuthDAO} from '../';
import {JOHN, KATE} from '../../services/__mocks__/users';
import {AUTH_ERROR} from '@lorem-babble/errors';

describe('@lorem-babble/auth', () => {
  let dao: IAuthDAO;
  beforeEach(() => {
    dao = newLocalAuthDAO([KATE, JOHN]);
  });
  it('given valid credentials should authorize user for internal content', async () => {
    await dao.login('john.doe@example.com', 'secret');
    const {firstName, lastName, username, id, exp} = JOHN;
    expect(dao.getCurrentUser()).toEqual({firstName, lastName, username, exp, id});
  });

  it('given wrong password should reject', () => {
    return expect(dao.login('john-doe@example.com', 'wrong')).rejects.toEqual(new Error(AUTH_ERROR));
  });

  it('given wrong username should reject', () => {
    return expect(dao.login('john@example.com', 'wrong')).rejects.toEqual(new Error(AUTH_ERROR));
  });

  it('should logout user and redirect to login page', async () => {
    const url = 'http://dummy.com';
    Object.defineProperty(window, 'location', {
      value: {
        href: url
      }
    });
    await dao.logout();
    expect(dao.getCurrentUser()).toBeUndefined();
    expect(window.location.href).toEqual('/login');
  });
});
