import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube, Flame, ExternalLink, Keyboard, Mail, Film } from 'lucide-react';

interface FooterLinkProps {
  title: string;
  items: { label: string; href?: string }[];
}

const FooterLink: React.FC<FooterLinkProps> = ({ title, items }) => (
  <div>
    <h4 className="text-white font-black text-xs uppercase tracking-[0.25em] mb-5 relative">
      {title}
      <span className="absolute -bottom-2 left-0 w-6 h-0.5 bg-blue-600" />
    </h4>
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i}>
          <a 
            href={item.href || '#'} 
            className="text-gray-500 text-xs font-medium uppercase tracking-wider hover:text-blue-400 cursor-pointer transition-all flex items-center gap-2 group"
          >
            <span className="transform group-hover:translate-x-1 transition-transform">{item.label}</span>
            {item.href && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

interface FooterProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Footer: React.FC<FooterProps> = ({ darkMode, onToggleDarkMode }) => {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#020202] border-t border-white/[0.06] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black text-white italic tracking-tighter">CINE<span className="text-blue-500">BLAZE</span></span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-4 max-w-xs">
              Your ultimate destination for discovering movies and TV shows. Stream, explore, and enjoy unlimited entertainment.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-blue-600 transition-all"><Facebook className="w-4 h-4 text-gray-400 hover:text-white" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-pink-600 transition-all"><Instagram className="w-4 h-4 text-gray-400 hover:text-white" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-sky-500 transition-all"><Twitter className="w-4 h-4 text-gray-400 hover:text-white" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-red-600 transition-all"><Youtube className="w-4 h-4 text-gray-400 hover:text-white" /></a>
            </div>
          </div>

          <FooterLink title="Browse" items={[
            { label: 'Trending Movies', href: '/search?q=trending' },
            { label: 'Popular Movies', href: '/movies' },
            { label: 'TV Shows', href: '/tv' },
            { label: 'Top Rated', href: '/awards' },
          ]} />

          <FooterLink title="Genres" items={[
            { label: 'Action', href: '/search?q=action' },
            { label: 'Comedy', href: '/search?q=comedy' },
            { label: 'Horror', href: '/search?q=horror' },
            { label: 'Sci-Fi', href: '/search?q=sci-fi' },
          ]} />

          <FooterLink title="Account" items={[
            { label: 'My Watchlist', href: '/watchlist' },
            { label: 'Sign In' },
            { label: 'Create Account' },
          ]} />

          <FooterLink title="Support" items={[
            { label: 'Help Center' },
            { label: 'Contact Us' },
            { label: 'Terms of Service' },
            { label: 'Privacy Policy' },
          ]} />
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-[10px] font-medium">
            © 2026 CineBlaze. All rights reserved. Powered by <a href="https://www.facebook.com/AUAMANULLAH.OFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Aman Ullah</a>.
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-[10px]">
            <span className="flex items-center gap-1"><Film className="w-3 h-3" /> CineBlaze v2.0</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1"><Keyboard className="w-3 h-3" /> Keyboard shortcuts: / search, H home, Esc close</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;