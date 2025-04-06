'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextType {
  isNavbarOpen: boolean;
  setNavbarOpen: (open: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [isNavbarOpen, setNavbarOpen] = useState(false);

  return (
    <NavbarContext.Provider value={{ isNavbarOpen, setNavbarOpen }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarState() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbarState must be used within a NavbarProvider');
  }
  return context;
}
