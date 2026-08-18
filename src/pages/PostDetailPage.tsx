import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams();

  return <h1>Post detail: {id}</h1>;
};

export default PostDetailPage;
