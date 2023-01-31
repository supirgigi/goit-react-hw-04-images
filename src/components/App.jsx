import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Loader from 'components/Loader';
import Button from 'components/Button';
import { fetchImages } from 'services/Api';
import { Container } from './App.styled';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (query === '') {
      return;
    }

    const handleRequest = async () => {
      try {
        setStatus('pending');

        const { hits, totalHits } = await fetchImages(query, page);

        if (totalHits === 0) {
          setStatus('rejected');
          return toast.error(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }

        if (page === 1) {
          toast.success(`Found ${totalHits} images`);
        }

        if (totalHits < 12 * page) {
          setStatus('idle');

          if (page > 1) {
            toast.info("You've reached the end of search results");
          }
        } else {
          setStatus('resolved');
        }

        setImages(prevImages => [...prevImages, ...hits]);
      } catch (error) {
        setStatus('rejected');

        toast.error(error.message);
      }
    };

    handleRequest();
  }, [query, page]);

  const handleFormSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery images={images} />
      {status === 'pending' && <Loader />}
      {status === 'resolved' && <Button text="Load more" onClick={loadMore} />}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover={false}
        theme="light"
      />
    </Container>
  );
};

export default App;
