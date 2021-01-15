import '@testing-library/jest-dom';
import * as React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Login from '../src/components/Login';
import {AuthContext} from '../src/components/AuthContext';

test('allows the user to login successfully', async () => {
  const dispatch = jest.fn();
  await render(
    <AuthContext.Provider value={{state: {}, dispatch}}>
      <Login />
    </AuthContext.Provider>
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: {value: 'john.doe@example.com'}
  });

  const password = screen.getByLabelText(/password/i);
  fireEvent.change(password, {
    target: {value: 'Secret123'}
  });

  fireEvent.click(screen.getByRole(/button/i));
  expect(password).toBeValid();
  expect(dispatch).toHaveBeenNthCalledWith(1, {
    type: 'LOGIN',
    payload: {username: 'john.doe@example.com', password: 'Secret123'}
  });
});

test('should block submitting while password not fit with at least one capital letter', async () => {
  const dispatch = jest.fn();
  await render(
    <AuthContext.Provider value={{state: {}, dispatch}}>
      <Login />
    </AuthContext.Provider>
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: {value: 'john.doe@example.com'}
  });

  const password = screen.getByLabelText(/password/i);

  fireEvent.change(password, {
    target: {value: 's1234567'}
  });

  fireEvent.click(screen.getByRole(/button/i));

  expect(password).toBeInvalid();
});
test('should block submitting while password not fit with at least one small letter', async () => {
  const dispatch = jest.fn();
  await render(
    <AuthContext.Provider value={{state: {}, dispatch}}>
      <Login />
    </AuthContext.Provider>
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: {value: 'john.doe@example.com'}
  });
  const password = screen.getByLabelText(/password/i);
  fireEvent.change(password, {
    target: {value: 'SECRET123'}
  });

  fireEvent.click(screen.getByRole(/button/i));

  expect(password).toBeInvalid();
});
