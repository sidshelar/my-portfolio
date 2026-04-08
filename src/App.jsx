import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  "https://isdebqwcclirgxvnbnjj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGVicXdjY2xpcmd4dm5ibmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTYwMDIsImV4cCI6MjA5MDM5MjAwMn0.0-3-Zv8gF0vtU2wwn73lp5D1iW47Mg20z6c9PxP0SmE"
);

const ADMIN_PASSWORD = "siddhant2025";

const T = {
  bg: "#0c0c0c",
  bg2: "#141414",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.18)",
  text: "#e8e8e8",
  muted: "rgba(255,255,255,0.35)",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${T.bg}; color: ${T.text}; font-family: 'DM Sans', sans-serif; }
    ::-webkit-scrollbar { width: 3px; background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
    .display { font-family: 'Archivo Black', sans-serif; }

    .fade-in { opacity: 0; transform: translateY(20px); animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
    @keyframes fadeUp { to { opacity: 1; transform: none; } }

    .project-row { cursor: pointer; border-top: 1px solid ${T.border}; transition: background 0.25s; }
    .project-row:hover { background: rgba(255,255,255,0.025); }
    .project-row:hover .proj-arrow { opacity: 1; transform: translateX(0); }
    .proj-arrow { opacity: 0; transform: translateX(-8px); transition: opacity 0.2s, transform 0.2s; font-size: 18px; }

    .nav-link { color: ${T.muted}; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; }
    .nav-link:hover { color: ${T.text}; }

    input, textarea { background: transparent; border: 1px solid ${T.border}; color: ${T.text}; font-family: 'DM Sans', sans-serif; font-size: 13px; padding: 10px 14px; outline: none; transition: border-color 0.2s; width: 100%; border-radius: 0; }
    input:focus, textarea:focus { border-color: ${T.borderHover}; }
    input::placeholder, textarea::placeholder { color: ${T.muted}; }
    label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.muted}; display: block; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; }

    .btn-ghost { background: transparent; border: 1px solid ${T.border}; color: ${T.text}; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 10px 20px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
    .btn-ghost:hover { border-color: ${T.borderHover}; background: rgba(255,255,255,0.03); }
    .btn-danger { background: transparent; border: 1px solid rgba(220,50,50,0.3); color: #e05555; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 10px 20px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
    .btn-danger:hover { border-color: rgba(220,50,50,0.6); background: rgba(220,50,50,0.05); }
    .btn-primary { background: ${T.text}; color: ${T.bg}; border: none; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 12px 28px; cursor: pointer; transition: opacity 0.2s; }
    .btn-primary:hover { opacity: 0.85; }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 9000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-box { background: ${T.bg2}; border: 1px solid ${T.border}; width: min(640px, 95vw); max-height: 90vh; overflow-y: auto; padding: 40px; animation: slideUp 0.3s cubic-bezier(0.22,1,0.36,1); }
    @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: none; opacity: 1; } }

    .detail-page { position: fixed; inset: 0; background: ${T.bg}; z-index: 8000; overflow-y: auto; animation: slideInRight 0.45s cubic-bezier(0.22,1,0.36,1); }
    @keyframes slideInRight { from { transform: translateX(32px); opacity: 0; } to { transform: none; opacity: 1; } }

    .ticker-wrap { overflow: hidden; white-space: nowrap; border-top: 1px solid ${T.border}; border-bottom: 1px solid ${T.border}; padding: 14px 0; }
    .ticker-inner { display: inline-block; animation: ticker 22s linear infinite; }
    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    .admin-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,200,0,0.08); border: 1px solid rgba(255,200,0,0.2); color: rgba(255,200,0,0.7); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; font-family: 'DM Sans', sans-serif; }

    .gallery-item { overflow: hidden; background: ${T.bg2}; cursor: zoom-in; position: relative; }
    .gallery-item img, .gallery-item video { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
    .gallery-item:hover img, .gallery-item:hover video { transform: scale(1.04); }
    .play-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }

    .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.96); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.15s; }
    .lightbox-media { max-width: 92vw; max-height: 88vh; object-fit: contain; display: block; }
    .lightbox-btn { position: fixed; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: ${T.text}; font-size: 20px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; border-radius: 50%; }
    .lightbox-btn:hover { background: rgba(255,255,255,0.14); }

    .add-media-zone { border: 1px dashed ${T.border}; padding: 16px 20px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
    .add-media-zone:hover { border-color: ${T.borderHover}; background: rgba(255,255,255,0.02); }
  `}</style>
);

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ media, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const item = media[idx];
  const prev = () => setIdx(i => (i - 1 + media.length) % media.length);
  const next = () => setIdx(i => (i + 1) % media.length);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [media.length]);

  return (
    <div className="lightbox" onClick={onClose}>
      {media.length > 1 && (
        <button className="lightbox-btn" onClick={e => { e.stopPropagation(); prev(); }} style={{ left: 16, top: "50%", transform: "translateY(-50%)" }}>‹</button>
      )}
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {item.type === "video"
          ? <video src={item.url} controls autoPlay className="lightbox-media" />
          : <img src={item.url} alt="" className="lightbox-media" />
        }
        {media.length > 1 && (
          <div style={{ display: "flex", gap: 6 }}>
            {media.map((_, i) => (
              <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? T.text : "rgba(255,255,255,0.2)", cursor: "pointer", transition: "all 0.2s" }} />
            ))}
          </div>
        )}
      </div>
      {media.length > 1 && (
        <button className="lightbox-btn" onClick={e => { e.stopPropagation(); next(); }} style={{ right: 16, top: "50%", transform: "translateY(-50%)" }}>›</button>
      )}
      <button className="lightbox-btn" onClick={onClose} style={{ top: 16, right: 16 }}>×</button>
    </div>
  );
}

// ─── MEDIA GALLERY (detail page) ──────────────────────────────────────────────
function MediaGallery({ media, isAdmin, onAddMedia, onRemoveMedia }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const fileRef = useRef();

  const addZone = (
    <>
      <div className="add-media-zone" onClick={() => fileRef.current?.click()}>
        <p style={{ fontSize: 11, color: T.muted, letterSpacing: "0.1em" }}>+ Add photos or videos</p>
      </div>
      <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }}
        onChange={e => onAddMedia(e.target.files)} />
    </>
  );

  if (!media || media.length === 0) {
    return isAdmin ? <div style={{ padding: "0 48px 32px" }}>{addZone}</div> : null;
  }

  const first = media[0];
  const rest = media.slice(1);
  const cols = rest.length === 0 ? 1 : rest.length === 1 ? 1 : rest.length === 2 ? 2 : rest.length === 3 ? 3 : 2;

  return (
    <div>
      {/* Cover — full bleed */}
      <div className="gallery-item" style={{ width: "100%", aspectRatio: "16/8" }} onClick={() => setLightboxIdx(0)}>
        {first.type === "video"
          ? <>
              <video src={first.url} muted loop autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div className="play-icon"><svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="26" fill="rgba(0,0,0,0.45)"/><polygon points="21,15 41,26 21,37" fill="white"/></svg></div>
            </>
          : <img src={first.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        }
        {isAdmin && (
          <button onClick={e => { e.stopPropagation(); onRemoveMedia(0); }} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.7)", border: "none", color: T.text, width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>×</button>
        )}
      </div>

      {/* Rest of media in grid */}
      {rest.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3, marginTop: 3 }}>
          {rest.map((m, i) => (
            <div key={i} className="gallery-item" style={{ aspectRatio: cols === 1 ? "16/7" : "4/3" }} onClick={() => setLightboxIdx(i + 1)}>
              {m.type === "video"
                ? <>
                    <video src={m.url} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div className="play-icon"><svg width="40" height="40" viewBox="0 0 52 52"><circle cx="26" cy="26" r="26" fill="rgba(0,0,0,0.45)"/><polygon points="21,15 41,26 21,37" fill="white"/></svg></div>
                  </>
                : <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              }
              {isAdmin && (
                <button onClick={e => { e.stopPropagation(); onRemoveMedia(i + 1); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "none", color: T.text, width: 24, height: 24, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>×</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Admin add more */}
      {isAdmin && <div style={{ padding: "12px 0 0" }}>{addZone}</div>}

      {/* Lightbox */}
      {lightboxIdx !== null && <Lightbox media={media} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ onBack, showBack, onAddProject, isAdmin, onAdminToggle }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: 60, background: scrolled ? "rgba(12,12,12,0.96)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", transition: "background 0.4s", borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <span className="display" style={{ fontSize: 15, color: T.text, letterSpacing: "0.01em" }}>Siddhant Shelar</span>
      </button>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {showBack ? (
          <button className="nav-link" onClick={onBack}>← Back</button>
        ) : (
          <>
            <a href="#projects" className="nav-link">Work</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
            {isAdmin && <button className="btn-ghost" onClick={onAddProject} style={{ marginLeft: 4 }}>+ Add Project</button>}
            <button onClick={onAdminToggle} className="nav-link" style={{ color: isAdmin ? "rgba(255,200,0,0.6)" : T.muted, marginLeft: 8 }}>
              {isAdmin ? "● Admin" : "○"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onScrollToProjects }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 48px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`, backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 100%, transparent 20%, black 100%)" }} />
      <div className="fade-in" style={{ maxWidth: 960 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: T.muted, marginBottom: 28 }}>Industrial Engineering Student</p>
        <h1 className="display" style={{ fontSize: "clamp(52px, 10vw, 136px)", lineHeight: 0.9, color: T.text, marginBottom: 52, letterSpacing: "-0.01em" }}>
          I Like Making Things<br /><span style={{ color: "rgba(255,255,255,0.28)" }}>.</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <button className="btn-primary" onClick={onScrollToProjects}>View Projects</button>
          <span style={{ fontSize: 12, color: T.muted, letterSpacing: "0.04em" }}>Purdue University — B.S. Industrial Engineering</span>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 40, right: 48, fontSize: 10, color: T.muted, letterSpacing: "0.15em", writingMode: "vertical-rl", textTransform: "uppercase" }}>Scroll</div>
    </section>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["Structural Analysis", "FEA", "CAD / CAM", "Thermal Systems", "Mechatronics", "SolidWorks", "ANSYS", "MATLAB", "Machine Shop", "GD&T"];
  const str = [...items, ...items].join("   ·   ");
  return (
    <div className="ticker-wrap" style={{ margin: "80px 0" }}>
      <div className="ticker-inner" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: T.muted }}>
        {str}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{str}
      </div>
    </div>
  );
}

