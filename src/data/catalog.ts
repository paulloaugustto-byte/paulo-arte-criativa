export type Category =
  | 'Sacolas Personalizadas'
  | 'Caixas para Caneca'
  | 'Caixas Explosão'
  | 'Kits Presente'
  | 'Canecas'
  | 'Topos de Bolo'
  | 'Papelaria Personalizada'
  | 'Adesivos'
  | 'Lembrancinhas'
  | 'Arquivos Digitais';

export type CommemorativeDate =
  | 'Dia dos Pais'
  | 'Dia das Mães'
  | 'Páscoa'
  | 'Natal'
  | 'Dia dos Namorados'
  | 'Professores'
  | 'Volta às aulas'
  | 'Chá de bebê'
  | 'Casamento'
  | 'Aniversário'
  | 'Empresas';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  commemorative: CommemorativeDate[];
  price: number;
  images: string[];
  featured?: boolean;
  keywords?: string[];
}

export const categories: Category[] = [
  'Sacolas Personalizadas',
  'Caixas para Caneca',
  'Caixas Explosão',
  'Kits Presente',
  'Canecas',
  'Topos de Bolo',
  'Papelaria Personalizada',
  'Adesivos',
  'Lembrancinhas',
  'Arquivos Digitais',
];

export const commemorativeDates: CommemorativeDate[] = [
  'Dia dos Pais',
  'Dia das Mães',
  'Páscoa',
  'Natal',
  'Dia dos Namorados',
  'Professores',
  'Volta às aulas',
  'Chá de bebê',
  'Casamento',
  'Aniversário',
  'Empresas',
];

