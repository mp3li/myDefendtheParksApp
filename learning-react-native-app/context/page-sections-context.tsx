import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type PageSection = {
  id: string;
  label: string;
};

type PageSectionsContextValue = {
  sections: PageSection[];
  setSections: (sections: PageSection[]) => void;
  jumpToSection: (id: string) => void;
  setJumpHandler: (handler: ((id: string) => void) | null) => void;
};

const PageSectionsContext = createContext<PageSectionsContextValue | null>(null);

export function PageSectionsProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [jumpHandler, setJumpHandler] = useState<((id: string) => void) | null>(null);

  const updateJumpHandler = useCallback((handler: ((id: string) => void) | null) => {
    setJumpHandler(() => handler);
  }, []);

  const jumpToSection = useCallback(
    (id: string) => {
      jumpHandler?.(id);
    },
    [jumpHandler]
  );

  const value = useMemo(
    () => ({
      sections,
      setSections,
      jumpToSection,
      setJumpHandler: updateJumpHandler,
    }),
    [jumpToSection, sections, updateJumpHandler]
  );

  return <PageSectionsContext.Provider value={value}>{children}</PageSectionsContext.Provider>;
}

export function usePageSections() {
  const context = useContext(PageSectionsContext);
  if (!context) {
    throw new Error('usePageSections must be used inside PageSectionsProvider');
  }
  return context;
}
