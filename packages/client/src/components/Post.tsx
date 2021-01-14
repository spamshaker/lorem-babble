import React from 'react';
import {IPost} from '@lorem-babble/post';

export const Post = ({post: {id, title, body}}: {post: IPost}): JSX.Element => {
  return (
    <div className="tile">
      <a href={`/post/${id}`}>
        <div className="content">
          <h3>
            {id} {title}
          </h3>
          <p>{body}</p>
        </div>
      </a>
    </div>
  );
};

export default Post;
