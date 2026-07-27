<div className="mt-8 flex flex-wrap gap-3">
  <Link to="/catalogo" className="btn-primary">
    Ver Catálogo
    <ArrowRight className="h-4 w-4" />
  </Link>

  <a
    href={whatsappUrl('Olá! Gostaria de solicitar um orçamento.')}
    target="_blank"
    rel="noreferrer"
    className="btn-rose"
  >
    <MessageCircle className="h-4 w-4" />
    Solicitar Orçamento
  </a>

  <a
    href="https://www.instagram.com/pauloartecriativa/"
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-6 py-3 font-semibold text-pink-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.9 1.15a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.51 5.51 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4.01 4.01 0 0 0-4-4Z"/>
    </svg>

    Instagram
  </a>
</div>