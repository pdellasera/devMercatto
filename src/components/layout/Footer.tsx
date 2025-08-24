import React from 'react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Logo size="md" showText={true} />
            <p className="mt-4 text-sm text-text-secondary max-w-md">
              Plataforma líder en scouting deportivo. Conectamos talentos con oportunidades 
              para maximizar el potencial de cada atleta.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Prospectos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Scouts</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>info@mercatto.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Madrid, España</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-text-secondary">
              © 2024 Mercatto. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                Términos
              </a>
              <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
