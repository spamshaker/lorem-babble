import React, {useContext, useEffect, useReducer, useState} from 'react';
import Post from './Post';
import {AuthContext} from './AuthContext';
import {IPost} from '@lorem-babble/post';
import {SearchContext} from './SearchContext';

const initialState = {
  posts: [],
  isFetching: false,
  hasError: false,
  isPostSubmitting: false,
  postHasError: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_POSTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        hasError: false
      };
    case 'FETCH_POSTS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        posts: action.payload
      };
    case 'FETCH_POSTS_FAILURE':
      return {
        ...state,
        hasError: true,
        isFetching: false
      };
    default:
      return state;
  }
};

export const Posts = (): JSX.Element => {
  const {state: authState} = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchResults, setSearchResults] = useState<IPost[]>([]);
  const {text} = useContext(SearchContext);

  useEffect(() => {
    const results = text
      ? state.posts.filter(({title, body}) => title.toLowerCase().includes(text) || body.toLowerCase().includes(text))
      : state.posts;
    setSearchResults(results);
  }, [text, state]);

  useEffect(() => {
    dispatch({
      type: 'FETCH_POSTS_REQUEST'
    });
    fetch('https://jsonplaceholder.typicode.com/posts/', {
      /* headers: {
         Authorization: `Bearer ${authState.token}`
      } */
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((resJson: Array<IPost>) => {
        const sorted = resJson.sort((a, b) => Number(b.id) - Number(a.id));
        let displayed: (IPost | undefined)[] = [];
        const id = setInterval(() => {
          const post = sorted.shift();
          if (!post) {
            clearInterval(id);
            return;
          }
          displayed = displayed.concat([post]);
          dispatch({
            type: 'FETCH_POSTS_SUCCESS',
            payload: displayed
          });
        }, 1);
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: 'FETCH_POSTS_FAILURE'
        });
      });
  }, [authState.token]);

  return (
    <div className="container">
      <div className="grid">
        {state.isFetching ? (
          <span className="loader">LOADING...</span>
        ) : state.hasError ? (
          <span className="error">AN ERROR HAS OCCURED</span>
        ) : (
          <>{searchResults.length > 0 && searchResults.map((post) => <Post key={post.id?.toString()} post={post} />)}</>
        )}
      </div>
    </div>
  );
};

export default Posts;
