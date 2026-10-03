// ─────────────────────────────────────────────────────────────
//  Conteúdo editável do site Ana Gayer.
//  Todos os textos, números e contatos ficam aqui.
// ─────────────────────────────────────────────────────────────

export const brand = {
  name: 'Ana Gayer',
  tagline: 'Doces finos. Por convite.',
  editionSize: 100, // tiragem total de caixas
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
    { big: ['Recebe-se.'], small: 'Uma caixa. Um número. Um nome.' },
  ],
  specs: [
    { k: 'Tampa', v: 'Papel algodão, logo em hot stamping' },
    { k: 'Interior', v: 'Veludo laranja Ana Gayer' },
    { k: 'Peças', v: 'Nove, feitas à mão no dia' },
    { k: 'Tiragem', v: 'Cem caixas numeradas' },
  ],
}

export const pieces = {
  index: '01',
  label: 'As Peças',
  intro: ['Nove peças.', 'Nenhuma igual.'],
  items: [
    {
      ref: 'Nº 01',
      name: 'Copa',
      line: 'Chocolate branco, framboesa e mirtilo.',
      img: 'copa',
      w: 667,
      h: 828,
      sizes: [667],
      tint: '#ebe2d6',
      specs: [
        ['Composição', 'Chocolate branco, frutas vermelhas'],
        ['Acabamento', 'Copa moldada à mão'],
      ],
    },
    {
      ref: 'Nº 02',
      name: 'Folha',
      line: 'Brigadeiro branco, folha modelada à mão.',
      img: 'folha',
      w: 1600,
      h: 2012,
      sizes: [900, 1600],
      tint: '#f3e3d9',
      specs: [
        ['Composição', 'Brigadeiro branco, açúcar cristal'],
        ['Acabamento', 'Folha modelada peça a peça'],
      ],
    },
    {
      ref: 'Nº 03',
      name: 'Coração',
      line: 'Chocolate trançado, folha de ouro 24k.',
      img: 'coracao',
      w: 1600,
      h: 1945,
      sizes: [900, 1600],
      tint: '#eeedea',
      specs: [
        ['Composição', 'Chocolate trançado, ouro 24k'],
        ['Acabamento', 'Ouro aplicado com pinça'],
      ],
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
    { n: 'II', t: 'Receba a caixa', d: 'Numerada, com o seu nome.' },
    { n: 'III', t: 'Conceda três convites', d: 'Apenas três. Escolha bem.' },
  ],
}

export const engraving = {
  index: '03',
  label: 'A Tampa',
  title: ['Seu nome', 'na tampa.'],
  sub: 'Cada caixa é numerada e leva, em hot stamping, o nome de quem a recebe.',
  placeholder: 'Escreva seu nome',
  after: 'Abra devagar. Estarão olhando.',
}

export const invitation = {
  index: '04',
  label: 'Convite',
  title: ['Solicitar', 'convite'],
  tabs: ['Tenho um código', 'Lista de espera'],
  note: 'Cada solicitação é lida pessoalmente.',
  done: ['Recebido.', 'Se for o momento, entraremos em contato.'],
}

export const atelier = {
  index: '05',
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
  { id: 'tampa', label: 'A Tampa' },
  { id: 'encomendas', label: 'Encomendas' },
]
