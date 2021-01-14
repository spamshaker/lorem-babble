import React, {useContext} from 'react';
import {AuthContext} from './AuthContext';
import {SearchContext} from './SearchContext';

export const Header = (): JSX.Element => {
  const {state, dispatch} = useContext(AuthContext);
  const {updateSearch} = useContext(SearchContext);
  return (
    <nav id="navigation">
      <h1 className="logo">Lorem babble</h1>
      <div className="search-box-container">
        <label htmlFor="search-box">search</label>
        <input
          type="text"
          className="search-box"
          name="search-box"
          onChange={(e) => updateSearch(e.target.value.toLowerCase())}
        />
      </div>
      <button
        onClick={() =>
          dispatch({
            type: 'LOGOUT'
          })
        }
      >
        {state.isAuthenticated && <h1>Hi {state.user?.firstName} (LOGOUT)</h1>}
      </button>
    </nav>
  );
};

export default Header;
