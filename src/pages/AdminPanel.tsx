import { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard, Package, Tags, CalendarDays, Image as ImageIcon,
  Star, Users, LogOut, Plus, Pencil, Trash2, X, Loader2,
  Ticket, Settings, FileText, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { commemorativeDates } from '@/data/catalog';
import {
  fetchProducts, createProduct, updateProduct, deleteProduct,
  fetchAllCategories, createCategory, deleteCategory,
  fetchOrders, updateOrderStatus,
  fetchCustomers,
  fetchReviews, createReview, deleteReview,
  fetchCoupons, createCoupon, deleteCoupon,
  fetchAllDigitalFiles, createDigitalFile, updateDigitalFile, deleteDigitalFile,
  fetchSiteSettings, updateSiteSetting,
  type ProductRow, type CategoryRow, type OrderRow, type CustomerRow,
  type ReviewRow, type CouponRow, type DigitalFileRow,
} from '@/lib/api';
import type { Badge } from '@/lib/types';
import ImageUploader, { type UploadedImage } from '@/components/ImageUploader';

type Tab = 'dashboard' | 'products' | 'categories' | 'dates' | 'orders' | 'reviews' | 'coupons' | 'digital' | 'settings';

const badgeLabels: Record<string, string> = {
  destaque: 'Favorito dos Clientes',
  mais_vendido: 'Mais Vendido',
  novo: 'Novo',
  promocao: 'Promoção',
};

export default function AdminPanel() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [productList, setProductList] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [digitalFiles, setDigitalFiles] = useState<DigitalFileRow[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats, ords, custs, revs, cpns, dfs, sts] = await Promise.all([
        fetchProducts(true).catch(() => []),
        fetchAllCategories().catch(() => []),
        fetchOrders().catch(() => []),
        fetchCustomers().catch(() => []),
        fetchReviews().catch(() => []),
        fetchCoupons().catch(() => []),
        fetchAllDigitalFiles().catch(() => []),
        fetchSiteSettings().catch(() => ({})),
      ]);
      setProductList(prods as ProductRow[]);
      setCategories(cats as CategoryRow[]);
      setOrders(ords as OrderRow[]);
      setCustomers(custs as CustomerRow[]);
      setReviews(revs as ReviewRow[]);
      setCoupons(cpns as CouponRow[]);
      setDigitalFiles(dfs as DigitalFileRow[]);
      setSettings(sts as Record<string, string>);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const logout = async () => { await signOut(); navigate('/login'); };

  const handleProductSave = async (data: ProductFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        category: data.category,
        commemorative: data.commemorative,
        price: data.price,
        original_price: data.original_price || null,
        images: data.images.map((img) => img.url),
        featured: data.badge === 'destaque',
        badge: data.badge,
        is_active: data.is_active,
        keywords: data.keywords,
      };
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload as Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>);
      }
      await loadAll();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert('Erro ao salvar: ' + (err as Error).message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    try { await deleteProduct(id); await loadAll(); }
    catch (err) { alert('Erro ao excluir: ' + (err as Error).message); }
  };

  const stats = [
    { label: 'Produtos', value: productList.length, icon: Package, color: 'bg-rose-100 text-rose-600' },
    { label: 'Categorias', value: categories.length, icon: Tags, color: 'bg-brand-100 text-brand-600' },
    { label: 'Pedidos', value: orders.length, icon: LayoutDashboard, color: 'bg-amber-100 text-amber-600' },
    { label: 'Clientes', value: customers.length, icon: Users, color: 'bg-emerald-100 text-emerald-600' },
  ];

  const menu: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'categories', label: 'Categorias', icon: Tags },
    { id: 'dates', label: 'Datas comemorativas', icon: CalendarDays },
    { id: 'orders', label: 'Pedidos', icon: ChevronRight },
    { id: 'reviews', label: 'Depoimentos', icon: Star },
    { id: 'coupons', label: 'Cupons', icon: Ticket },
    { id: 'digital', label: 'Arquivos digitais', icon: FileText },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-700">Painel Administrativo</h1>
          <p className="text-sm text-brand-400">{user?.email ?? 'Paulo Arte Criativa'}</p>
        </div>
        <button onClick={logout} className="btn-outline">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-3">
          <nav className="flex flex-col gap-1">
            {menu.map((m) => (
              <button
                key={m.id}
                onClick={() => setTab(m.id)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === m.id ? 'bg-brand-500 text-white' : 'text-brand-600 hover:bg-nude-100'
                }`}
              >
                <m.icon className="h-4 w-4" />
                {m.label}
              </button>
            ))}
          </nav>
        </aside>

        <main>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-rose-400" /></div>
          ) : (
            <>
              {tab === 'dashboard' && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {stats.map((s) => (
                    <div key={s.label} className="card p-6">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${s.color}`}>
                        <s.icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 font-display text-3xl font-semibold text-brand-700">{s.value}</p>
                      <p className="text-sm text-brand-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'products' && (
                <ProductsTab
                  products={productList}
                  categories={categories}
                  onNew={() => { setEditingProduct(null); setShowProductForm(true); }}
                  onEdit={(p) => { setEditingProduct(p); setShowProductForm(true); }}
                  onDelete={handleDeleteProduct}
                />
              )}

              {tab === 'categories' && (
                <CategoriesTab categories={categories} onReload={loadAll} />
              )}

              {tab === 'dates' && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-brand-700">Datas comemorativas</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {commemorativeDates.map((d) => (
                      <div key={d} className="card flex items-center justify-between p-4">
                        <span className="text-brand-700">{d}</span>
                        <CalendarDays className="h-4 w-4 text-rose-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'orders' && <OrdersTab orders={orders} onReload={loadAll} />}
              {tab === 'reviews' && <ReviewsTab reviews={reviews} onReload={loadAll} />}
              {tab === 'coupons' && <CouponsTab coupons={coupons} onReload={loadAll} />}
              {tab === 'digital' && <DigitalTab files={digitalFiles} onReload={loadAll} />}
              {tab === 'settings' && <SettingsTab settings={settings} />}
            </>
          )}
        </main>
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          categories={categories.map((c) => c.name)}
          onSave={handleProductSave}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}

