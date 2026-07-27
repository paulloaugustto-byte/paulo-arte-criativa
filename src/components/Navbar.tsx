import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  Store,
  User,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

const links = [
  { to: '/', label: 'Início' },
  { to: '/arquivos-digitais', label: 'Arquivos Digitais' },
  { to: '/galeria', label: 'Galeria' },
  { to: '/sobre', label: 'Quem Somos' },
  { to: '/contato', label: 'Contato' },
];

const productCategories = [
  {
    label: 'Sacolas Personalizadas',
    category: 'Sacolas Personalizadas',
  },
  {
    label: 'Canecas',
    category: 'Canecas',
  },
  {
    label: 'Topos de Bolo',
    category: 'Topos de Bolo',
  },
  {
    label: 'Kits Festa',
    category: 'Kits Presente',
  },
  {
    label: 'Lembrancinhas',
    category: 'Lembrancinhas',
  },
  {
    label: 'Caixas para Presente',
    category: 'Caixas para Caneca',
  },
  {
    label: 'Adesivos',
    category: 'Adesivos',
  },
];

export default function Navbar() {
  const { favorites, cartCount } = useStore();
  const { user, signOut } = useAuth();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuRef = useRef<HTMLDivElement>(null);
  const productsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const openProductsMenu = () => {
    if (productsCloseTimer.current) {
      clearTimeout(productsCloseTimer.current);
    }

    setProductsMenuOpen(true);
  };

  const closeProductsMenu = () => {
    if (productsCloseTimer.current) {
      clearTimeout(productsCloseTimer.current);
    }

    productsCloseTimer.current = setTimeout(() => {
      setProductsMenuOpen(false);
    }, 350);
  };

  const storedName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    '';

  const displayName = storedName.trim()
    ? storedName.trim().split(/\s+/)[0]
    : 'Paulo';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target as Node)
      ) {
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (productsCloseTimer.current) {
        clearTimeout(productsCloseTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearch(false);
    setMobileProductsOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  const transparentMobileHeader =
    isHome && !scrolled && !open && !search;

  const mobileIconClasses = transparentMobileHeader
    ? 'text-white drop-shadow-[0_1px_4px_rgba(24,46,82,0.45)] hover:bg-white/15 lg:text-brand-600 lg:drop-shadow-none lg:hover:bg-nude-100'
    : 'text-brand-600 hover:bg-nude-100';

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);

    setSearch(false);
    setQuery('');
  };

  const handleSignOut = async () => {
    setAdminMenuOpen(false);
    setOpen(false);

    await signOut();

    navigate('/');
  };

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileProductsOpen(false);
  };

  return (
    <header
      className={`top-0 z-50 transition-all duration-300 ${
        transparentMobileHeader
          ? 'absolute inset-x-0 border-transparent bg-transparent shadow-none backdrop-blur-none lg:sticky lg:border-b lg:border-nude-200/60 lg:bg-white/95 lg:shadow-[0_3px_16px_rgba(24,46,82,0.06)] lg:backdrop-blur-xl'
          : 'sticky border-b border-nude-200/60 bg-white/95 shadow-[0_3px_16px_rgba(24,46,82,0.06)] backdrop-blur-xl'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        {/* MENU DESKTOP */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'text-brand-600 hover:bg-nude-100 hover:text-brand-700'
              }`
            }
          >
            Início
          </NavLink>

          <div
            className="relative"
            onMouseEnter={openProductsMenu}
            onMouseLeave={closeProductsMenu}
          >
            <button
              type="button"
              onClick={() =>
                setProductsMenuOpen((value) => !value)
              }
              aria-expanded={productsMenuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-brand-600 transition-all duration-300 hover:bg-nude-100 hover:text-brand-700"
            >
              Produtos

              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  productsMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {productsMenuOpen && (
              <div
                role="menu"
                onMouseEnter={openProductsMenu}
                onMouseLeave={closeProductsMenu}
                className="absolute left-0 top-[calc(100%-2px)] z-50 w-72 rounded-3xl border border-nude-200 bg-white p-3 shadow-xl"
              >
                <div className="px-3 pb-2 pt-1">
                  <p className="font-display text-lg font-semibold text-brand-700">
                    Produtos
                  </p>

                  <p className="mt-1 text-xs text-brand-400">
                    Escolha uma categoria
                  </p>
                </div>

                <div className="border-t border-nude-100 pt-2">
                  {productCategories.map((item) => (
                    <Link
                      key={item.label}
                      to={`/catalogo?cat=${encodeURIComponent(
                        item.category,
                      )}`}
                      role="menuitem"
                      onClick={() =>
                        setProductsMenuOpen(false)
                      }
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-nude-100 hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/catalogo"
                  onClick={() =>
                    setProductsMenuOpen(false)
                  }
                  className="mt-2 block rounded-xl bg-brand-500 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Ver catálogo completo
                </Link>
              </div>
            )}
          </div>

          {links.slice(1).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'text-brand-600 hover:bg-nude-100 hover:text-brand-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* BOTÃO DO MENU CELULAR */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          className={`rounded-full p-2.5 transition-colors lg:hidden ${mobileIconClasses}`}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* AÇÕES DO LADO DIREITO */}
        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => setSearch((value) => !value)}
            aria-label="Buscar"
            className={`rounded-full p-2.5 transition-colors ${mobileIconClasses}`}
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className={`relative rounded-full p-2.5 transition-colors ${mobileIconClasses}`}
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
            className={`relative rounded-full p-2.5 transition-colors ${mobileIconClasses}`}
          >
            <ShoppingBag className="h-5 w-5" />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {!user && (
            <Link
              to="/login"
              aria-label="Entrar"
              className="hidden items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-700 sm:flex"
            >
              <User className="h-5 w-5" />
              Entrar
            </Link>
          )}

          {user && (
            <div
              ref={adminMenuRef}
              className="relative hidden sm:block"
            >
              <button
                type="button"
                onClick={() =>
                  setAdminMenuOpen((value) => !value)
                }
                aria-expanded={adminMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-700"
              >
                <User className="h-5 w-5" />

                <span className="max-w-28 truncate">
                  {displayName}
                </span>

                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    adminMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {adminMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-nude-200 bg-white p-2 shadow-xl"
                >
                  <div className="border-b border-nude-100 px-3 py-3">
                    <p className="truncate text-sm font-semibold text-brand-700">
                      {displayName}
                    </p>

                    <p className="mt-1 truncate text-xs text-brand-400">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/admin/painel"
                    role="menuitem"
                    onClick={() =>
                      setAdminMenuOpen(false)
                    }
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-nude-100"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Administração
                  </Link>

                  <Link
                    to="/"
                    role="menuitem"
                    onClick={() =>
                      setAdminMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-nude-100"
                  >
                    <Store className="h-4 w-4" />
                    Ver Loja
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* CAMPO DE BUSCA */}
      {search && (
        <div className="border-t border-nude-200/60 bg-white/95 backdrop-blur">
          <form
            onSubmit={submitSearch}
            className="container-page py-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-nude-400" />

              <input
                autoFocus
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Buscar por produto, categoria ou data comemorativa..."
                className="input pl-12"
              />
            </div>
          </form>
        </div>
      )}

      {/* MENU CELULAR */}
      {open && (
        <div className="border-t border-nude-200/60 bg-white lg:hidden">
          <div className="container-page flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto py-4">
            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-brand-600 hover:bg-nude-100'
                }`
              }
            >
              Início
            </NavLink>

            <button
              type="button"
              onClick={() =>
                setMobileProductsOpen((value) => !value)
              }
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium text-brand-600 transition-colors hover:bg-nude-100"
            >
              Produtos

              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  mobileProductsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileProductsOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l-2 border-nude-200 pl-3">
                {productCategories.map((item) => (
                  <Link
                    key={item.label}
                    to={`/catalogo?cat=${encodeURIComponent(
                      item.category,
                    )}`}
                    onClick={closeMobileMenu}
                    className="rounded-xl px-3 py-2.5 text-sm text-brand-500 transition-colors hover:bg-nude-100 hover:text-brand-700"
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  to="/catalogo"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-nude-100"
                >
                  Ver catálogo completo
                </Link>
              </div>
            )}

            {links.slice(1).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'text-brand-600 hover:bg-nude-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {!user && (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="mt-3 flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
              >
                <User className="h-5 w-5" />
                Entrar
              </Link>
            )}

            {user && (
              <div className="mt-3 border-t border-nude-200 pt-3">
                <div className="px-4 pb-3">
                  <p className="truncate text-sm font-semibold text-brand-700">
                    {displayName}
                  </p>

                  <p className="mt-1 truncate text-xs text-brand-400">
                    {user.email}
                  </p>
                </div>

                <Link
                  to="/admin/painel"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Administração
                </Link>

                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="mt-1 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-brand-600 transition-colors hover:bg-nude-100"
                >
                  <Store className="h-5 w-5" />
                  Ver Loja
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-1 flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}