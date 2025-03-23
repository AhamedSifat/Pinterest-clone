import { useNavigate } from 'react-router-dom';
import UserButton from '../userButton/UserButton';
import './TopBar.css';

const TopBar = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?search=${e.target[0].value}`);
  };
  return (
    <div className='topBar'>
      {/* SEARCH */}
      <form onSubmit={handleSubmit} className='search'>
        <img src='/general/search.svg' alt='' />
        <input type='text' placeholder='Search' />
      </form>
      <UserButton />
    </div>
  );
};

export default TopBar;
