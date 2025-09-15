import { Link, useNavigate } from 'react-router';

import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (FormData) => {
    const email = FormData.get('email');
    const password = FormData.get('password');
    const credentials = {
      email,
      password,
    };

    await login(credentials);

    navigate('/books');
  };

  return (
    <div className='login-container'>
      <h1>Log in to your account</h1>
      <form action={handleLogin}>
        <label>
          Email
          <input type='text' name='email' defaultValue='email@email.com' />
        </label>
        <label>
          Password
          <input type='password' name='password' defaultValue='password' />
        </label>
        <button type='submit'>Login</button>
      </form>
      <Link to='/register'>Need an account? Register here.</Link>
    </div>
  );
};

export default LoginPage;
