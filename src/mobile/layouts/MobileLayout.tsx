import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MobileLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-screen-sm items-center justify-between px-4">
          <Link to="/mobile" className="text-sm font-semibold">Mercatto</Link>
          <nav className="flex items-center gap-3 text-xs text-neutral-300">
            <Link to="/mobile" className="hover:text-white">Inicio</Link>
            <Link to="/mobile/login" className="hover:text-white">Login</Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mx-auto max-w-screen-sm px-4 py-6 text-center text-xs text-neutral-500">
        © Mercatto — Vista móvil
      </footer>
    </div>
  );
};

export default MobileLayout;


