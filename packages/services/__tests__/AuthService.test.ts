import {IAuthService, IUser, newAuthService, newLocalUserService} from '../src/services';
import {JOHN, KATE} from '../__mocks__/users';
import {AUTH_ERROR, AUTH_SESSION_ERROR} from '@lorem-babble/errors';

describe('given two users list', () => {
  let service: IAuthService;
  let john: IUser;
  let kate: IUser;
  beforeEach(() => {
    john = JOHN;
    kate = KATE;
    service = newAuthService(newLocalUserService([john, kate]));
  });

  it('should authorize john.doe@example.com', async () => {
    await service.doAuth('john.doe@example.com', 'secret');
    const result = await service.getUser();
    const {password, ...johnDTO} = john;
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    expect(password).toEqual('secret');
    expect(result).toEqual(johnDTO);
  });

  it('should reject john.doe@example.com when wrong password', () => {
    return expect(service.doAuth('john.doe@example.com', 'Secret')).rejects.toEqual(new Error(AUTH_ERROR));
  });

  it('should reject george.brown@example.com due to not registered', async () => {
    return expect(service.doAuth('george.brown@example.com', 'secret')).rejects.toEqual(new Error(AUTH_ERROR));
  });

  it('should reject request user data while user not logged in', async () => {
    return expect(service.getUser()).rejects.toEqual(new Error(AUTH_SESSION_ERROR));
  });

  it('should reject request user data while user not logged in', async () => {
    service = newAuthService(newLocalUserService([john, kate]), john);
    await service.doLogout();
    return expect(service.getUser()).rejects.toEqual(new Error(AUTH_SESSION_ERROR));
  });
});
