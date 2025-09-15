import { useLoaderData, useNavigate } from 'react-router';
import { Bounce, toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

// I used bootstrap for styling, if we stick with that will need to import bootstrap, we can also style traditionally with css if preferred.
// Reservation endpoint needs to be properly set up.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const BookPage = () => {
  const bookData = useLoaderData(); // I think the tables are as follows, I cant remember if its cover_image or coverimage so for now I am going to make a conditional statement for both, if anything else is off I will need to adjust { id, title, author, description, cover_image?, coverimage? available }
  const { token } = useAuth();
  const navigate = useNavigate();

  const notify = () =>
    toast('📚 Book Reserved!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      theme: 'light',
      transition: Bounce,
    });

  const handleReserve = async () => {
    try {
      const res = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bookId: bookData?.id }),
      });

      notify();

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || `Reservation failed (${res.status})`);
      }

      navigate(`/books/${bookData.id}`);
    } catch (err) {
      console.error(err);
      alert('Could not reserve the book. Please try again.');
    }
  };

  if (!bookData) {
    return (
      <div className='container'>
        <p>Loading…</p>
      </div>
    );
  }

  const coverSrc = bookData.cover_image || bookData.coverimage || '';

  return (
    <div className='book-details-container'>
      <div id='book' className='text-center m-3'>
        <figure>
          {coverSrc ? (
            <img
              className='book-details-img'
              src={coverSrc}
              alt={`cover image of ${bookData.title}`}
            />
          ) : null}
        </figure>
      </div>

      <div className=''>
        <section className=''>
          <h1>{bookData.title}</h1>
          <p className='lead'>
            <strong>Written by:</strong> <em>{bookData.author}</em>
          </p>
          <p className='lead'>{bookData.description}</p>

          {token ? (
            !bookData.isReserved ? (
              <button
                onClick={handleReserve}
                className='btn btn-outline-primary'
              >
                Reserve this book
              </button>
            ) : (
              <button className='btn btn-outline-danger' disabled>
                Book is already reserved
              </button>
            )
          ) : (
            <></>
          )}
        </section>
      </div>
    </div>
  );
};

export default BookPage;
