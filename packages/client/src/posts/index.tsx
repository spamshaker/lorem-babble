import React, {useEffect, useState} from 'react';
import {IPost} from '@lorem-babble/post';

const PostsView = (): JSX.Element => {
  const [data, setData] = useState<IPost[]>();

  useEffect(() => {
    (async () => {
      const response = await (await fetch('http:///jsonplaceholder.typicode.com/posts/')).json();
      setData(response);
    })();
  }, []);
  return (
    <div>
      <h1>Posts</h1>
      {data &&
        data.map(({id, body, title}: IPost, index: number) => {
          return (
            <div key={index}>
              <h2>
                <a href={`/post/${id}`}>
                  {id} {title}
                </a>
              </h2>
              <p>{body}</p>
            </div>
          );
        })}
    </div>
  );
};
export default PostsView;