// ─── PROJECTS LIST ─────────────────────────────────────────────────────────────
function ProjectsList({ projects, onOpen, onAdd, isAdmin, onEdit, onDelete, loading }) {
  return (
    <section id="projects" style={{ padding: "0 48px 120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>Selected Work</p>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", color: T.text, letterSpacing: "-0.01em" }}>Projects.</h2>
        </div>
        {isAdmin && <div className="admin-badge">⚡ Admin Mode</div>}
      </div>

      {loading ? (
        <div style={{ padding: "80px 0", textAlign: "center", color: T.muted, fontSize: 12, letterSpacing: "0.1em" }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div style={{ border: `1px dashed ${T.border}`, padding: "80px 48px", textAlign: "center", marginBottom: 24 }}>
          <p className="display" style={{ fontSize: 28, color: "rgba(255,255,255,0.15)", marginBottom: 12 }}>No projects yet.</p>
          {isAdmin && <p style={{ fontSize: 12, color: T.muted }}>Click "+ Add Project" to get started.</p>}
        </div>
      ) : (
        <div style={{ borderBottom: `1px solid ${T.border}` }}>
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} onClick={() => onOpen(p)} isAdmin={isAdmin}
              onEdit={e => { e.stopPropagation(); onEdit(p); }}
              onDelete={e => { e.stopPropagation(); onDelete(p); }} />
          ))}
        </div>
      )}

      {isAdmin && (
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <button className="btn-ghost" onClick={onAdd} style={{ padding: "14px 48px" }}>+ Add Project</button>
        </div>
      )}
    </section>
  );
}

