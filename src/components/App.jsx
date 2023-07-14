import { useEffect, useState } from 'react';
import { Notify } from 'notiflix';

import css from './App.module.css';
import fetchImages from '../Data';
import SearchBar from './SearchBar/SearchBar';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    if (!query) {
      return;
    }

    const showImages = async () => {
      try {
        setStatus('pending');
        const { totalHits, hits } = await fetchImages(query, page);

        if (!totalHits) {
          setStatus('idle');
          Notify.failure('Sorry, there are no such images. Please try again.');
          return;
        }
        const normalizedImages = hits.map(({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        }));
        setImages(prevState => [...prevState, ...normalizedImages]);
        setStatus('resolved');
        setTotalHits(totalHits);
      } catch (error) {
        setStatus('rejected');
      }
    };
    showImages();
  }, [page, query]);

  const handleSearch = query => {
    if (!query) {
      Notify.failure('Field is empty!');
      return;
    }
    setQuery(query);
    setImages([]);
    setPage(1);
    setTotalHits(0);
  };

  const onNextPage = () => {
    setPage(page => page + 1);
  };

  const showButton = status === 'resolved' && images.length !== totalHits;

  return (
    <div className={css.App}>
      <SearchBar handleSearch={handleSearch} />
      {images.length > 0 && <ImageGallery images={images} />}
      {status === 'pending' && <Loader />}
      {showButton && <Button onClick={onNextPage} />}
    </div>
  );
};

export default App;
