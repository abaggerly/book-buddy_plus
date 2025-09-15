import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserRouter } from 'react-router';

import bookLoader from './api/loaders/bookLoader';
import booksLoader from './api/loaders/booksLoader';
import userLoader from './api/loaders/userLoader';
import RootLayout from './layouts/RootLayout';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BookPage from './pages/books/BookPage';
import BooksPage from './pages/books/BooksPage';
import NotFoundPage from './pages/NotFoundPage';

const routes = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: BooksPage,
        loader: booksLoader,
      },
      {
        path: 'books',
        Component: BooksPage,
        loader: booksLoader,
      },
      {
        path: 'books/:id',
        Component: BookPage,
        loader: bookLoader,
      },
      {
        path: 'account',
        Component: AccountPage,
        loader: userLoader,
      },
      {
        path: 'register',
        Component: RegisterPage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
];

const App = createBrowserRouter(routes);

export default App;
