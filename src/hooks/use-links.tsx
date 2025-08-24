import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ShortenedLink = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
};

export function useLinks() {
  const ctx = useContext(LinksContext);
  if (!ctx) {
    throw new Error('useLinks must be used within <LinksProvider>');
  }
  return ctx;
}

type LinksContextValue = {
  links: ShortenedLink[];
  addLink: (link: ShortenedLink) => void;
  removeLink: (id: string) => void;
};

const LinksContext = createContext<LinksContextValue | null>(null);

type ProviderProps = {
  initial?: ShortenedLink[];
  children: React.ReactNode;
};

export function LinksProvider({ initial = [], children }: ProviderProps) {
  const [links, setLinks] = useState<ShortenedLink[]>(initial);

  const addLink = useCallback((newLink: ShortenedLink) => {
    setLinks(prev => [...prev, newLink]);
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  }, []);

  const value = useMemo(() => ({ links, addLink, removeLink }), [links, addLink, removeLink]);

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}
