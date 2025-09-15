import { useLoaderData } from 'react-router';

import { useState } from 'react';
import BookList from '../../components/books/BookList';
import BookShare from './BookShare';

const BooksPage = () => {
  const booksData = useLoaderData() || [];
  const [searchTerm, setSearchTerm] = useState('');
  const filteredBooks = booksData.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <h1>Catalog</h1>
      <BookShare onSearch={setSearchTerm} />
      <BookList books={filteredBooks} />
    </>
  );
};

export default BooksPage;
