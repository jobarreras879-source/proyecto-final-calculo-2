// ====== CONFIGURA AQUÍ ======
const SUPABASE_URL = "https://irnnzpwjfuithmcvmhou.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlybm56cHdqZnVpdGhtY3ZtaG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MzY4NTMsImV4cCI6MjEwNzQxMjg1M30.PBxr6Rro21eP9KSA_aPqlx2u0kNEXWOzwQbZlycoNGE"; // solo la anon key, NUNCA la service_role
// ============================

const BUCKET = "videos";
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const AUTOR = new URLSearchParams(location.search).has("autor");

const $ = (id) => document.getElementById(id);
const configured = !SUPABASE_URL.includes("TU-PROYECTO") && !SUPABASE_ANON_KEY.startsWith("TU_");
const sb = configured && window.supabase ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

/* ---------- Fórmulas ---------- */
window.addEventListener("load", () => {
  if (window.renderMathInElement) renderMathInElement(document.body, {
    delimiters: [
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
  });
});

/* ---------- Tema (hoja blanca por defecto, "modo noche" opcional) ---------- */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("themeBtn").textContent = theme === "dark" ? "☀️ Modo hoja" : "🌙 Modo noche";
  try { localStorage.setItem("hoja-theme", theme); } catch (e) {}
}
let savedTheme = "light";
try { savedTheme = localStorage.getItem("hoja-theme") || "light"; } catch (e) {}
applyTheme(savedTheme);
$("themeBtn").addEventListener("click", () =>
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

if (AUTOR && $("autorBanner")) $("autorBanner").classList.remove("hidden");

/* ---------- Videos: YouTube (data-youtube) o Supabase (data-slug) ---------- */
// Si el recuadro tiene data-youtube="ID" (11 caracteres de la URL de YouTube), se incrusta ese video.
function youtubeId(box) {
  const id = (box.dataset.youtube || "").trim();
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

function showYouTube(body, id) {
  body.innerHTML = "";
  const f = document.createElement("iframe");
  f.className = "yt";
  f.src = `https://www.youtube-nocookie.com/embed/${id}`;
  f.title = "Video explicativo";
  f.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  f.allowFullscreen = true;
  f.loading = "lazy";
  body.appendChild(f);
}

// Los videos de Supabase se guardan como "<slug>-<fecha>.<ext>"; se muestra el más reciente.
async function fetchVideoNames() {
  if (!sb) return null;
  const { data, error } = await sb.storage.from(BUCKET).list("", {
    limit: 1000, sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw error;
  return (data || []).filter((f) => f.id).map((f) => f.name);
}

function latestFor(slug, names) {
  const re = new RegExp("^" + slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "-\\d+\\.");
  return names.find((n) => re.test(n)) || null; // names ya viene ordenado: el más nuevo primero
}

function buildBox(box, slug) {
  box.innerHTML = "";
  const head = document.createElement("header");
  head.innerHTML = '<span class="rec"></span> Mira cómo lo resuelvo';
  const body = document.createElement("div");
  body.className = "vb-body";
  box.append(head, body);
  if (AUTOR && !youtubeId(box)) box.appendChild(buildUploader(box, slug));
  return body;
}

function placeholder(body, text) {
  body.innerHTML = "";
  const p = document.createElement("div");
  p.className = "placeholder";
  p.innerHTML = '<span class="ico"></span><span></span>';
  p.lastChild.textContent = text;
  body.appendChild(p);
}

function showVideo(body, slug, name) {
  if (!name) return placeholder(body, "El video estará disponible pronto.");
  body.innerHTML = "";
  const v = document.createElement("video");
  v.controls = true; v.playsInline = true; v.preload = "metadata";
  v.src = sb.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  body.appendChild(v);
}

async function loadAll() {
  const boxes = [...document.querySelectorAll(".video-box[data-slug]")].map((box) => ({
    slug: box.dataset.slug, box,
  }));
  const bodies = boxes.map(({ slug, box }) => ({ slug, box, yt: youtubeId(box), body: buildBox(box, slug) }));
  // Primero los videos de YouTube (no necesitan Supabase)
  bodies.filter((b) => b.yt).forEach((b) => showYouTube(b.body, b.yt));
  const pending = bodies.filter((b) => !b.yt);
  if (!pending.length) return;
  let names = [];
  try {
    names = await fetchVideoNames();
    if (names === null) throw new Error("sin conexión con el almacenamiento");
  } catch (e) {
    pending.forEach(({ body }) => placeholder(body, "El video estará disponible pronto."));
    return;
  }
  pending.forEach(({ slug, body }) => showVideo(body, slug, latestFor(slug, names)));
}

/* ---------- Subida a Supabase (solo modo autor) ---------- */
function validate(file) {
  if (!file) return "Primero elige un archivo de video.";
  if (!file.type.startsWith("video/")) return "El archivo no es un video. Elige un archivo de video válido.";
  if (file.size > MAX_SIZE)
    return `El video pesa ${(file.size / 1024 / 1024).toFixed(1)} MB y el máximo permitido es 50 MB.`;
  return null;
}

function buildUploader(box, slug) {
  const wrap = document.createElement("div");
  wrap.className = "uploader";
  wrap.innerHTML = `
    <label class="dropzone">
      <div><strong>Arrastra tu video aquí</strong> o haz clic para elegirlo (máx. 50 MB)</div>
      <span class="fname"></span>
      <input type="file" accept="video/*">
    </label>
    <div class="up-row">
      <button type="button" class="btn-primary">Subir</button>
      <span class="status" role="status" aria-live="polite"></span>
    </div>`;
  const dz = wrap.querySelector(".dropzone");
  const input = wrap.querySelector("input");
  const fname = wrap.querySelector(".fname");
  const btn = wrap.querySelector("button");
  const status = wrap.querySelector(".status");
  let file = null;

  const setStatus = (t, c = "") => { status.textContent = t; status.className = "status " + c; };
  const pick = (f) => {
    file = f || null;
    fname.textContent = f ? `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)` : "";
    const err = f ? validate(f) : null;
    err ? setStatus(err, "error") : setStatus("");
  };

  input.addEventListener("change", () => pick(input.files[0]));
  ["dragenter", "dragover"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("drag"); }));
  dz.addEventListener("drop", (e) => {
    const f = e.dataTransfer.files[0];
    if (f) { try { const dt = new DataTransfer(); dt.items.add(f); input.files = dt.files; } catch (err) {} pick(f); }
  });

  btn.addEventListener("click", async () => {
    if (!sb) return setStatus("Falta configurar SUPABASE_URL y SUPABASE_ANON_KEY.", "error");
    const err = validate(file);
    if (err) return setStatus(err, "error");
    const ext = (file.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
    const path = `${slug}-${Date.now()}.${ext}`;
    btn.disabled = true;
    setStatus("Subiendo...", "loading");
    try {
      const { error } = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      setStatus("Listo", "ok");
      showVideo(box.querySelector(".vb-body"), slug, path);
      pick(null); input.value = "";
    } catch (e) {
      setStatus("Error al subir: " + (e.message || e), "error");
    } finally {
      btn.disabled = false;
    }
  });
  return wrap;
}

/* ---------- Menú: mostrar la página actual y aparición al hacer scroll ---------- */
const menu = document.querySelector(".menu");
const current = menu && menu.querySelector('[aria-current="page"]');
if (current) menu.scrollLeft = current.offsetLeft - (menu.clientWidth - current.offsetWidth) / 2;

const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.04, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

loadAll();
