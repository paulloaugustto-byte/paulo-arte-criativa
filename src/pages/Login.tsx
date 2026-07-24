import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DecorativeBg from '@/components/DecorativeBg';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn = mode === 'login' ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    navigate('/admin/painel');
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center py-12">
      <DecorativeBg />
      <div className="card relative w-full max-w-md p-8">
        <Link to="/" className="flex items-center gap-2 text-sm text-brand-500 hover:text-rose-500">
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>

        <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-rose-400 text-white shadow-soft">
          <Lock className="h-7 w-7" />
        </div>

        <h1 className="heading mt-6 text-brand-700">
          {mode === 'login' ? 'Área Administrativa' : 'Criar conta'}
        </h1>
        <p className="mt-2 text-sm text-brand-500">
          {mode === 'login'
            ? 'Acesse o painel de gerenciamento da loja.'
            : 'Crie sua conta para gerenciar a loja.'}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nude-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-11"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-600">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nude-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-brand-500">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <button
                onClick={() => { setMode('signup'); setError(null); }}
                className="font-semibold text-rose-500 hover:text-rose-600"
              >
                Criar agora
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button
                onClick={() => { setMode('login'); setError(null); }}
                className="font-semibold text-rose-500 hover:text-rose-600"
              >
                Fazer login
              </button>
            </>
          )}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-2xl bg-nude-100 px-4 py-3 text-xs text-brand-500">
          {mode === 'signup' ? (
            <>
              <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <span>A senha deve ter no mínimo 6 caracteres. Após criar a conta, você acessa o painel.</span>
            </>
          ) : (
            <>
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <span>Acesso restrito à equipe. Use suas credenciais cadastradas.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
