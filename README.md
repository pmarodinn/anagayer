# Ana Gayer — anagayer.com.br

Site da Ana Gayer · Doces finos. Por convite.

A peça central é **A Caixa Nº 01**: uma caixa 3D que se abre com a rolagem e revela nove doces. Depois vêm as fotos das peças, dois filmes, a mecânica do círculo de convites (cada proprietário concede três), a prévia do nome na tampa e o formulário de convite, que envia pelo WhatsApp.

## Tecnologia

- **React + Vite**
- **Three.js / React Three Fiber / drei**: a caixa e os doces (modelados no código) e o chocolate derretido do Filme I
- **GSAP + ScrollTrigger**: animações guiadas pela rolagem
- **Lenis**: rolagem suave
- **Motion (Framer Motion)**: menu, formulário e prévia da tampa

## Editar textos, contatos e vídeos

Tudo fica em [`src/content.js`](src/content.js): textos, número de WhatsApp, Instagram, tiragem e caminhos dos vídeos.

Os filmes devem ser gerados com IA a partir de [`videos/PROMPTS.md`](videos/PROMPTS.md), com o passo a passo para colocá-los no site.

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicação

Cada `push` na branch `main` publica o site no GitHub Pages ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). O domínio é definido em `public/CNAME`.

### DNS do domínio (registro.br)

Na zona DNS de `anagayer.com.br`:

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | pmarodinn.github.io |

Quando o DNS propagar, ative **Enforce HTTPS** em *Settings → Pages* do repositório.

## Estrutura

```
src/
  content.js          textos e contatos
  sections/           seções da página (Opening = caixa 3D)
  three/              cenas 3D (caixa, doces, chocolate)
  components/         preloader, header, logo
  styles/global.css   paleta e layout
public/media/         fotos otimizadas dos doces
images/               arquivos originais (logo e fotos)
videos/PROMPTS.md     roteiros dos filmes para IA
```
