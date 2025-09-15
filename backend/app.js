import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import booksRouter from '#api/booksRouter';
import reservationsRouter from '#api/reservationsRouter';
import usersRouter from '#api/usersRouter';
import errorHandler from '#middleware/errorHandler';
import getUserFromToken from '#middleware/getUserFromToken';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan('dev'));

app.use(getUserFromToken);

app.use('/books', booksRouter);
app.use('/users', usersRouter);
app.use('/reservations', reservationsRouter);

app.use(errorHandler);

export default app;
