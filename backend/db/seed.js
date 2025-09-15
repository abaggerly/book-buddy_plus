import db from '#db/client';
import { createBook, getRandomBook } from '#db/queries/booksQueries';
import { createReservationItem } from '#db/queries/reservationItemsQueries';
import { createReservation } from '#db/queries/reservationQueries';
import { createUser } from '#db/queries/userQueries';

const fetchBooks = async () => {
  const res = await fetch(
    'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books'
  );
  const data = res.json();

  return data;
};

const seed = async () => {
  const books = await fetchBooks();

  for (const { title, author, description, coverimage } of books) {
    await createBook(title, author, description, coverimage);
  }

  const user = await createUser(
    'firstname',
    'lastname',
    'email@email.com',
    'password'
  );
  const checkOutDate = new Date();
  const reservation = await createReservation(checkOutDate, user.id);

  for (let i = 0; i < 5; i++) {
    const randomBook = await getRandomBook();

    await createReservationItem(reservation.id, randomBook.id);
  }
};

await db.connect();
await seed();
await db.end();

console.log('🌱 Database seeded.');
