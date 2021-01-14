import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {IPost} from '@lorem-babble/post';

type PostViewParams = {
  id: string;
};

const PostDetails = (): JSX.Element => {
  const {id} = useParams<PostViewParams>();
  const [data, setData] = useState<IPost>({});

  useEffect(() => {
    (async () => {
      const response = await (await fetch(`https:///jsonplaceholder.typicode.com/posts/${id}`)).json();
      console.log(response);
      setData(response);
    })();
  }, [id]);
  const {title, body} = data;
  return (
    <div className="container">
      <div>
        <h2>
          {id} {title}
        </h2>
        <p>{body}</p>
      </div>
    </div>
  );
};
export default PostDetails;
