import './Gallery.css';
import GalleryItems from '../galleryItems/GalleryItems';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from '../skeleton/Skeleton';

const Gallery = ({ search, userId, baordId }) => {
  const fetchPins = async ({ pageParam, search, userId }) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/pins?cursor=${pageParam}&search=${
        search || ''
      }&userId=${userId || ''}&baordId=${baordId || ''}`
    );

    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ['pins', search, userId, baordId],
    queryFn: (pageParam = 0) =>
      fetchPins({ pageParam, search, userId, baordId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === 'error') {
    return 'An error has occurred: ';
  }

  if (status === 'pending') {
    return <Skeleton />;
  }

  const allPins = data?.pages.flatMap((page) => page.pins) || [];

  return (
    <InfiniteScroll
      dataLength={allPins.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h1>Loading more pins</h1>}
      endMessage={<p>All post loaded</p>}
    >
      <div className='gallery'>
        {allPins?.map((item, index) => (
          <GalleryItems key={index} item={item} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default Gallery;
