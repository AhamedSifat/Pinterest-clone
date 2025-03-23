import './GalleryItems.css';
import { Link } from 'react-router-dom';
import Image from '../image/Image';

const GalleryItems = ({ item }) => {
  const optimizedHeight = (372 * item.height) / item.width;
  return (
    <div
      className='galleryIteam'
      style={{
        gridRowEnd: `span ${Math.ceil(item.height / 100)}`,
      }}
    >
      <Image src={item?.media} w={372} h={optimizedHeight} />
      <Link to={`/pin/${item._id}`} className='overlay' />
      <button className='saveButton'>Save</button>
      <div className='overlay-icons'>
        <button>
          <img src='/general/share.svg' alt='' />
        </button>
        <button>
          <img src='/general/more.svg' alt='' />
        </button>
      </div>
    </div>
  );
};

export default GalleryItems;
