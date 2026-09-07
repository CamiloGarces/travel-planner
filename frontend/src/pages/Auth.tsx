import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { confirm, signIn, signUp } from '../auth/cognito';

export default function Auth() {
  const { isAuthenticated, setToken } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'confirm'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMsg('');

    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setMode('confirm');
        return setMsg('Check your email for the verification code.');
      }

      if (mode === 'confirm') {
        await confirm(email, code);
        setMode('signin');
        return setMsg('Account confirmed. Sign in.');
      }

      setToken(await signIn(email, password));
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'Authentication failed');
    }
  }

  return (
    <form className="auth" onSubmit={submit}>
      <h1>{mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Confirm account'}</h1>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      {mode !== 'confirm' && (
        <label>
          Password
          <input
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
      )}

      {mode === 'confirm' && (
        <label>
          Verification code
          <input value={code} onChange={(event) => setCode(event.target.value)} required />
        </label>
      )}

      <button>{mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Register' : 'Confirm'}</button>

      {msg && <p className="message">{msg}</p>}

      <button
        type="button"
        className="link"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
      >
        {mode === 'signin' ? 'Need an account?' : 'Back to sign in'}
      </button>
    </form>
  );
}