// ============ PRODUCTS TAB ============

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  commemorative: string[];
  price: number;
  original_price: number | null;
  images: UploadedImage[];
  badge: Badge;
  is_active: boolean;
  keywords: string[];
}

function ProductsTab({ products, categories, onNew, onEdit, onDelete }: {
  products: ProductRow[];
  categories: CategoryRow[];
  onNew: () => void;
  onEdit: (p: ProductRow) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-brand-700">Produtos ({products.length})</h2>
        <button onClick={onNew} className="btn-rose"><Plus className="h-4 w-4" /> Novo produto</button>
      </div>
      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <div key={p.id} className="card flex items-center gap-4 p-4">
            <img src={p.images[0] || ''} alt={p.name} className="h-16 w-16 rounded-2xl object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-brand-700">{p.name}</p>
                {p.badge && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-600">
                    {badgeLabels[p.badge] || p.badge}
                  </span>
                )}
                {!p.is_active && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">Inativo</span>
                )}
              </div>
              <p className="text-sm text-brand-400">
                {p.category} · R$ {p.price.toFixed(2)}
                {p.original_price && ` (era R$ ${p.original_price.toFixed(2)})`}
              </p>
            </div>
            <button onClick={() => onEdit(p)} className="rounded-full p-2 text-brand-500 hover:bg-nude-100">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(p.id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-100">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div className="card p-8 text-center text-brand-400">
            <Package className="mx-auto h-10 w-10 text-rose-400" />
            <p className="mt-4">Nenhum produto cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ PRODUCT FORM ============

function ProductForm({ product, categories, onSave, onClose }: {
  product: ProductRow | null;
  categories: string[];
  onSave: (data: ProductFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    category: product?.category ?? categories[0] ?? 'Caixas Explosão',
    commemorative: product?.commemorative ?? [],
    price: product?.price ?? 0,
    original_price: product?.original_price ?? null,
    images: (product?.images ?? []).map((url: string, i: number) => ({
      url,
      thumbnailUrl: url,
      isMain: i === 0,
    })),
    badge: product?.badge ?? null,
    is_active: product?.is_active ?? true,
    keywords: product?.keywords ?? [],
  });
  const [keywordInput, setKeywordInput] = useState('');
  const tempId = product?.id ?? `temp-${Date.now()}`;

  const toggleCommemorative = (d: string) => {
    setForm((f) => ({
      ...f,
      commemorative: f.commemorative.includes(d)
        ? f.commemorative.filter((x) => x !== d)
        : [...f.commemorative, d],
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setForm((f) => ({ ...f, keywords: [...f.keywords, keywordInput.trim()] }));
      setKeywordInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/60 p-4 backdrop-blur">
      <div className="card max-h-[92vh] w-full max-w-2xl overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-brand-700">
            {product ? 'Editar produto' : 'Novo produto'}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-nude-100"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="mt-4 space-y-5">
          {/* IMAGES */}
          <ImageUploader
            productId={tempId}
            images={form.images}
            onChange={(images) => setForm((f) => ({ ...f, images }))}
          />

          {/* NAME */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">Nome</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">Descrição</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
          </div>

          {/* CATEGORY + PRICE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-600">Categoria</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-600">Preço (R$)</label>
              <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="input" />
            </div>
          </div>

          {/* ORIGINAL PRICE (for promo) */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">Preço original (para promoção)</label>
            <input type="number" step="0.01" value={form.original_price ?? ''} onChange={(e) => setForm({ ...form, original_price: e.target.value ? parseFloat(e.target.value) : null })} className="input" placeholder="Deixe vazio se não houver promoção" />
          </div>

          {/* BADGE */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">Selo do produto</label>
            <p className="mb-3 text-xs leading-relaxed text-brand-400">
              Marque <strong>Favorito dos Clientes</strong> para exibir este produto na página inicial.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: null, label: 'Nenhum' },
                { value: 'destaque', label: '⭐ Favorito dos Clientes' },
                { value: 'mais_vendido', label: 'Mais Vendido' },
                { value: 'novo', label: 'Novo' },
                { value: 'promocao', label: 'Promoção' },
              ].map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setForm({ ...form, badge: b.value as Badge })}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    form.badge === b.value ? 'bg-brand-500 text-white' : 'bg-nude-100 text-brand-600 hover:bg-nude-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* COMMEMORATIVE */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">Datas comemorativas</label>
            <div className="flex flex-wrap gap-2">
              {commemorativeDates.map((d) => {
                const active = form.commemorative.includes(d);
                return (
                  <button key={d} type="button" onClick={() => toggleCommemorative(d)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      active ? 'bg-brand-500 text-white' : 'bg-nude-100 text-brand-600'
                    }`}>
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* KEYWORDS */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">Palavras-chave (para busca)</label>
            <div className="flex gap-2">
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                placeholder="Digite e pressione Enter"
                className="input flex-1"
              />
            </div>
            {form.keywords.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.keywords.map((k, i) => (
                  <span key={i} className="rounded-full bg-rose-100 px-3 py-1 text-xs text-rose-600">
                    {k}
                    <button type="button" onClick={() => setForm({ ...form, keywords: form.keywords.filter((_, j) => j !== i) })} className="ml-1">
                      <X className="inline h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE TOGGLE */}
          <label className="flex items-center gap-3 rounded-2xl bg-nude-100 px-4 py-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-5 w-5 rounded border-nude-300 text-rose-500 focus:ring-rose-400"
            />
            <span className="text-sm font-medium text-brand-600">
              {form.is_active ? 'Produto ativo (visível no site)' : 'Produto inativo (oculto no site)'}
            </span>
          </label>

          <button type="submit" className="btn-rose w-full">Salvar produto</button>
        </form>
      </div>
    </div>
  );
}

// ============ CATEGORIES TAB ============

function CategoriesTab({ categories, onReload }: { categories: CategoryRow[]; onReload: () => void }) {
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try { await createCategory(newName.trim(), newIcon || undefined); setNewName(''); setNewIcon(''); await onReload(); }
    catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir categoria?')) return;
    try { await deleteCategory(id); await onReload(); }
    catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-700">Categorias</h2>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nova categoria" className="input flex-1" />
        <input value={newIcon} onChange={(e) => setNewIcon(e.target.value)} placeholder="Ícone (opcional)" className="input w-40" />
        <button type="submit" className="btn-rose"><Plus className="h-4 w-4" /></button>
      </form>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="card flex items-center justify-between p-4">
            <div>
              <span className="text-brand-700">{c.name}</span>
              {c.icon && <span className="ml-2 text-xs text-brand-400">{c.icon}</span>}
            </div>
            <button onClick={() => remove(c.id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-100">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ORDERS TAB ============

function OrdersTab({ orders, onReload }: { orders: OrderRow[]; onReload: () => void }) {
  const statuses = ['novo', 'em_producao', 'enviado', 'entregue', 'cancelado'];
  const statusLabels: Record<string, string> = {
    novo: 'Novo', em_producao: 'Em produção', enviado: 'Enviado', entregue: 'Entregue', cancelado: 'Cancelado',
  };

  const changeStatus = async (id: string, status: string) => {
    try { await updateOrderStatus(id, status); await onReload(); }
    catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-700">Pedidos ({orders.length})</h2>
      {orders.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-brand-400">
          <Users className="mx-auto h-10 w-10 text-rose-400" />
          <p className="mt-4 font-display text-xl">Nenhum pedido ainda</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-brand-700">{o.customer_name || 'Cliente'}</p>
                  <p className="text-sm text-brand-400">
                    {new Date(o.created_at).toLocaleDateString('pt-BR')} · R$ {o.total.toFixed(2)}
                    {o.customer_phone && ` · ${o.customer_phone}`}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o.id, e.target.value)}
                  className="input w-auto text-sm"
                >
                  {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ REVIEWS TAB ============

function ReviewsTab({ reviews, onReload }: { reviews: ReviewRow[]; onReload: () => void }) {
  const [newReview, setNewReview] = useState({ name: '', avatar: '', rating: 5, comment: '' });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview(newReview);
      setNewReview({ name: '', avatar: '', rating: 5, comment: '' });
      await onReload();
    } catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir depoimento?')) return;
    try { await deleteReview(id); await onReload(); }
    catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-700">Depoimentos</h2>

      <form onSubmit={add} className="card mt-4 space-y-3 p-4">
        <div className="grid grid-cols-2 gap-3">
          <input value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} placeholder="Nome" className="input" required />
          <input type="number" min={1} max={5} value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })} className="input" placeholder="Nota (1-5)" />
        </div>
        <input value={newReview.avatar} onChange={(e) => setNewReview({ ...newReview, avatar: e.target.value })} placeholder="URL do avatar (opcional)" className="input" />
        <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Comentário" className="input resize-none" rows={2} required />
        <button type="submit" className="btn-rose"><Plus className="h-4 w-4" /> Adicionar depoimento</button>
      </form>

      <div className="mt-6 space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="card flex items-start gap-4 p-4">
            <img src={r.avatar || 'https://images.pexels.com/photos/4158296/pexels-4158296.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'} alt={r.name} className="h-12 w-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-brand-700">{r.name}</p>
                <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-rose-500 text-rose-500" />)}</div>
              </div>
              <p className="mt-1 text-sm text-brand-500">{r.comment}</p>
            </div>
            <button onClick={() => remove(r.id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-100"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ COUPONS TAB ============

function CouponsTab({ coupons, onReload }: { coupons: CouponRow[]; onReload: () => void }) {
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_type: 'percent', discount_value: 10 });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCoupon({ ...newCoupon, is_active: true, expires_at: null } as Omit<CouponRow, 'id' | 'created_at'>);
      setNewCoupon({ code: '', discount_type: 'percent', discount_value: 10 });
      await onReload();
    } catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir cupom?')) return;
    try { await deleteCoupon(id); await onReload(); }
    catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-700">Cupons de desconto</h2>
      <form onSubmit={add} className="card mt-4 space-y-3 p-4">
        <div className="grid grid-cols-3 gap-3">
          <input value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="Código" className="input" required />
          <select value={newCoupon.discount_type} onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })} className="input">
            <option value="percent">Percentual (%)</option>
            <option value="fixed">Valor fixo (R$)</option>
          </select>
          <input type="number" step="0.01" value={newCoupon.discount_value} onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: parseFloat(e.target.value) })} className="input" required />
        </div>
        <button type="submit" className="btn-rose"><Plus className="h-4 w-4" /> Criar cupom</button>
      </form>
      <div className="mt-6 space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="card flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-brand-700">{c.code}</p>
              <p className="text-sm text-brand-400">
                {c.discount_type === 'percent' ? `${c.discount_value}% de desconto` : `R$ ${c.discount_value.toFixed(2)} de desconto`}
                {' · '} {c.is_active ? 'Ativo' : 'Inativo'}
              </p>
            </div>
            <button onClick={() => remove(c.id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-100"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ DIGITAL FILES TAB ============

function DigitalTab({ files, onReload }: { files: DigitalFileRow[]; onReload: () => void }) {
  const [newFile, setNewFile] = useState({ name: '', description: '', format: 'PDF', price: 0, is_free: false, file_url: '', image_url: '' });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDigitalFile({ ...newFile, is_active: true } as Omit<DigitalFileRow, 'id' | 'created_at'>);
      setNewFile({ name: '', description: '', format: 'PDF', price: 0, is_free: false, file_url: '', image_url: '' });
      await onReload();
    } catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir arquivo?')) return;
    try { await deleteDigitalFile(id); await onReload(); }
    catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  const toggleActive = async (f: DigitalFileRow) => {
    try { await updateDigitalFile(f.id, { is_active: !f.is_active }); await onReload(); }
    catch (err) { alert('Erro: ' + (err as Error).message); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-700">Arquivos digitais</h2>
      <form onSubmit={add} className="card mt-4 space-y-3 p-4">
        <input value={newFile.name} onChange={(e) => setNewFile({ ...newFile, name: e.target.value })} placeholder="Nome do arquivo" className="input" required />
        <textarea value={newFile.description} onChange={(e) => setNewFile({ ...newFile, description: e.target.value })} placeholder="Descrição" className="input resize-none" rows={2} />
        <div className="grid grid-cols-3 gap-3">
          <input value={newFile.format} onChange={(e) => setNewFile({ ...newFile, format: e.target.value })} placeholder="Formato" className="input" />
          <input type="number" step="0.01" value={newFile.price} onChange={(e) => setNewFile({ ...newFile, price: parseFloat(e.target.value) })} placeholder="Preço" className="input" />
          <label className="flex items-center gap-2 text-sm text-brand-600">
            <input type="checkbox" checked={newFile.is_free} onChange={(e) => setNewFile({ ...newFile, is_free: e.target.checked })} className="h-4 w-4 rounded border-nude-300 text-rose-500" />
            Grátis
          </label>
        </div>
        <input value={newFile.image_url} onChange={(e) => setNewFile({ ...newFile, image_url: e.target.value })} placeholder="URL da imagem de preview" className="input" />
        <button type="submit" className="btn-rose"><Plus className="h-4 w-4" /> Adicionar arquivo</button>
      </form>
      <div className="mt-6 space-y-3">
        {files.map((f) => (
          <div key={f.id} className="card flex items-center gap-4 p-4">
            <img src={f.image_url || ''} alt={f.name} className="h-12 w-12 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-medium text-brand-700">{f.name}</p>
              <p className="text-sm text-brand-400">{f.format} · {f.is_free ? 'Grátis' : `R$ ${f.price.toFixed(2)}`} · {f.is_active ? 'Ativo' : 'Inativo'}</p>
            </div>
            <button onClick={() => toggleActive(f)} className="rounded-full px-3 py-1 text-xs font-medium bg-nude-100 text-brand-600 hover:bg-nude-200">
              {f.is_active ? 'Desativar' : 'Ativar'}
            </button>
            <button onClick={() => remove(f.id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-100"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ SETTINGS TAB ============

function SettingsTab({ settings }: { settings: Record<string, string> }) {
  const [values, setValues] = useState(settings);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(values)) {
        await updateSiteSetting(key, value);
      }
      alert('Configurações salvas!');
    } catch (err) {
      alert('Erro: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'store_name', label: 'Nome da loja' },
    { key: 'store_email', label: 'E-mail de contato' },
    { key: 'store_phone', label: 'Telefone' },
    { key: 'store_instagram', label: 'Instagram' },
    { key: 'whatsapp_number', label: 'Número do WhatsApp (com DDI)' },
    { key: 'announcement_text', label: 'Anúncio do topo (opcional)' },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-700">Configurações do site</h2>
      <div className="card mt-4 space-y-4 p-6">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">{f.label}</label>
            <input
              value={values[f.key] ?? ''}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className="input"
            />
          </div>
        ))}
        <button onClick={save} disabled={saving} className="btn-rose disabled:opacity-60">
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </div>
    </div>
  );
}
