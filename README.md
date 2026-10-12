# Cálculo 2 · Ejercicios resueltos (blog con video)

Blog de una sola página (`index.html`, HTML/CSS/JS puro) con ejercicios de Cálculo 2 resueltos paso a paso. Al final de cada entrada hay un recuadro con el **video** donde se explica el ejercicio, guardado en **Supabase Storage**.

- Fórmulas con [KaTeX](https://katex.org/).
- Modo oscuro por defecto, con botón para modo claro.
- Diseño responsive.

## Añadir o editar ejercicios

En `index.html` cada ejercicio es un `<article class="post" data-slug="...">`. Copia uno, cambia el `data-slug` (único, sin espacios ni acentos), el texto y el índice de arriba. El video se enlaza solo con ese `data-slug`.

## Subir los videos (modo autor)

1. Abre la web con `?autor` al final de la dirección, por ejemplo `.../supabase-video-uploader/?autor`.
2. En cada entrada aparece una zona para arrastrar tu video (solo video, máx. 50 MB) y el botón **Subir**.
3. Se guarda como `<slug>-<fecha>.<ext>` y la web siempre muestra el más reciente de cada entrada.

Los visitantes sin `?autor` solo ven los videos.

## Configurar Supabase

1. Crea un bucket **público** llamado `videos` (límite 50 MB, tipos `video/*`).
2. En el **SQL Editor** ejecuta:

   ```sql
   create policy "Leer videos (anon)" on storage.objects
   for select to anon using (bucket_id = 'videos');

   create policy "Subir videos (anon)" on storage.objects
   for insert to anon with check (bucket_id = 'videos');
   ```

3. En `index.html` rellena `SUPABASE_URL` y `SUPABASE_ANON_KEY` (solo la **anon key**, nunca la `service_role`).

## Aviso

`?autor` solo oculta el formulario; no es seguridad real. Con estas políticas, quien conozca la URL puede subir videos al bucket (limitado a video y 50 MB). Para producción habría que añadir inicio de sesión.
