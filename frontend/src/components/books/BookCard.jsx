import { Link } from 'react-router';

const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book.id}`}>
      <li className='card'>
        <img src={book.cover_image} alt={book.title} />
        <p>{book.title}</p>
        <p className='card-author'>
          <span>by: </span>
          {book.author}
        </p>
      </li>
    </Link>
  );
};

export default BookCard;
