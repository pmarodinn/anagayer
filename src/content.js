// ─────────────────────────────────────────────────────────────
//  Conteúdo editável do site Ana Gayer.
//  Todos os textos, números e contatos ficam aqui.
// ─────────────────────────────────────────────────────────────

export const brand = {
  name: 'Ana Gayer',
  tagline: 'Doces finos. Por convite.',
}

// Contatos — preencha para ativar o formulário de convite.
// whatsapp: apenas números com DDI + DDD (ex.: '5511999999999').
// Se whatsapp ficar vazio, o formulário abre o e-mail abaixo.
export const contact = {
  whatsapp: '5541996502587',
  email: 'contato@anagayer.com.br',
  instagram: 'anagayerdocesfinos',
}

// Filmes. Coloque os arquivos em /public/videos/ e preencha o caminho.
// Enquanto estiver vazio, o site exibe a versão provisória.
// Veja videos/PROMPTS.md para gerar os filmes com IA.
export const films = {
  gesto: { src: '', poster: '' }, // ex.: '/videos/gesto.mp4'
  noite: { src: '', poster: '' }, // ex.: '/videos/noite.mp4'
}

// Abertura (a caixa 3D). Cada fase aparece conforme a tampa se abre.
export const hero = {
  eyebrow: 'A Caixa · Edição Nº 01',
  sub: 'Doces finos. Por convite.',
  scroll: 'Role para abrir',
  phases: [
    { big: ['Não se compra.'], small: '' },
    { big: ['Recebe-se.'], small: 'Por convite. Apenas.' },
  ],
  specs: [
    { k: 'Tampa', v: 'Papel algodão, logo em hot stamping' },
    { k: 'Interior', v: 'Veludo laranja Ana Gayer' },
    { k: 'Peças', v: 'Nove, feitas à mão no dia' },
  ],
}

// Galeria das peças: sem nomes — numeração, ingredientes e acabamento.
// `alt` é lido apenas por leitores de tela. `tint` é o tom que o fundo assume.
export const pieces = {
  index: '01',
  label: 'As Peças',
  intro: ['Nove peças.', 'Nenhuma igual.'],
  text: 'Cada caixa reúne nove doces, feitos à mão no dia da entrega.',
  items: [
    {
      img: 'copa', w: 667, h: 828, sizes: [667], tint: '#ebe2d6',
      alt: 'Copa de chocolate branco com framboesas e mirtilos',
      line: 'Chocolate branco, framboesa e mirtilo.',
      specs: [['Composição', 'Chocolate branco, frutas vermelhas'], ['Acabamento', 'Copa moldada à mão']],
    },
    {
      img: 'pavlova', w: 1536, h: 2752, sizes: [900, 1536], tint: '#ebeaea',
      alt: 'Pequenas pavlovas com frutas vermelhas sobre mármore',
      line: 'Merengue, creme e frutas vermelhas.',
      specs: [['Composição', 'Merengue, creme, framboesa, mirtilo'], ['Acabamento', 'Merengue modelado à mão']],
    },
    {
      img: 'folha', w: 1600, h: 2012, sizes: [900, 1600], tint: '#f3e3d9',
      alt: 'Brigadeiro branco com folha modelada à mão',
      line: 'Brigadeiro branco, folha modelada à mão.',
      specs: [['Composição', 'Brigadeiro branco, açúcar cristal'], ['Acabamento', 'Folha modelada peça a peça']],
    },
    {
      img: 'cones', w: 1536, h: 2752, sizes: [900, 1536], tint: '#ddd4ca',
      alt: 'Cones de chocolate dentro de uma cúpula em mosaico',
      line: 'Cone crocante, creme de avelã e cacau.',
      specs: [['Composição', 'Cone crocante, creme de avelã'], ['Acabamento', 'Pétala de chocolate e pérola de açúcar']],
    },
    {
      img: 'coracao', w: 1600, h: 1945, sizes: [900, 1600], tint: '#eeedea',
      alt: 'Coração de chocolate trançado recebendo folha de ouro',
      line: 'Chocolate trançado, folha de ouro 24k.',
      specs: [['Composição', 'Chocolate trançado, ouro 24k'], ['Acabamento', 'Ouro aplicado com pinça']],
    },
    {
      img: 'casquinha', w: 1536, h: 2752, sizes: [900, 1536], tint: '#e4e1e2',
      alt: 'Morangos açucarados em copinhos de chocolate',
      line: 'Chocolate amargo e morango fresco.',
      specs: [['Composição', 'Casquinha de chocolate, morango'], ['Acabamento', 'Morango polvilhado com açúcar']],
    },
  ],
}

export const filmGesto = {
  index: 'Filme I',
  label: 'O Gesto',
  lines: ['Feito à mão.', 'Sem pressa.'],
}

export const filmNoite = {
  index: 'Filme II',
  label: 'A Noite',
  lines: ['Para as noites', 'que pedem algo raro.'],
}

export const circle = {
  index: '02',
  label: 'O Círculo',
  title: ['Ninguém compra', 'a primeira caixa.'],
  sub: 'Alguém a concede a você.',
  steps: [
    { n: 'I', t: 'Receba o convite', d: 'De quem já pertence ao círculo.' },
    { n: 'II', t: 'Receba a caixa', d: 'Feita à mão, entregue no dia.' },
    { n: 'III', t: 'Conceda três convites', d: 'Apenas três. Escolha bem.' },
  ],
}

export const invitation = {
  index: '03',
  label: 'Convite',
  title: ['Solicitar', 'convite'],
  tabs: ['Tenho um código', 'Lista de espera'],
  note: 'Cada solicitação é lida pessoalmente.',
  done: ['Recebido.', 'Se for o momento, entraremos em contato.'],
}

export const atelier = {
  index: '04',
  label: 'Encomendas',
  title: 'Também sob encomenda.',
  text: 'Casamentos, celebrações e presentes. Em pequenas quantidades, sempre à mão.',
  items: ['Casamentos', 'Celebrações', 'Presentes'],
  cta: 'Encomendar',
}

export const nav = [
  { id: 'caixa', label: 'A Caixa' },
  { id: 'pecas', label: 'As Peças' },
  { id: 'circulo', label: 'O Círculo' },
  { id: 'encomendas', label: 'Encomendas' },
]
