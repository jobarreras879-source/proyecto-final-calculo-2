# Proyecto final · Cálculo 2

Minicurso web (HTML, CSS y JavaScript puro, sin frameworks), con una página por sección, sobre **Aplicaciones de la integral definida**, tema de Cálculo II: área bajo la curva, sólidos de revolución y valor promedio de una función. Incluye tres videos explicativos de máximo 1 minuto (incrustados desde YouTube), problemas resueltos y problemas propuestos.

🔗 **Web:** https://jobarreras879-source.github.io/proyecto-final-calculo-2/

## Qué incluye

Estructura pedida en la guía del proyecto, una página por sección:

1. **Carátula**: título, estudiante, institución, curso, sección y fecha de entrega.
2. **Introducción y objetivos** de aprendizaje, con conocimientos previos.
3. **Conceptos y fórmulas**: integral definida, teorema fundamental del cálculo, propiedades, área bajo la curva, métodos de discos y arandelas y valor promedio, con cuatro gráficas propias y una tabla resumen.
4. **Tres videos** de máximo 1 minuto, uno por cada aplicación.
5. **Cuatro problemas resueltos por escrito**, distintos a los de los videos, cada uno con comprobación.
6. **Seis problemas propuestos** ordenados de menor a mayor dificultad, con respuestas en desplegable.
7. **Fuentes consultadas**.

Otros detalles:

- Diseño de **hoja de cuaderno cuadriculado**, con modo noche opcional (botón de arriba a la derecha).
- Menú fijo arriba para ir a cada página y botones de anterior/siguiente al final; decoración y animaciones reducidas, como pide la guía.
- Fórmulas escritas con [KaTeX](https://katex.org/).
- Diseño responsive y animaciones que respetan la opción "reducir movimiento" del sistema.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Carátula e índice |
| `introduccion.html` | Introducción y objetivos |
| `conceptos.html` | Conceptos, definiciones y propiedades |
| `videos.html` | Tres videos |
| `resueltos.html` | Problemas resueltos |
| `propuestos.html` | Problemas propuestos |
| `fuentes.html` | Fuentes consultadas |
| `estilos.css` | Estilos compartidos (hoja cuadriculada y modo noche) |
| `app.js` | Fórmulas, modo noche, videos y subida a Supabase |

Para cambiar el menú o los botones de anterior/siguiente hay que editarlos en cada página.

## Editar el contenido

- Cada video es un `<div class="video-box" data-slug="video-1" data-youtube="PEGA_ID_VIDEO_1">` (también `video-2` y `video-3`), en `videos.html`.
- **Videos de YouTube (recomendado):** sube cada video a YouTube como **No listado** y pega en `data-youtube` el ID de 11 caracteres de su enlace (`https://youtu.be/ID` o `https://www.youtube.com/watch?v=ID`). Si el atributo no tiene un ID válido, la web usa el video subido a Supabase, y si tampoco hay, muestra "disponible pronto".
- Los problemas resueltos son `<article class="post">` y los propuestos son elementos de `<ol class="props">`, cada uno con su `<details>` para la respuesta.
- Las gráficas son SVG escritos a mano dentro de `conceptos.html` (Figuras 1 a 4) y de `index.html` (portada).

Las fórmulas se escriben con `\( ... \)` (en línea) y `\[ ... \]` (en bloque).

## Subir los videos a Supabase (alternativa, modo autor)

1. Abre la web con `?autor` al final de la dirección:
   `https://jobarreras879-source.github.io/proyecto-final-calculo-2/videos.html?autor`
2. En cada recuadro de video que no tenga YouTube aparece una zona para arrastrar tu video y el botón **Subir**.
3. Se guarda en Supabase como `<slug>-<fecha>.<ext>` y la web muestra siempre el más reciente de cada video.

Los visitantes sin `?autor` solo ven los videos. Los recuadros con `data-youtube` no muestran el formulario.

**Límites:** solo archivos de video y máximo **50 MB**. Es el tope del plan gratuito de Supabase. Si un video pesa más, conviene comprimirlo (por ejemplo con HandBrake o `ffmpeg`) o grabarlo en 720p.

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Storage → New bucket** crea un bucket **público** llamado `videos` con límite de 50 MB y tipos permitidos `video/*`.
3. En el **SQL Editor** ejecuta las políticas:

   ```sql
   create policy "Leer videos (anon)" on storage.objects
   for select to anon using (bucket_id = 'videos');

   create policy "Subir videos (anon)" on storage.objects
   for insert to anon with check (bucket_id = 'videos');
   ```

4. En **Project Settings → API Keys** copia la **Project URL** y la clave `anon` (pública).
5. Abre `app.js` y rellena al inicio:

   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_ANON_KEY = "TU_ANON_KEY";
   ```

> Usa solo la `anon key`. **Nunca** pongas la `service_role` en el código.

## Publicar en GitHub Pages

En el repositorio: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**. Cada `git push` a `main` actualiza la web en uno o dos minutos.

## Aviso de seguridad

`?autor` solo oculta el formulario; no es seguridad real. Con estas políticas, quien conozca la URL puede subir videos al bucket (limitados a video y 50 MB). Para un uso real habría que añadir inicio de sesión y restringir la política de subida a usuarios autenticados.

## Tecnologías

HTML, CSS y JavaScript · [supabase-js](https://supabase.com/docs/reference/javascript) · [KaTeX](https://katex.org/) · Google Fonts (Caveat y Patrick Hand) · GitHub Pages
