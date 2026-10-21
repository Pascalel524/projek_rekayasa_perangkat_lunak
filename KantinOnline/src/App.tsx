import React, { useState } from 'react';
import { loginUser, registerUser } from './auth';

type AuthMode = 'login' | 'register';

type FormState = {
  email: string;
  password: string;
  confirmPassword: string;
};

const emptyForm: FormState = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function App() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (message) {
      setMessage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const email = form.email.trim();
    const password = form.password;

    if (mode === 'register') {
      if (form.confirmPassword !== password) {
        setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
        setIsSubmitting(false);
        return;
      }

      const result = await registerUser(email, password);

      if (!result.ok) {
        setMessage({ type: 'error', text: result.error.message });
        setIsSubmitting(false);
        return;
      }

      setMessage({ type: 'success', text: `Pendaftaran berhasil untuk ${result.data.email}.` });
      setForm({ ...emptyForm });
      setMode('login');
      setIsSubmitting(false);
      return;
    }

    const result = await loginUser(email, password);

    if (!result.ok) {
      setMessage({ type: 'error', text: result.error.message });
      setIsSubmitting(false);
      return;
    }

    setLoggedInUser(result.data.email);
    setMessage({ type: 'success', text: `Login berhasil. Selamat datang, ${result.data.email}.` });
    setForm({ ...emptyForm });
    setIsSubmitting(false);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">K</div>
          <div>
            <p className="eyebrow">KantinOnline</p>
            <h1>{mode === 'login' ? 'Masuk ke akun' : 'Buat akun baru'}</h1>
          </div>
        </div>

        <div className="auth-toggle" aria-label="Mode autentikasi">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {loggedInUser ? (
          <div className="auth-status success">
            <strong>Berhasil login</strong>
            <p>{loggedInUser}</p>
            <button type="button" onClick={() => setLoggedInUser(null)} className="secondary-button">
              Keluar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder="nama@student.pradita.ac.id"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={updateField('password')}
                placeholder="Minimal 6 karakter"
                required
              />
            </label>

            {mode === 'register' && (
              <label>
                Konfirmasi Password
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                  placeholder="Ulangi password"
                  required
                />
              </label>
            )}

            {message && (
              <div className={`auth-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
