# Proyecto final · Cálculo 2

Blog de una sola página (`index.html`, HTML, CSS y JavaScript puro, sin frameworks) con ejercicios de Cálculo 2 resueltos paso a paso. Al final de cada entrada hay un recuadro con el **video** donde se explica el ejercicio, guardado en **Supabase Storage**.

🔗 **Web:** https://jobarreras879-source.github.io/supabase-video-uploader/

## Qué incluye

- Diseño de **hoja de cuaderno cuadriculado** que ocupa toda la pantalla: margen rojo, perforaciones, símbolos matemáticos flotantes, notas adhesivas y letra manuscrita.
- Cada ejercicio con enunciado, idea clave, solución numerada paso a paso y resultado destacado.
- Fórmulas escritas con [KaTeX](https://katex.org/).
- El video de cada ejercicio aparece al final, como una foto pegada con cinta.
- **Modo hoja** (blanco) por defecto y **modo noche** opcional con el botón de arriba a la derecha.
- Diseño responsive y animaciones que respetan la opción "reducir movimiento" del sistema.

## Añadir o editar ejercicios

En `index.html` cada ejercicio es un `<article class="post reveal" data-slug="...">` con dos columnas:

- `post-side`: título, enunciado e idea clave (izquierda).
- `post-main`: solución paso a paso y resultado (derecha).

Para añadir uno nuevo, copia un `<article>`, cambia el `data-slug` (único, sin espacios ni acentos), el contenido y agrega su enlace en el índice (`<nav class="index">`). El video se enlaza solo con ese `data-slug`.

Las fórmulas se escriben con `\( ... \)` (en línea) y `\[ ... \]` (en bloque).

## Subir los videos (modo autor)

1. Abre la web con `?autor` al final de la dirección:
   `https://jobarreras879-source.github.io/supabase-video-uploader/?autor`
2. En cada entrada aparece una zona para arrastrar tu video y el botón **Subir**.
3. Se guarda en Supabase como `<slug>-<fecha>.<ext>` y la web muestra siempre el más reciente de cada ejercicio.

Los visitantes sin `?autor` solo ven los videos.

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
5. Abre `index.html` y rellena al inicio del último `<script>`:

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
