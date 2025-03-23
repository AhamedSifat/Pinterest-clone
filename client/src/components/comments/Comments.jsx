import './Comments.css';
import Image from './../image/Image';
import { useQuery } from '@tanstack/react-query';
import apiRequest from '../../utils/apiRequest.js';
import { format } from 'timeago.js';
import CommentForm from './CommentForm.jsx';

const Comments = ({ id }) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => apiRequest.get(`/comments/${id}`).then((res) => res.data),
  });

  if (isPending) {
    return 'Loading....';
  }

  if (error) {
    return 'an error has occurred' + error.message;
  }

  if (!data) {
    return 'Comments not found';
  }

  return (
    <div className='comments'>
      <div className='commentList'>
        <span className='commentCount'>
          {data.length === 0 ? 'No Comments' : data.length + ' Comments'}
        </span>
        {data?.map((comment) => (
          <div key={comment._id} className='comment'>
            <Image path={comment.user.img || '/general/noAvatar.png'} />
            <div className='commentContent'>
              <span className='commentUserName'>
                {' '}
                {comment.user.displayName}
              </span>
              <p className='commentUserText'>{comment.description}</p>
              <span className='commentUserTime'>
                {format(comment.createAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <CommentForm id={id} />
    </div>
  );
};

export default Comments;
