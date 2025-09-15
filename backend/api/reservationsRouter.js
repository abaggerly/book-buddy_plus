import express from 'express';

import { createReservationItem } from '#db/queries/reservationItemsQueries';
import {
  createReservation,
  getReservationById,
  getReservationsByUserId,
  updateReservation,
} from '#db/queries/reservationQueries';
import requireBody from '#middleware/requireBody';
import requireUser from '#middleware/requireUser';

const router = express.Router();

router.use(requireUser);

/**
 * @method GET
 * @route /reservations
 */
router.get('/', async (req, res) => {
  const reservations = await getReservationsByUserId(req.user.id);

  return res.send(reservations);
});

/**
 * @method POST
 * @route /reservations
 */
router.post('/', requireBody(['bookId']), async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;
  const checkOutDate = new Date();
  const newReservation = await createReservation(checkOutDate, userId);

  await createReservationItem(newReservation.id, bookId);

  return res.status(201).send(newReservation);
});

/**
 * @method GET
 * @route /reservations/:id
 */
router.get('/:id', async (req, res) => {
  const reservation = await getReservationById(req.params.id);
  if (!reservation) return res.status(400).send('Reservation not found.');
  if (reservation.userId !== req.user.id)
    return res.status(403).send('Forbidden');

  return res.send(reservation);
});

// add multiple books to the reservation
router.post('/:id/books', requireBody(['bookId']), async (req, res) => {
  const { bookId } = req.body;
  const reservation = await getReservationById(req.params.id);
  if (!reservation) return res.status(400).send('Reservation not found.');

  if (reservation.user_id !== req.user.id)
    return res.status(403).send('Forbidden');

  const itemBook = await createReservationItem(req.params.id, bookId);

  return res.status(201).send(itemBook);
});

// GET /api/reservations/history
router.get('/history', async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT r.id AS reservation_id, r.check_in, r.check_out, (r.check_out IS NULL) AS active,
             ri.id AS reservation_item_id, b.id AS book_id, b.title, b.author, b.description, b.cover_image
      FROM reservations r
      JOIN reservation_items ri ON ri.reservation_id = r.id
      JOIN books b ON b.id = ri.book_id
      WHERE r.user_id = $1
      ORDER BY (r.check_out IS NULL) DESC, COALESCE(r.check_out, r.check_in) DESC, r.id DESC
      `,
      [req.user.id]
    );

    return res.send(rows);
  } catch (err) {
    console.error('GET /reservations/history error', err);
    return res.status(500).send('Server error.');
  }
});

router.put('/reservations/:id', async (req, res) => {
  await updateReservation(req.user.id);
});

export default router;
