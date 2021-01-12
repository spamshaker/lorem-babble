import React from 'react';
import {render} from 'react-dom';
import Auth from '@lorem-babble/auth';
import Errors from '@lorem-babble/errors';
import Post from '@lorem-babble/post';
import Posts from '@lorem-babble/posts';
import Search from '@lorem-babble/search';
import Services from '@lorem-babble/services';
import Utils from '@lorem-babble/utils';

const ModuleList = () => (
  <ol>
    <li>{Auth}</li>
    <li>{Errors}</li>
    <li>{Post}</li>
    <li>{Posts}</li>
    <li>{Search}</li>
    <li>{Services}</li>
    <li>{Utils}</li>
  </ol>
);

render(<ModuleList />, document.getElementById('react-content'));
