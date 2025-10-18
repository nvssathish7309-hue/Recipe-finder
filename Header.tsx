import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const NavButton: React.FC<{ view: View; label: string }> = ({ view, label }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
        currentView === view
          ? 'bg-emerald-600 text-white cursor-default'
          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
      }`}
      disabled={currentView === view}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight hidden sm:block">
            Recipe Finder
          </h1>
        </div>
        <nav className="flex items-center gap-2">
          <NavButton view={View.SEARCH} label="Search" />
          <NavButton view={View.ADMIN} label="Admin Panel" />
        </nav>
      </div>
    </header>
  );
};

export default Header;
