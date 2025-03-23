import './ProfilePage.css';

import Image from './../../components/image/Image';
import { useState } from 'react';

import Boards from './../../components/boards/Boards';
import Gallery from './../../components/gallery/Gallery';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import apiRequest from '../../utils/apiRequest';
import FollowButton from './FollowButton';

const ProfilePage = () => {
  const [type, setType] = useState('saved');

  const { username } = useParams();
  const { data, isPending, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => apiRequest.get(`/users/${username}`).then((res) => res.data),
  });

  if (isPending) {
    return 'Loading....';
  }

  if (error) {
    return 'an error has occurred' + error.message;
  }

  if (!data) {
    return 'User not found';
  }

  return (
    <div className='profilePage'>
      <Image
        className='profileImg'
        w={100}
        h={100}
        src={data.img || '/general/noAvatar.png'}
      />
      <h1 className='profileName'>{data.displayName}</h1>
      <span className='profileUsername'>@{data.username}</span>
      <div className='followCounts'>
        {data.followerCount} followers - {data.followingCount} following
      </div>
      <div className='profileInteractions'>
        <Image path='/general/share.svg' />
        <div className='profileButton'>
          <button>Message</button>
          <FollowButton
            isFollowing={data.isFollowing}
            username={data.username}
          />
        </div>
        <Image path='/general/more.svg' />
      </div>
      <div className='profileOptions'>
        <span
          onClick={() => setType('created')}
          className={type === 'created' ? 'active' : ' '}
        >
          Created
        </span>
        <span
          onClick={() => setType('saved')}
          className={type === 'saved' ? 'active' : ' '}
        >
          Save
        </span>
      </div>
      {type === 'created' ? (
        <Gallery userId={data._id} />
      ) : (
        <Boards userId={data._id} />
      )}
    </div>
  );
};

export default ProfilePage;
