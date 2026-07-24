import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

const links = [
  { to: '/', label: 'Início' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/arquivos-digitais', label: 'Arquivos Digitais' },
  { to: '/galeria', label: 'Galeria' },
  { to: '/sobre', label: 'Quem Somos' },
  { to: '/contato', label: 'Contato' },
];

export default function Navbar() {
  const { favorites, cartCount } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);
    setSearch(false);
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-nude-200/60 bg-cream-100/85 backdrop-blur-xl">
      <nav className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-rose-400 font-display text-xl font-semibold text-white shadow-soft transition-transform hover:scale-105">
            P
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-lg font-semibold text-brand-700">
              Paulo Arte Criativa
            </span>
            <span className="font-script text-sm text-rose-500">Transformando papel em emoções</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-soft'
                    : 'text-brand-600 hover:bg-nude-100 hover:text-brand-700'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearch((s) => !s)}
            aria-label="Buscar"
            className="rounded-full p-2.5 text-brand-500 transition-colors hover:bg-nude-100"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative rounded-full p-2.5 text-brand-500 transition-colors hover:bg-nude-100"
          >
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
          <Link
            to="/carrinho"
            aria-label="Carrinho"
            className="relative rounded-full p-2.5 text-brand-500 transition-colors hover:bg-nude-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="rounded-full p-2.5 text-brand-500 transition-colors hover:bg-nude-100 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {search && (
        <div className="border-t border-nude-200/60 bg-cream-100/95 backdrop-blur">
          <form onSubmit={submitSearch} className="container-page py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-nude-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por produto, categoria ou data comemorativa..."
                className="input pl-12"
              />
            </div>
          </form>
        </div>
      )}

      {open && (
        <div className="border-t border-nude-200/60 bg-cream-100 lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-500 text-white'
                      : 'text-brand-600 hover:bg-nude-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
