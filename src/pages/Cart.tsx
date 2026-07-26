import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="heading text-brand-700">Seu carrinho está vazio</h1>
        <p className="mt-4 text-brand-500">Que tal explorar nosso catálogo e encontrar o presente perfeito?</p>
        <Link to="/catalogo" className="btn-primary mt-8">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="heading text-brand-700">Carrinho</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div key={item.key} className="card flex gap-4 p-4">
              <img src={item.product.images[0] || '/placeholder-product.svg'} alt={item.product.name} className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/produto/${item.product.id}`} className="font-display text-lg font-semibold text-brand-700 hover:text-rose-600">{item.product.name}</Link>
                    {item.variant && (
                      <p className="mt-1 text-sm font-medium text-rose-600">{item.product.option_name || 'Opção'}: {item.variant.name}</p>
                    )}
                  </div>
                  <button onClick={() => removeFromCart(item.key)} className="rounded-full p-2 text-brand-400 hover:bg-rose-100 hover:text-rose-600" aria-label="Remover"><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="text-sm text-brand-400">{item.product.category} · {money(item.unitPrice)} cada</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-nude-300">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="rounded-l-full p-2 text-brand-600 hover:bg-nude-100"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-10 text-center text-sm font-medium text-brand-700">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="rounded-r-full p-2 text-brand-600 hover:bg-nude-100"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <span className="font-display text-xl font-semibold text-brand-700">{money(item.unitPrice * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card h-fit p-6">
          <h2 className="font-display text-xl font-semibold text-brand-700">Resumo</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-brand-500"><span>Subtotal</span><span>{money(cartTotal)}</span></div>
            <div className="flex justify-between text-brand-500"><span>Frete</span><span>Calculado no WhatsApp</span></div>
          </div>
          <div className="mt-4 border-t border-nude-200 pt-4"><div className="flex justify-between"><span className="font-display text-lg font-semibold text-brand-700">Total</span><span className="font-display text-2xl font-semibold text-brand-700">{money(cartTotal)}</span></div></div>
          <button onClick={() => navigate('/revisar-pedido')} className="btn-rose mt-6 w-full"><CheckCircle2 className="h-4 w-4" />Revisar pedido</button>
          <button onClick={() => navigate('/catalogo')} className="btn-ghost mt-2 w-full">Continuar comprando <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
