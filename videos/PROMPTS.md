# Filmes do site — roteiros para gerar com IA

O site tem dois espaços de filme. Enquanto os vídeos não existem, ele mostra versões provisórias:

| Filme | Seção | Provisório atual |
| --- | --- | --- |
| **Filme I — O Gesto** | depois de "As Peças" | chocolate derretido em 3D (tempo real) |
| **Filme II — A Noite** | depois de "O Círculo" | foto do brigadeiro com luz quente |

Os prompts estão em **inglês** porque as ferramentas (Veo 3, Sora 2, Kling, Runway Gen-4) respondem melhor assim. Gere de 8 a 10 segundos, 16:9, 24 fps. Se a ferramenta permitir, gere também a versão 9:16 para Reels e Stories.

Direção geral, que vale para os dois filmes: *quiet luxury*. Paleta clara (marfim, creme, champanhe, chocolate), luz natural e suave, câmera lenta, nada de neon, nada de dourado exagerado, **sem textos e sem logos no vídeo** (o site sobrepõe a tipografia).

---

## Filme I — O Gesto

> Mãos de chef com luvas, jogando ou vertendo chocolate. Só as mãos aparecem.

**Prompt (16:9):**

```
Extreme slow motion, 120fps look, macro cinematic shot. A pastry chef's hands in thin white cotton gloves, wrists and white chef jacket cuffs only — no face — gracefully flick a ribbon of glossy molten dark chocolate from a small copper saucepan through the air. The chocolate arcs in a silky, continuous ribbon and breaks into a few perfect droplets that catch the light. Background: soft warm ivory and cream seamless backdrop, out of focus. Lighting: soft diffused daylight from the left, gentle rim light, delicate specular highlights on the chocolate. Color palette: ivory, cream, warm beige, deep chocolate brown, a single subtle touch of burnt orange. Shallow depth of field, 85mm lens, smooth slow dolly-in. Quiet luxury, editorial food film, elegant, restrained, no text, no logos, no clutter.
```

**Variações para testar**

- *Vertendo:* `...slowly pour a thick stream of molten chocolate from a copper saucepan onto a single white brigadeiro resting on a cream ceramic plate...`
- *Finalização:* `...gloved fingers place a tiny flake of gold leaf on a chocolate heart with long tweezers, macro, breath-held stillness...`

**Prompt negativo** (quando houver campo para isso): `face, people, text, watermark, logo, dark background, black background, neon, harsh light, messy splatter, cartoon, plastic look, fast motion`

---

## Filme II — A Noite

> Um baile de gala ao estilo dos bailes de Viena. Uma mulher jovem e elegante come um brigadeiro.

**Prompt (16:9):**

```
Cinematic slow motion, 35mm film look. A grand Viennese ballroom at night in the style of the Vienna Opera Ball: ivory and champagne tones, crystal chandeliers with warm candle-like light, soft golden bokeh, couples in white gowns and black tailcoats waltzing softly out of focus in the background. In the foreground, a beautiful, elegant young woman in her twenties, wearing a minimalist ivory silk evening gown and long white opera gloves, hair in a refined low chignon, discreet pearl earrings, takes a single small chocolate brigadeiro from an open cream-colored gift box lined with burnt-orange velvet, looks at it for a moment, and bites it slowly with a subtle, satisfied half-smile. Shallow depth of field, gentle push-in, soft warm key light on her face, elegant and restrained. Quiet luxury, timeless, sophisticated, no text, no logos.
```

**Close-up alternativo (ótimo para Reels 9:16):**

```
Vertical 9:16, extreme close-up, slow motion. Gloved fingers of an elegant young woman in an ivory silk gown lift a glossy chocolate brigadeiro covered in fine chocolate sprinkles from a cream gift box with burnt-orange velvet lining. Warm golden ballroom bokeh behind. She brings it to her lips; soft natural smile. Ivory, champagne and chocolate palette. Cinematic, quiet luxury, no text, no logos.
```

**Prompt negativo:** `text, watermark, logo, cartoon, overexposed, cheap party, neon, plastic, distorted hands, extra fingers, dark muddy image`

---

## Como colocar os vídeos no site

1. Exporte em MP4 (H.264), 1920×1080. Para carregar rápido, deixe cada arquivo com até ~8 MB:

   ```bash
   ffmpeg -i entrada.mp4 -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 24 -preset slow -an -movflags +faststart public/videos/gesto.mp4
   ```

2. Gere uma imagem de capa (o primeiro quadro mostrado enquanto o vídeo carrega):

   ```bash
   ffmpeg -i public/videos/gesto.mp4 -ss 00:00:02 -frames:v 1 -q:v 3 public/videos/gesto.jpg
   ```

3. Em `src/content.js`, preencha os caminhos:

   ```js
   export const films = {
     gesto: { src: '/videos/gesto.mp4', poster: '/videos/gesto.jpg' },
     noite: { src: '/videos/noite.mp4', poster: '/videos/noite.jpg' },
   }
   ```

4. Faça commit e push. O GitHub Pages publica sozinho.

O vídeo toca sem som, em loop. Ele aparece primeiro numa janela pequena e se expande até a tela cheia com a rolagem, com o título do filme sobreposto.
