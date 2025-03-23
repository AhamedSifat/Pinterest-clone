import { useState } from 'react';
import './UserButton.css';
import apiRequest from '../../utils/apiRequest';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Image from '../image/Image';

const UserButton = () => {
  const { currentUser, removeCurrentUser } = useAuthStore();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post('/users/auth/logout');
      navigate('/auth');
      removeCurrentUser();
    } catch (error) {
      console.log(error);
    }
  };

  return currentUser ? (
    <div className='userButton'>
      <Image src={currentUser.img || '/general/noAvatar.png'} />
      <img
        onClick={() => setShow(!show)}
        className='arrow'
        src='/general/arrow.svg'
        alt=''
      />
      {show && (
        <div className='userOptions'>
          <Link to={`/profile/${currentUser.username}`} className='userOption'>
            Profile
          </Link>
          <Link className='userOption'>Settings</Link>
          <div onClick={handleLogout} className='userOption'>
            Logout
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className='guestButton'>
      <Link to='/auth' className='loginLink' href=''>
        Login/Sign Up
      </Link>
    </div>
  );
};

export default UserButton;
