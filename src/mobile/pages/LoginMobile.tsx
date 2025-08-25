import React from 'react';

const LoginMobile: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h1 className="mb-1 text-xl font-semibold">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-neutral-400">Mercatto — Vista móvil</p>

        <form className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-neutral-300">Correo</span>
            <input
              type="email"
              placeholder="tu@correo.com"
              className="h-10 rounded-lg bg-neutral-900 px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary-500"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-neutral-300">Contraseña</span>
            <input
              type="password"
              placeholder="••••••••"
              className="h-10 rounded-lg bg-neutral-900 px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary-500"
            />
          </label>
          <button
            type="button"
            className="mt-2 h-10 rounded-lg bg-primary-600 text-sm font-medium hover:bg-primary-500 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginMobile;


