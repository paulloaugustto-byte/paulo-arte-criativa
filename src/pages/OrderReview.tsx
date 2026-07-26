import { ArrowLeft, MessageCircle, Pencil, ShoppingBag } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { whatsappLink } from '@/data/catalog';

const money = (value: number) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function itemNumber(index: number) {
  const emojiNumbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  return emojiNumbers[index] ?? `${index + 1}.`;
}

export default function OrderReview() {
  const { cart, cartCount, cartTotal } = useStore();
  const [payment, setPayment] = useState<'pix' | 'cartao'>('pix');

  if (cart.length === 0) return <Navigate to="/carrinho" replace />;

  const orderText = `🛍️ NOVO PEDIDO\n\n${cart.map((item, index) => {
    const option = item.variant
      ? `\n${item.product.option_name || 'Opção'}: ${item.variant.name}`
      : '';

    return `${itemNumber(index)} ${item.product.name}${option}\nQuantidade: ${item.quantity}\nValor: ${money(item.unitPrice)}\nSubtotal: ${money(item.unitPrice * item.quantity)}`;
  }).join('\n\n-----------------------\n\n')}\n\n━━━━━━━━━━━━━━━━━━\n\nTOTAL DO PEDIDO\n\n${money(cartTotal)}\n\nForma de pagamento: ${payment === 'pix' ? 'Pix' : 'Cartão'}`;

  return (
    <div className="container-page py-10 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Última etapa</p>
          <h1 className="heading mt-2 text-brand-700">Revisar pedido</h1>
          <p className="mt-3 max-w-2xl text-brand-500">Confira os produtos, as opções e as quantidades antes de enviar o pedido pelo WhatsApp.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-4" aria-label="Itens do pedido">
            {cart.map((item, index) => (
              <article key={item.key} className="card overflow-hidden p-4 sm:p-5">
                <div className="flex gap-4 sm:gap-5">
                  <img
                    src={item.product.images[0] || '/placeholder-product.svg'}
                    alt={item.product.name}
                    className="h-28 w-28 shrink-0 rounded-2xl object-cover sm:h-36 sm:w-36"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-bold text-rose-600">{index + 1}</span>
                      <div className="min-w-0">
                        <h2 className="font-display text-lg font-semibold text-brand-700 sm:text-xl">{item.product.name}</h2>
                        {item.variant && (
                          <p className="mt-1 text-sm font-medium text-rose-600">
                            {item.product.option_name || 'Opção'}: {item.variant.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <div className="rounded-xl bg-nude-50 px-3 py-2">
                        <dt className="text-brand-400">Quantidade</dt>
                        <dd className="font-semibold text-brand-700">{item.quantity}</dd>
                      </div>
                      <div className="rounded-xl bg-nude-50 px-3 py-2">
                        <dt className="text-brand-400">Valor unitário</dt>
                        <dd className="font-semibold text-brand-700">{money(item.unitPrice)}</dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex items-center justify-between border-t border-nude-200 pt-4">
                      <span className="text-sm font-medium text-brand-500">Subtotal</span>
                      <strong className="font-display text-xl text-brand-700">{money(item.unitPrice * item.quantity)}</strong>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-brand-700">Resumo</h2>
                  <p className="text-sm text-brand-400">Confira antes de enviar</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-brand-500"><span>Produtos diferentes</span><span>{cart.length}</span></div>
                <div className="flex justify-between text-brand-500"><span>Quantidade total</span><span>{cartCount}</span></div>
                <div className="flex justify-between text-brand-500"><span>Frete</span><span>Combinado no WhatsApp</span></div>
              </div>

              <div className="mt-5 border-y border-nude-200 py-5">
                <p className="text-sm font-medium text-brand-500">Total do pedido</p>
                <p className="mt-1 font-display text-3xl font-bold text-brand-700">{money(cartTotal)}</p>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-brand-600">Forma de pagamento</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayment('pix')}
                    className={`rounded-2xl border p-3 text-sm font-medium transition-all ${payment === 'pix' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-nude-300 text-brand-500 hover:border-rose-300'}`}
                  >
                    Pix
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayment('cartao')}
                    className={`rounded-2xl border p-3 text-sm font-medium transition-all ${payment === 'cartao' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-nude-300 text-brand-500 hover:border-rose-300'}`}
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
                Enviar para WhatsApp
              </a>

              <Link to="/carrinho" className="btn-ghost mt-2 w-full">
                <Pencil className="h-4 w-4" />
                Editar carrinho
              </Link>
              <Link to="/catalogo" className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-brand-500 hover:text-rose-600">
                <ArrowLeft className="h-4 w-4" />
                Continuar comprando
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
