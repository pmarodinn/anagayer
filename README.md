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

Tudo fica em [`src/content.js`](src/content.js): textos, número de WhatsApp, Instagram e caminhos dos vídeos.

Os filmes devem ser gerados com IA a partir de [`videos/PROMPTS.md`](videos/PROMPTS.md), com o passo a passo para colocá-los no site.

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicação

Cada `push` na branch `main` publica o site no GitHub Pages ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). O endereço principal é `www.anagayer.com.br` (definido em `public/CNAME` e em *Settings → Pages*); `anagayer.com.br` redireciona para ele.

### DNS do domínio

O `anagayer.com.br` usa o DNS da **Wix** (`ns0.wixdns.net` / `ns1.wixdns.net`) e hoje aponta para um site Wix. Para apontar para este site, edite os registros em **Wix → Domínios → anagayer.com.br → Gerenciar registros DNS**:

| Tipo | Host | Valor |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | pmarodinn.github.io |

Apague os registros A antigos da Wix no `@`. Se a Wix não deixar editar, outra opção é trocar os servidores DNS no registro.br para os do próprio registro.br e criar ali os mesmos registros, mais os AAAA `2606:50c0:8000::153` a `2606:50c0:8003::153`.

Quando o DNS propagar (de minutos a algumas horas), ative **Enforce HTTPS** em *Settings → Pages* do repositório.

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
