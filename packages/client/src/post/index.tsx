import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {IPost} from '@lorem-babble/post';

type PostViewParams = {
  id: string;
};

const PostView = (): JSX.Element => {
  const {id} = useParams<PostViewParams>();
  const [data, setData] = useState<IPost>({});

  useEffect(() => {
    (async () => {
      const response = await (await fetch('https:///jsonplaceholder.typicode.com/posts/1')).json();
      setData(response);
    })();
  }, [id]);
  const {title, body} = data;
  return (
    <div>
      <h1>
        Post {id} {title}
      </h1>
      <div>{body}</div>
    </div>
  );
};
export default PostView;
