import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { fetchSiteSettings } from '@/lib/api';

type SiteSettings = Record<string, string>;

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: {},
  loading: true,
  refresh: async () => {},
});

export function SiteSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchSiteSettings();
      setSettings(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        refresh: load,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}