import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (value: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const KEY = 'travelPlanner.idToken';

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setState] = useState<string | null>(() => localStorage.getItem(KEY));

  const setToken = (value: string) => {
    localStorage.setItem(KEY, value);
    setState(value);
  };

  const signOut = () => {
    localStorage.removeItem(KEY);
    setState(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, setToken, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthProvider missing');
  }

  return context;
}