function ProjectRow({ project, index, onClick, isAdmin, onEdit, onDelete }) {
  const num = String(index + 1).padStart(2, "0");
  const thumb = project.media?.[0];
  return (
    <div className="project-row" onClick={onClick} style={{ padding: "28px 0", display: "grid", gridTemplateColumns: "48px 1fr auto auto", alignItems: "center", gap: "0 24px" }}>
      <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.1em" }}>({num})</span>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {thumb && (
          <div style={{ width: 68, height: 44, overflow: "hidden", flexShrink: 0, background: T.bg2 }}>
            {thumb.type === "video"
              ? <video src={thumb.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
              : <img src={thumb.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
        )}
        <div>
          <h3 className="display" style={{ fontSize: "clamp(18px, 3vw, 36px)", color: T.text, lineHeight: 1, letterSpacing: "-0.01em" }}>{project.title || "Untitled"}</h3>
          {project.tag && <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.muted }}>{project.tag}</span>}
        </div>
      </div>
      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 4 }}>
        {project.duration && <p style={{ fontSize: 11, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{project.duration}</p>}
        {project.year && <p style={{ fontSize: 11, color: T.muted }}>{project.year}</p>}
        {isAdmin && (
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }} onClick={e => e.stopPropagation()}>
            <button onClick={onEdit} style={{ background: "none", border: "none", color: T.muted, fontSize: 11, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", padding: 0, textDecoration: "underline", textUnderlineOffset: 3 }}>Edit</button>
            <button onClick={onDelete} style={{ background: "none", border: "none", color: "#e05555", fontSize: 11, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", padding: 0, textDecoration: "underline", textUnderlineOffset: 3 }}>Delete</button>
          </div>
        )}
      </div>
      <span className="proj-arrow" style={{ color: T.text }}>→</span>
    </div>
  );
}

// ─── PROJECT DETAIL ───────────────────────────────────────────────────────────
function ProjectDetail({ project, onClose, projects, onOpenProject, isAdmin, onEdit, onMediaUpdate }) {
  const ref = useRef(null);
  const currentIdx = projects.findIndex(p => p.id === project.id);
  const nextProject = projects[(currentIdx + 1) % projects.length];
  const showNext = projects.length > 1;
  const media = project.media || [];

  useEffect(() => { ref.current?.scrollTo(0, 0); }, [project.id]);

  useEffect(() => {
    window.history.pushState({ projectId: project.id }, "");
    const handler = () => onClose();
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [project.id]);

  const handleAddMedia = useCallback(async (files) => {
    const tasks = Array.from(files).map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve({ type: file.type.startsWith("video") ? "video" : "image", url: e.target.result, name: file.name });
      reader.readAsDataURL(file);
    }));
    const newMedia = await Promise.all(tasks);
    await onMediaUpdate(project.id, [...media, ...newMedia]);
  }, [media, project.id, onMediaUpdate]);

  const handleRemoveMedia = useCallback(async (idx) => {
    await onMediaUpdate(project.id, media.filter((_, i) => i !== idx));
  }, [media, project.id, onMediaUpdate]);

  return (
    <div className="detail-page" ref={ref}>
      <Nav showBack onBack={() => window.history.back()} isAdmin={isAdmin} />
      <div style={{ height: 60 }} />

      {/* Full gallery — all media */}
      <MediaGallery media={media} isAdmin={isAdmin} onAddMedia={handleAddMedia} onRemoveMedia={handleRemoveMedia} />

      {/* Title + meta */}
      <div style={{ padding: "56px 48px 0", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start" }}>
          <div>
            {project.tag && <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>{project.tag}</p>}
            <h1 className="display" style={{ fontSize: "clamp(48px, 8vw, 108px)", lineHeight: 0.9, letterSpacing: "-0.01em", color: T.text }}>
              {project.title || "Untitled"}.
            </h1>
            {isAdmin && <button onClick={() => onEdit(project)} className="btn-ghost" style={{ marginTop: 24, fontSize: 10 }}>Edit Details</button>}
          </div>
          <div style={{ textAlign: "right", paddingTop: 8 }}>
            {project.duration && <p style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{project.duration}</p>}
            {project.year && <p style={{ fontSize: 12, color: T.muted }}>{project.year}</p>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 56, paddingBottom: 64, borderBottom: `1px solid ${T.border}` }}>
          <div>
            {project.description && <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", maxWidth: 500 }}>{project.description}</p>}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 32, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: T.text, textDecoration: "underline", textUnderlineOffset: 5 }}>
                ↗ {project.link_label || "View Link"}
              </a>
            )}
          </div>
          {project.skills && (
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>Methods</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>{project.skills}</p>
            </div>
          )}
        </div>
      </div>

      {/* Next project */}
      {showNext && nextProject && nextProject.id !== project.id && (
        <div style={{ padding: "80px 48px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>Next</p>
            <button onClick={() => onOpenProject(nextProject)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <h3 className="display" style={{ fontSize: "clamp(28px, 4vw, 56px)", color: T.text, letterSpacing: "-0.01em" }}>{nextProject.title} →</h3>
            </button>
          </div>
          {nextProject.media?.[0] && (
            <div style={{ width: 128, height: 80, overflow: "hidden", background: T.bg2, flexShrink: 0 }}>
              <img src={nextProject.media[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
        </div>
      )}

      <div style={{ padding: "36px 48px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: T.muted }}>2025 by Siddhant Shelar</span>
        <button className="nav-link" onClick={() => window.history.back()}>← Back to work</button>
      </div>
    </div>
  );
}

// ─── PROJECT FORM MODAL ───────────────────────────────────────────────────────
function ProjectModal({ onClose, onSave, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial || { title: "", tag: "", duration: "", year: new Date().getFullYear().toString(), description: "", skills: "", link: "", link_label: "", media: [] });
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const processFiles = useCallback((files) => {
    const tasks = Array.from(files).map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve({ type: file.type.startsWith("video") ? "video" : "image", url: e.target.result, name: file.name });
      reader.readAsDataURL(file);
    }));
    Promise.all(tasks).then(newMedia => setForm(f => ({ ...f, media: [...(f.media || []), ...newMedia] })));
  }, []);

  const removeMedia = (i) => setForm(f => ({ ...f, media: f.media.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <h2 className="display" style={{ fontSize: 26, color: T.text }}>{isEdit ? "Edit Project" : "Add Project"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div><label>Project Title *</label><input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Stress Analysis Rig" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div><label>Category / Tag</label><input value={form.tag} onChange={e => set("tag", e.target.value)} placeholder="Structural" /></div>
            <div><label>Duration</label><input value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="6 Weeks" /></div>
            <div><label>Year</label><input value={form.year} onChange={e => set("year", e.target.value)} placeholder="2025" /></div>
          </div>
          <div><label>Description</label><textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="What did you build? What problem does it solve?" rows={4} style={{ resize: "vertical" }} /></div>
          <div><label>Methods / Skills Used</label><input value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="FEA, SolidWorks, ASTM D638, ..." /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label>External Link (optional)</label><input value={form.link} onChange={e => set("link", e.target.value)} placeholder="https://..." /></div>
            <div><label>Link Label</label><input value={form.link_label} onChange={e => set("link_label", e.target.value)} placeholder="View Report" /></div>
          </div>
          <div>
            <label>Photos & Videos</label>
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current.click()}
              style={{ border: `1px dashed ${dragOver ? T.borderHover : T.border}`, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(255,255,255,0.02)" : "transparent", transition: "border-color 0.2s" }}>
              <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={e => processFiles(e.target.files)} />
              <p style={{ fontSize: 12, color: T.muted }}>Drop images or videos here, or click to browse</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 5 }}>First file becomes the cover thumbnail</p>
            </div>
            {form.media?.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginTop: 10 }}>
                {form.media.map((m, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: T.bg2 }}>
                    {m.type === "video" ? <video src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    {i === 0 && <div style={{ position: "absolute", top: 3, left: 3, background: "rgba(0,0,0,0.75)", color: T.text, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 5px" }}>Cover</div>}
                    <button onClick={() => removeMedia(i)} style={{ position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,0.75)", border: "none", color: T.text, width: 18, height: 18, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving || !form.title.trim()}>{saving ? "Saving..." : isEdit ? "Save Changes" : "Add Project"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminModal({ onClose, onSuccess }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const check = () => {
    if (pw === ADMIN_PASSWORD) { onSuccess(); onClose(); }
    else { setErr(true); setTimeout(() => setErr(false), 1200); }
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 360, padding: 36 }}>
        <h2 className="display" style={{ fontSize: 22, color: T.text, marginBottom: 24 }}>Admin Access</h2>
        <label>Password</label>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} placeholder="Enter password" style={{ borderColor: err ? "#e05555" : T.border }} autoFocus />
        {err && <p style={{ fontSize: 11, color: "#e05555", marginTop: 8 }}>Incorrect password</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-primary" onClick={check} style={{ flex: 1 }}>Unlock</button>
        </div>
      </div>
    </div>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────
function DeleteConfirm({ project, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 380, padding: 36 }}>
        <h2 className="display" style={{ fontSize: 22, color: T.text, marginBottom: 12 }}>Delete Project?</h2>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 28 }}>
          This will permanently delete <strong style={{ color: T.text }}>{project.title}</strong>. This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-danger" style={{ flex: 1 }} onClick={async () => { setDeleting(true); await onConfirm(); setDeleting(false); onClose(); }}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "120px 48px", borderTop: `1px solid ${T.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: T.muted, marginBottom: 24 }}>About</p>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 52px)", color: T.text, lineHeight: 1.1, marginBottom: 32 }}>
            Hi my name is Siddhant Shelar<br /><span style={{ color: "rgba(255,255,255,0.3)" }}></span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.55)", maxWidth: 440, marginBottom: 20 }}>
            Industrial engineering student with a focus on Robotics, Manufacturing, and Mechatronics. I believe in understanding a problem deeply before reaching for a solution.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.55)", maxWidth: 440 }}>
            Outside of coursework, I'm usually in the machine shop, running simulations, or designing something I can hold in my hands.
          </p>
        </div>
        <div style={{ paddingTop: 56 }}>
          {[
            ["Education", "Purdue University — B.S. Industrial Engineering"],
            ["Focus Areas", "Manufacturing · Robotics · Mechatronics"],
            ["Software", "SolidWorks · ANSYS · MATLAB · AutoCAD · OnShape"],
            ["Status", "Seeking internship opportunities — 2025"],
          ].map(([k, v]) => (
            <div key={k} style={{ padding: "20px 0", borderBottom: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>{k}</p>
              <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{ padding: "120px 48px 80px", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: T.muted, marginBottom: 24 }}>Contact</p>
        <h2 className="display" style={{ fontSize: "clamp(40px, 8vw, 100px)", color: T.text, lineHeight: 0.9, letterSpacing: "-0.01em", marginBottom: 80 }}>Let's connect.</h2>
        <div style={{ borderTop: `1px solid ${T.border}` }}>
          {[
            { label: "Email", val: "shelar@purdue.edu", href: "mailto:shelar@purdue.edu" },
            { label: "LinkedIn", val: "linkedin.com/in/siddhant-shelar", href: "#" },
            { label: "GitHub", val: "github.com/siddhant-shelar", href: "#" },
          ].map(({ label, val, href }) => (
            <a key={label} href={href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderBottom: `1px solid ${T.border}`, textDecoration: "none", color: T.text, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.5} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 14, color: T.text }}>{val}</p>
              </div>
              <span style={{ fontSize: 18 }}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: "32px 48px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11, color: T.muted }}>© 2025 Siddhant Shelar. All rights reserved.</span>
      <span className="display" style={{ fontSize: 13, color: "rgba(255,255,255,0.15)" }}>Industrial Engineering</span>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: true });
    if (!error) setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    const handler = (e) => { if (!e.state?.projectId) setActiveProject(null); };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const handleAddProject = async (form) => {
    const row = { id: Date.now().toString(), title: form.title, tag: form.tag, duration: form.duration, year: form.year, description: form.description, skills: form.skills, link: form.link, link_label: form.link_label, media: form.media || [] };
    const { data, error } = await supabase.from("projects").insert([row]).select();
    if (!error && data) setProjects(prev => [...prev, data[0]]);
  };

  const handleEditProject = async (form) => {
    const row = { title: form.title, tag: form.tag, duration: form.duration, year: form.year, description: form.description, skills: form.skills, link: form.link, link_label: form.link_label, media: form.media || [] };
    const { data, error } = await supabase.from("projects").update(row).eq("id", form.id).select();
    if (!error && data) {
      setProjects(prev => prev.map(p => p.id === form.id ? data[0] : p));
      if (activeProject?.id === form.id) setActiveProject(data[0]);
    }
  };

  const handleDeleteProject = async (project) => {
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== project.id));
      if (activeProject?.id === project.id) setActiveProject(null);
    }
  };

  // Called directly from detail page to update just the media array
  const handleMediaUpdate = async (projectId, updatedMedia) => {
    const { data, error } = await supabase.from("projects").update({ media: updatedMedia }).eq("id", projectId).select();
    if (!error && data) {
      setProjects(prev => prev.map(p => p.id === projectId ? data[0] : p));
      if (activeProject?.id === projectId) setActiveProject(data[0]);
    }
  };

  const openProject = (p) => { setActiveProject(p); window.scrollTo(0, 0); };
  const closeProject = () => setActiveProject(null);
  const scrollToProjects = () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <GlobalStyle />
      {activeProject ? (
        <ProjectDetail project={activeProject} projects={projects} onClose={closeProject} onOpenProject={openProject} isAdmin={isAdmin} onEdit={p => setEditingProject(p)} onMediaUpdate={handleMediaUpdate} />
      ) : (
        <div style={{ background: T.bg, minHeight: "100vh" }}>
          <Nav onBack={closeProject} showBack={false} onAddProject={() => setShowAddModal(true)} isAdmin={isAdmin} onAdminToggle={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} />
          <Hero onScrollToProjects={scrollToProjects} />
          <Ticker />
          <ProjectsList projects={projects} onOpen={openProject} onAdd={() => setShowAddModal(true)} isAdmin={isAdmin} onEdit={setEditingProject} onDelete={setDeletingProject} loading={loading} />
          <About />
          <Contact />
          <Footer />
        </div>
      )}
      {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} onSuccess={() => setIsAdmin(true)} />}
      {showAddModal && isAdmin && <ProjectModal onClose={() => setShowAddModal(false)} onSave={handleAddProject} />}
      {editingProject && isAdmin && <ProjectModal initial={editingProject} onClose={() => setEditingProject(null)} onSave={form => handleEditProject({ ...form, id: editingProject.id })} />}
      {deletingProject && isAdmin && <DeleteConfirm project={deletingProject} onClose={() => setDeletingProject(null)} onConfirm={() => handleDeleteProject(deletingProject)} />}
    </>
  );
}