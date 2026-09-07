import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import Auth from './pages/Auth';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Upload from './pages/Upload';

function Guard({ children }: { children: React.ReactNode }) {
  return useAuth().isAuthenticated ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <>
      <header>
        <NavLink className="brand" to="/">
          Travel Planner
        </NavLink>
        <nav>
          <NavLink to="/">Explore</NavLink>
          <NavLink to="/favorites">Favorites</NavLink>
          <NavLink to="/upload">Upload</NavLink>
          {isAuthenticated ? (
            <button className="link" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <NavLink to="/auth">Sign in</NavLink>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/favorites"
            element={
              <Guard>
                <Favorites />
              </Guard>
            }
          />
          <Route
            path="/upload"
            element={
              <Guard>
                <Upload />
              </Guard>
            }
          />
        </Routes>
      </main>
    </>
  );
}
