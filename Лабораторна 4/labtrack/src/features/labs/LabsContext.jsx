import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { load, save } from '../../shared/lib/storage';
import { useAuth } from '../auth/AuthContext';

const LabsContext = createContext(null);

export function LabsProvider({ children }) {
  const { user } = useAuth();
  const key = user ? `labtrack.labs.${user.email}` : null;
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    setLabs(key ? load(key, []) : []);
  }, [key]);

  const commit = useCallback(
    (next) => {
      setLabs(next);
      if (key) save(key, next);
    },
    [key],
  );

  const value = useMemo(
    () => ({
      labs,
      addLab: (lab) => commit([...labs, { ...lab, id: crypto.randomUUID() }]),
      updateLab: (id, patch) =>
        commit(labs.map((l) => (l.id === id ? { ...l, ...patch } : l))),
      removeLab: (id) => commit(labs.filter((l) => l.id !== id)),
    }),
    [labs, commit],
  );

  return <LabsContext.Provider value={value}>{children}</LabsContext.Provider>;
}

export function useLabs() {
  const ctx = useContext(LabsContext);
  if (!ctx) throw new Error('useLabs потрібно використовувати всередині LabsProvider');
  return ctx;
}
