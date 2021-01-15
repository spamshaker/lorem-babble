import React, {useContext, useState} from 'react';
import {AuthContext} from './AuthContext';

export const Login = (): JSX.Element => {
  const {state, dispatch} = useContext(AuthContext);
  const initialState = {
    email: '',
    password: ''
  };

  const [data, setData] = useState(initialState);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: 'LOGIN',
      payload: {
        username: data.email,
        password: data.password
      }
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleFormSubmit}>
        <h1>Login</h1>

        <label htmlFor="email">
          Email Address
          <input
            type="text"
            value={data.email}
            onChange={handleInputChange}
            name="email"
            id="email"
            minLength={5}
            required={true}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            value={data.password}
            onChange={handleInputChange}
            name="password"
            id="password"
            pattern="^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])([a-zA-Z0-9]+)$"
            minLength={8}
            aria-valuemin={8}
            required={true}
          />
        </label>

        {state.errorMessage && <span className="form-error">{state.errorMessage}</span>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