const img = (id: number, w = 800, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const products: Product[] = [
  {
    id: 'caixa-explosao-premium',
    name: 'Caixa Explosão Premium',
    description:
      'Caixa explosão com acabamento luxuoso, surpresa ao abrir e espaço para fotos, cartas e mimos. O presente perfeito para emocionar quem você ama.',
    category: 'Caixas Explosão',
    commemorative: ['Aniversário', 'Dia dos Namorados', 'Dia das Mães'],
    price: 89.9,
    images: [img(4198104), img(6211168), img(6211175)],
    featured: true,
    keywords: ['explosão', 'surpresa', 'romântico', 'luxo'],
  },
  {
    id: 'sacola-personalizada-kraft',
    name: 'Sacola Personalizada Kraft',
    description:
      'Sacola em papel kraft com estampa personalizada e alças de fita. Ideal para presentear com elegância e identidade própria.',
    category: 'Sacolas Personalizadas',
    commemorative: ['Aniversário', 'Empresas', 'Casamento'],
    price: 12.9,
    images: [img(4498122), img(6211175)],
    featured: true,
    keywords: ['kraft', 'sacola', 'embalagem'],
  },
  {
    id: 'caixa-caneca-mdf',
    name: 'Caixa para Caneca MDF',
    description:
      'Caixa em MDF revestida para caneca, com acabamento fosco e fechamento magnético. Encanta na hora da entrega.',
    category: 'Caixas para Caneca',
    commemorative: ['Dia dos Pais', 'Dia das Mães', 'Professores'],
    price: 24.9,
    images: [img(6211168), img(4198104)],
    featured: true,
    keywords: ['caneca', 'mdf', 'presente'],
  },
  {
    id: 'kit-presente-amor',
    name: 'Kit Presente Amor',
    description:
      'Kit completo com caixa, caneca personalizada, chocolates e cartão. Montamos o presente dos sonhos para você.',
    category: 'Kits Presente',
    commemorative: ['Dia dos Namorados', 'Aniversário', 'Dia das Mães'],
    price: 149.9,
    images: [img(6211175), img(4198104), img(4498122)],
    featured: true,
    keywords: ['kit', 'combo', 'amor', 'presente completo'],
  },
  {
    id: 'caneca-magica-personalizada',
    name: 'Caneca Mágica Personalizada',
    description:
      'Caneca de cerâmica que revela a arte ao contato com líquido quente. Personalize com fotos, nomes e frases.',
    category: 'Canecas',
    commemorative: ['Aniversário', 'Dia dos Pais', 'Professores'],
    price: 39.9,
    images: [img(4198104), img(6211168)],
    keywords: ['mágica', 'cerâmica', 'fotografia'],
  },
  {
    id: 'topo-bolo-acrilico',
    name: 'Topo de Bolo Acrílico',
    description:
      'Topo de bolo em acrílico com nome e tema personalizados. Toque final sofisticado para qualquer comemoração.',
    category: 'Topos de Bolo',
    commemorative: ['Casamento', 'Aniversário', 'Chá de bebê'],
    price: 34.9,
    images: [img(6211175), img(4498122)],
    keywords: ['topo', 'bolo', 'festa', 'acrílico'],
  },
  {
    id: 'papelaria-personalizada-luxo',
    name: 'Papelaria Personalizada Luxo',
    description:
      'Bloco, agenda e cartões com identidade visual exclusiva. Papelaria sofisticada para marcar presença.',
    category: 'Papelaria Personalizada',
    commemorative: ['Volta às aulas', 'Empresas'],
    price: 59.9,
    images: [img(4498122), img(6211168)],
    keywords: ['agenda', 'bloco', 'cartão', 'escritório'],
  },
  {
    id: 'adesivos-personalizados',
    name: 'Adesivos Personalizados',
    description:
      'Adesivos em vinil de alta durabilidade, resistentes à água. Personalize formatos, cores e artes.',
    category: 'Adesivos',
    commemorative: ['Volta às aulas', 'Empresas', 'Aniversário'],
    price: 9.9,
    images: [img(6211168), img(4198104)],
    keywords: ['vinil', 'sticker', 'rótulo'],
  },
  {
    id: 'lembrancinha-cha-bebe',
    name: 'Lembrancinha Chá de Bebê',
    description:
      'Lembrancinhas delicadas para o seu chá de bebê, com embalagem personalizada e acabamento impecável.',
    category: 'Lembrancinhas',
    commemorative: ['Chá de bebê'],
    price: 14.9,
    images: [img(6211175), img(4498122)],
    keywords: ['bebê', 'lembrança', 'maternidade'],
  },
  {
    id: 'arquivo-digital-convite',
    name: 'Convite Digital Personalizado',
    description:
      'Arquivo digital de convite em alta resolução, pronto para impressão ou envio pelo WhatsApp. Personalização completa.',
    category: 'Arquivos Digitais',
    commemorative: ['Casamento', 'Aniversário', 'Chá de bebê'],
    price: 29.9,
    images: [img(4498122), img(6211168)],
    keywords: ['convite', 'digital', 'download', 'arquivo'],
  },
  {
    id: 'caixa-explosao-natal',
    name: 'Caixa Explosão Natalina',
    description:
      'Edição especial de Natal com temas festivos, luzes e mimos sazonais. A magia do Natal em cada detalhe.',
    category: 'Caixas Explosão',
    commemorative: ['Natal'],
    price: 99.9,
    images: [img(4198104), img(6211175)],
    keywords: ['natal', 'festivo', 'explosão'],
  },
  {
    id: 'kit-volta-aulas',
    name: 'Kit Volta às Aulas',
    description:
      'Kit completo com etiquetas, cadernos personalizados e marca-páginas. Comece o ano letivo com estilo.',
    category: 'Kits Presente',
    commemorative: ['Volta às aulas'],
    price: 49.9,
    images: [img(4498122), img(6211168)],
    keywords: ['escola', 'etiqueta', 'caderno'],
  },
];

export const galleryImages: { id: string; src: string; alt: string }[] = [
  { id: 'g1', src: img(4198104, 600, 800), alt: 'Caixa explosão personalizada' },
  { id: 'g2', src: img(6211168, 600, 400), alt: 'Sacola personalizada' },
  { id: 'g3', src: img(6211175, 600, 700), alt: 'Kit presente elegante' },
  { id: 'g4', src: img(4498122, 600, 600), alt: 'Papelaria personalizada' },
  { id: 'g5', src: img(4198104, 600, 500), alt: 'Detalhe de acabamento' },
  { id: 'g6', src: img(6211168, 600, 800), alt: 'Caneca personalizada' },
  { id: 'g7', src: img(6211175, 600, 400), alt: 'Topo de bolo' },
  { id: 'g8', src: img(4498122, 600, 700), alt: 'Lembrancinha' },
  { id: 'g9', src: img(4198104, 600, 600), alt: 'Convite digital' },
  { id: 'g10', src: img(6211168, 600, 800), alt: 'Caixa para caneca' },
  { id: 'g11', src: img(6211175, 600, 500), alt: 'Adesivos personalizados' },
  { id: 'g12', src: img(4498122, 600, 600), alt: 'Papelaria luxo' },
];

export const reviews = [
  {
    id: 'r1',
    name: 'Mariana Souza',
    avatar: img(4158296, 200, 200),
    rating: 5,
    comment:
      'A caixa explosão superou todas as expectativas! Minha mãe chorou ao abrir. Acabamento impecável e atendimento atencioso.',
  },
  {
    id: 'r2',
    name: 'Carlos Henrique',
    avatar: img(220453, 200, 200),
    rating: 5,
    comment:
      'Encomendei kits para a equipe da empresa e foi um sucesso. Qualidade premium e entrega no prazo. Recomendo demais!',
  },
  {
    id: 'r3',
    name: 'Juliana Alves',
    avatar: img(1239291, 200, 200),
    rating: 5,
    comment:
      'Cada detalhe é pensado com carinho. As lembrancinhas do meu chá de bebê ficaram um sonho. Obrigada Paulo Arte Criativa!',
  },
  {
    id: 'r4',
    name: 'Fernanda Lima',
    avatar: img(733872, 200, 200),
    rating: 5,
    comment:
      'Profissionalismo do início ao fim. A caneca mágica foi o presente mais comentado do aniversário do meu pai.',
  },
];

export const faqs = [
  {
    q: 'Vocês fazem personalizados sob encomenda?',
    a: 'Sim! Todo nosso trabalho é personalizado. Envie sua ideia pelo WhatsApp e criamos algo exclusivo para você.',
  },
  {
    q: 'Qual o prazo de produção e entrega?',
    a: 'O prazo de produção varia de 3 a 7 dias úteis conforme o produto. A entrega segue o prazo dos Correios para todo o Brasil.',
  },
  {
    q: 'Entregam para todo o Brasil?',
    a: 'Sim, enviamos para todo o território nacional via Correios ou transportadora. O frete é calculado no momento da compra.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Aceitamos Pix (com 5% de desconto), cartão de crédito e boleto. Para encomendas, solicitamos 50% de entrada.',
  },
  {
    q: 'Como envio minha arte ou fotos?',
    a: 'Após o pedido, enviamos um link pelo WhatsApp para você anexar fotos, logos e referências com facilidade.',
  },
];

export const whatsappNumber = '5511999999999';

export function whatsappLink(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
