import { useState } from 'react';
import '../../index.css';

export default function BookShare({ onSearch }) {
  const [booksData, setSearchBook] = useState('');
  //charge the list automatic depending of the word that user wrote
  const chargingList = (event) => {
    const value = event.target.value;
    setSearchBook(value);
    onSearch(value.trim());
  };

  const search = (event) => {
    event.preventDefault();
    onSearch(booksData.trim());
  };

  return (
    <form className='form-inline search-bar' onSubmit={search}>
      <input
        className='form-control mr-sm-2'
        type='search'
        placeholder='Search for a book...'
        value={booksData}
        onChange={chargingList}
      />
    </form>
  );
}
