import {Dispatch, Reducer, ReducerState, useReducer} from 'react';

export function useReducerWithMiddleware<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I & ReducerState<R>,
  middleware?: (action: any) => Promise<any>
): [ReducerState<R>, Dispatch<any>] {
  const [state, dispatch] = useReducer(reducer, initializerArg);

  const dispatchWithMiddleware: Dispatch<any> = async (action) => {
    const next = middleware ? await middleware(action) : action;
    dispatch(next);
  };

  return [state, dispatchWithMiddleware];
}
