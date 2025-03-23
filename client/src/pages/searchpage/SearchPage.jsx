import { useSearchParams } from 'react-router-dom';
import Gallery from '../../components/gallery/Gallery';
import './SearchPage.css';

const SearchPage = () => {
  let [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const baordId = searchParams.get('boardId');

  return <Gallery search={search} baordId={baordId} />;
};

export default SearchPage;
