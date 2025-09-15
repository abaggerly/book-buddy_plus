import express from 'express';

import { createBook, getBookById, getBooks } from '#db/queries/booksQueries';
import {
  checkReservationStatus,
  getReservationByBookId,
  getReservationsByItem,
} from '#db/queries/reservationItemsQueries';
import requireBody from '../middleware/requireBody.js';
import requireUser from '../middleware/requireUser.js';

const router = express.Router();

/**
 * @method
 * @route /books
 */

router.route('/').get(async (req, res) => {
  const books = await getBooks();

  return res.status(200).send(books);
});

router
  .route('/')
  .post(
    requireBody(['title', 'author', 'description', 'coverImage']),
    async (req, res) => {
      const { title, author, description, coverImage } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).send('Unauthorized.');

      const books = await createBook(
        title,
        author,
        description,
        coverImage,
        userId
      );
      res.status(201).send(books);
    }
  );

router.param('id', async (req, res, next, id) => {
  const book = await getBookById(id);
  if (!book) return res.status(403).send('Book not found.');

  req.book = book;

  next();
});

router.route('/:id').get(async (req, res) => {
  const { id } = req.book;
  const reservationStatus = await checkReservationStatus(id);
  const bookObj = { ...req.book, isReserved: reservationStatus };

  return res.status(201).send(bookObj);
});

router.get('/:id/reservations', requireUser, async (req, res) => {
  if (!req.params.id) return res.status(401).send('Invalid Book ID...');

  const reservations = await getReservationsByItem(req.user.id, req.params.id);

  if (req.user.id !== reservations.user_id)
    return res.status(403).send('You are not authorized to be here!');

  const bookReservations = await getReservationByBookId(req.params.id);

  return res.send(bookReservations);
});

router.get('/:id/status', async (req, res) => {
  const { id } = req.book;
  const reservationStatus = await checkReservationStatus(id);

  return res.send({ isReserved: reservationStatus });
});

export default router;
