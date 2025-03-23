import './Boards.css';
import Image from '../image/Image';
import { useQuery } from '@tanstack/react-query';
import apiRequest from '../../utils/apiRequest';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';

const Boards = ({ userId }) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['boards', userId],
    queryFn: () => apiRequest.get(`/boards/${userId}`).then((res) => res.data),
  });

  if (isPending) {
    return 'Loading....';
  }

  if (error) {
    return 'an error has occurred' + error.message;
  }

  if (!data) {
    return 'Board not found';
  }

  return (
    <div className='collections'>
      {data.map((baord) => (
        <Link
          to={`/search?boardId=${baord._id}`}
          key={baord._id}
          className='collection'
        >
          <Image src={baord.firstPin.media} />
          <div className='collectionInfo'>
            <h1>{baord.title}</h1>
            <span>
              {baord.pinCount} Pins -{format(baord.createdAt)}{' '}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Boards;
