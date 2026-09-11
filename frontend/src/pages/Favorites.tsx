import { useEffect, useState } from 'react';
import { listFavorites, removeFavorite } from '../api';
import { useAuth } from '../auth/AuthContext';
import type { Favorite } from '../types';

export default function Favorites() {
  const { token } = useAuth();
  const [items, setItems] = useState<Favorite[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (token) {
      listFavorites(token)
        .then((result) => setItems(result.items))
        .catch((error) => setMsg(error.message));
    }
  }, [token]);

  async function remove(id: number) {
    if (!token) {
      return;
    }

    await removeFavorite(id, token);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section>
      <h1>Favorites</h1>
      {msg && <p className="message">{msg}</p>}

      <div className="grid">
        {items.map((item) => (
          <article className="card" key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.country}</p>
            <p>{item.temperature ?? '–'} °C</p>
            <button onClick={() => remove(item.id)}>Remove</button>
          </article>
        ))}
      </div>
    </section>
  );
}
