import {IAuthService} from '@lorem-babble/services';

export const newAuthController = (service: IAuthService): ((action: any) => Promise<any>) => {
  return async (action) => {
    const {type, payload} = action;
    if (type === 'LOGIN') {
      const {username, password} = payload;
      try {
        await service.doAuth(username, password);
        const user = service.getUser();
        return {type: 'SET_CREDENTIALS', payload: user ? {user, token: 'SomeToken'} : null};
      } catch (e: any) {
        return {type: 'SET_ERROR', payload: e.message};
      }
    } else if (type === 'LOGOUT') {
      return {type: 'SET_CREDENTIALS', payload: null};
    }
    return action;
  };
};
