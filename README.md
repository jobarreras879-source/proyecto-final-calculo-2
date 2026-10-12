# Supabase Video Uploader

Página web sencilla (un solo `index.html`, sin frameworks) para subir y reproducir videos con **Supabase Storage**.

- Arrastra y suelta o elige un video (máx. 50 MB, solo formatos de video).
- Se sube al bucket público `videos` con un nombre único.
- Reproductor grande arriba y cuadrícula con todos los videos del bucket; haz clic en cualquiera para verlo.
- Modo oscuro por defecto, con botón para cambiar a modo claro.

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **Storage → New bucket**, llámalo `videos` y activa **Public bucket**.
3. En el **SQL Editor** ejecuta las políticas:

   ```sql
   create policy "Leer videos (anon)"
   on storage.objects for select
   to anon
   using (bucket_id = 'videos');

   create policy "Subir videos (anon)"
   on storage.objects for insert
   to anon
   with check (bucket_id = 'videos');
   ```

4. En **Project Settings → API** copia la **Project URL** y la clave **anon public**.
5. Abre `index.html` y rellena al inicio del script:

   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_ANON_KEY = "TU_ANON_KEY";
   ```

> Usa solo la `anon key`. Nunca pongas la `service_role` en el código.

## Uso local

Abre `index.html` en el navegador (o sírvelo con `python -m http.server`).

## Aviso

Con estas políticas, **cualquiera que visite la web puede subir videos** a tu bucket. Para uso real, añade autenticación o límites de tamaño/tipo en el bucket.
