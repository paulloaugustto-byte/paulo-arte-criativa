import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { whatsappLink } from '@/data/catalog';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<'pix' | 'cartao'>('pix');

  if (cart.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="heading text-brand-700">Seu carrinho está vazio</h1>
        <p className="mt-4 text-brand-500">
          Que tal explorar nosso catálogo e encontrar o presente perfeito?
        </p>
        <Link to="/catalogo" className="btn-primary mt-8">Ver catálogo</Link>
      </div>
    );
  }

  const orderText = `Olá! Gostaria de finalizar meu pedido:\n\n${cart
    .map((i) => `• ${i.product.name} — ${i.quantity}x (R$ ${(i.product.price * i.quantity).toFixed(2).replace('.', ',')})`)
    .join('\n')}\n\nTotal: R$ ${cartTotal.toFixed(2).replace('.', ',')}\nPagamento: ${payment === 'pix' ? 'Pix' : 'Cartão'}`;

  return (
    <div className="container-page py-12">
      <h1 className="heading text-brand-700">Carrinho</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div key={item.product.id} className="card flex gap-4 p-4">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="h-24 w-24 shrink-0 rounded-2xl object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/produto/${item.product.id}`}
                    className="font-display text-lg font-semibold text-brand-700 hover:text-rose-600"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="rounded-full p-2 text-brand-400 hover:bg-rose-100 hover:text-rose-600"
                    aria-label="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-brand-400">{item.product.category}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-nude-300">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="rounded-l-full p-2 text-brand-600 hover:bg-nude-100"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-brand-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="rounded-r-full p-2 text-brand-600 hover:bg-nude-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-display text-xl font-semibold text-brand-700">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="card h-fit p-6">
          <h2 className="font-display text-xl font-semibold text-brand-700">Resumo</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-brand-500">
              <span>Subtotal</span>
              <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-brand-500">
              <span>Frete</span>
              <span>Calculado no WhatsApp</span>
            </div>
          </div>
          <div className="mt-4 border-t border-nude-200 pt-4">
            <div className="flex justify-between">
              <span className="font-display text-lg font-semibold text-brand-700">Total</span>
              <span className="font-display text-2xl font-semibold text-brand-700">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-brand-600">Forma de pagamento</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPayment('pix')}
                className={`rounded-2xl border p-3 text-sm font-medium transition-all ${
                  payment === 'pix'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-nude-300 text-brand-500'
                }`}
              >
                Pix (5% off)
              </button>
              <button
                onClick={() => setPayment('cartao')}
                className={`rounded-2xl border p-3 text-sm font-medium transition-all ${
                  payment === 'cartao'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-nude-300 text-brand-500'
                }`}
              >
                Cartão
              </button>
            </div>
          </div>

          <a
            href={whatsappLink(orderText)}
            target="_blank"
            rel="noreferrer"
            className="btn-rose mt-6 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            Finalizar no WhatsApp
          </a>
          <button onClick={() => navigate('/catalogo')} className="btn-ghost mt-2 w-full">
            Continuar comprando <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
