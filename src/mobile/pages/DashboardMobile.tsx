import React from 'react';
import { Link } from 'react-router-dom';

const DashboardMobile: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <div className="mx-auto max-w-screen-sm px-4 py-6">
        <header className="mb-6">
          <h1 className="text-xl font-semibold">Mercatto — Mobile</h1>
          <p className="text-sm text-neutral-400">Selecciona un módulo para comenzar</p>
        </header>

        <nav className="grid gap-3">
          <Link
            to="/mobile/login"
            className="rounded-lg bg-neutral-800 px-4 py-3 text-sm hover:bg-neutral-700 transition-colors"
          >
            Ir al Login Mobile
          </Link>
          <Link
            to="/dashboard"
            className="rounded-lg bg-neutral-800 px-4 py-3 text-sm hover:bg-neutral-700 transition-colors"
          >
            Volver al Dashboard Web
          </Link>
        </nav>

        <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <h2 className="mb-2 text-base font-medium">Estado</h2>
          <p className="text-sm text-neutral-300">
            Vista móvil base lista. Este módulo es independiente y no modifica componentes web.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DashboardMobile;


