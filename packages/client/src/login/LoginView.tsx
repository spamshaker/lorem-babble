import React, {FormEvent} from 'react';

interface Props {
  submitHandler: (e: FormEvent<HTMLFormElement>) => void;
}

const LoginView = (props: Props): JSX.Element => {
  return (
    <form onSubmit={(e: FormEvent<HTMLFormElement>) => props.submitHandler(e)}>
      <label htmlFor="email">Enter your email:</label>
      <input type="email" id="email" name="email" required aria-required />
      <label htmlFor="password">Password</label>
      <input type="password" id="passwd" name="passwd" required aria-required minLength={8} />
      <button type="submit">Login</button>
    </form>
  );
};
export default LoginView;
