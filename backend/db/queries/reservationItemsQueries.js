import db from '#db/client';

/**
 * @param {number} bookId
 * @method GET
 * @route /books/:id/reservations
 */
export const getReservationByBookId = async (bookId) => {
  const sql = `
    SELECT
      *
    FROM
      reservation_items
      JOIN books ON books.id = reservation_items.book_id
    WHERE
      books.id = $1
  `;
  const { rows } = await db.query(sql, [bookId]);

  return rows[0];
};

export const getReservationsByItem = async (userId, bookId) => {
  const sql = `
    SELECT
      *
    FROM
      reservation_items
      JOIN reservations ON reservations.id = reservation_items.reservation_id
    WHERE
      reservations.user_id = $1 and reservation_items.book_id=$2
  `;
  const { rows } = await db.query(sql, [userId, bookId]);

  return rows[0];
};

/**
 * @param {number} reservationId
 * @method GET
 * @route /reservations/:id/books
 */
export const getBooksByReservationId = (reservationId) => {
  const sql = `
    SELECT
      *
    FROM
      reservation_items
      JOIN reservations ON reservations.id = reservation_items.reservation_id
    WHERE
      reservations.id = $1
  `;
  const { rows } = db.query(sql, [reservationId]);

  return rows[0];
};

export const getReservationItemsByUserId = async (userId) => {
  const sql = `
    SELECT
      books.*, reservations.check_out, reservations.check_in
    FROM
      users
      JOIN reservations ON users.id = reservations.user_id
      JOIN reservation_items ON reservations.id = reservation_items.reservation_id
      JOIN books ON reservation_items.book_id = books.id
    WHERE
      users.id = $1;
  `;
  const { rows } = await db.query(sql, [userId]);

  return rows;
};

export const checkReservationStatus = async (bookId) => {
  const sql = `
    SELECT
      *
    FROM
      reservation_items
    WHERE
      book_id = $1;
  `;
  const { rows } = await db.query(sql, [bookId]);
  if (!rows || rows.length === 0) return false;

  return true;
};

/**
 * Seeding function.
 * @param {number} reservationId
 * @param {number} bookId
 * @method POST
 */
export const createReservationItem = async (reservationId, bookId) => {
  const sql = `
    INSERT INTO
      reservation_items (reservation_id, book_id)
    VALUES
      ($1, $2)
    RETURNING
      *
  `;
  const { rows } = await db.query(sql, [reservationId, bookId]);

  return rows[0];
};
