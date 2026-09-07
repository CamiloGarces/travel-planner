import { useState } from 'react';
import { saveFavorite, search } from '../api';
import { useAuth } from '../auth/AuthContext';
import type { Destination } from '../types';

export default function Home() {
  const [query, setQuery] = useState('Bogota');
  const [items, setItems] = useState<Destination[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      setItems((await search(query)).items);
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function fav(destination: Destination) {
    if (!token) {
      return setMsg('Sign in to save favorites.');
    }

    try {
      await saveFavorite(destination, token);
      setMsg(`${destination.name} saved.`);
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'Error');
    }
  }

  return (
    <section>
      <div className="hero">
        <span>React + AWS Serverless</span>
        <h1>Discover your next destination.</h1>
        <p>
          Search a city, view current weather, save favorites and upload travel photos.
        </p>

        <form onSubmit={submit}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tokyo"
          />
          <button disabled={loading || query.trim().length < 2}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>

      {msg && <p className="message">{msg}</p>}

      <div className="grid">
        {items.map((destination) => (
          <article className="card" key={destination.id}>
            <div className="row">
              <div>
                <h2>{destination.name}</h2>
                <p>{destination.country}</p>
              </div>
              <b>{destination.countryCode}</b>
            </div>

            <dl>
              <div>
                <dt>Temperature</dt>
                <dd>{destination.temperature ?? '–'} °C</dd>
              </div>
              <div>
                <dt>Feels like</dt>
                <dd>{destination.apparentTemperature ?? '–'} °C</dd>
              </div>
              <div>
                <dt>Humidity</dt>
                <dd>{destination.humidity ?? '–'}%</dd>
              </div>
              <div>
                <dt>Wind</dt>
                <dd>{destination.windSpeed ?? '–'} km/h</dd>
              </div>
            </dl>

            <button className="secondary" onClick={() => fav(destination)}>
              Save favorite
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
