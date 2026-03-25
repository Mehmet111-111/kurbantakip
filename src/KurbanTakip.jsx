import { useState, useEffect, useCallback } from "react";

// ---- Supabase Config ----
const SUPABASE_URL = "https://levyrpdckgieydnbqowg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldnlycGRja2dpZXlkbmJxb3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzM1NjMsImV4cCI6MjA5MDA0OTU2M30.zKSX8R6xyWl-seRnNimn4X8S3_UqOFSsM1eVg5VCqKQ";

const supaFetch = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.method === "POST" ? "return=representation" : "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// ---- Formatters ----
const formatTL = (n) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n || 0);
const formatDate = (d) =>
  new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });

// ---- Icons ----
const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const PlusIcon = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;
const TrashIcon = (p) => <Icon {...p} d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />;
const EditIcon = (p) => <Icon {...p} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />;
const BackIcon = (p) => <Icon {...p} d="M19 12H5M12 19l-7-7 7-7" />;
const SearchIcon = (p) => <Icon {...p} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />;
const PhoneIcon = (p) => <Icon {...p} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />;
const CowIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <ellipse cx="12" cy="14" rx="7" ry="6" />
    <ellipse cx="9" cy="13" rx="1" ry="1" fill="currentColor" />
    <ellipse cx="15" cy="13" rx="1" ry="1" fill="currentColor" />
    <path d="M4 10C2 7 3 4 5 5" strokeLinecap="round" />
    <path d="M20 10C22 7 21 4 19 5" strokeLinecap="round" />
    <ellipse cx="12" cy="17" rx="2.5" ry="1.5" strokeWidth="1.2" />
  </svg>
);
const UserIcon = (p) => <Icon {...p} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8" />;
const WalletIcon = (p) => <Icon {...p} d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5zM16 12a1 1 0 100 2 1 1 0 000-2z" />;
const FilterIcon = (p) => <Icon {...p} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />;
const NoteIcon = (p) => <Icon {...p} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />;
const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ---- Modal ----
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)"
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#1a1f2e", borderRadius: 16, padding: "28px 32px",
        minWidth: 420, maxWidth: 520, width: "90%",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
        maxHeight: "85vh", overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#8892a4", fontSize: 22, cursor: "pointer"
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ---- Input ----
const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 12, color: "#8892a4", marginBottom: 5, fontWeight: 500 }}>{label}</label>
    <input {...props} style={{
      width: "100%", padding: "10px 14px", background: "#0f1219", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
      ...(props.style || {})
    }} />
  </div>
);

// ---- Textarea ----
const TextArea = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 12, color: "#8892a4", marginBottom: 5, fontWeight: 500 }}>{label}</label>
    <textarea {...props} style={{
      width: "100%", padding: "10px 14px", background: "#0f1219", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
      minHeight: 60, resize: "vertical", fontFamily: "inherit",
      ...(props.style || {})
    }} />
  </div>
);

// ---- WhatsApp helper ----
const openWhatsApp = (phone, message) => {
  const clean = phone.replace(/\D/g, "").replace(/^0/, "90");
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

// ---- Debt status helper ----
const getDebtStatus = (toplam, odenen) => {
  if (toplam <= 0) return { label: "Belirsiz", color: "#8892a4", bg: "#8892a420" };
  const pct = (odenen / toplam) * 100;
  if (pct >= 100) return { label: "Tamamlandı", color: "#27ae60", bg: "#27ae6020" };
  if (pct > 0) return { label: "Kısmi Ödeme", color: "#e67e22", bg: "#e67e2220" };
  return { label: "Ödeme Yok", color: "#e74c3c", bg: "#e74c3c20" };
};

// ---- Main App ----
export default function KurbanTakip() {
  const [danalar, setDanalar] = useState([]);
  const [musteriler, setMusteriler] = useState([]);
  const [odemeler, setOdemeler] = useState([]);
  const [view, setView] = useState("dashboard");
  const [selectedDana, setSelectedDana] = useState(null);
  const [selectedMusteri, setSelectedMusteri] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debtFilter, setDebtFilter] = useState("all");

  // ---- Data fetching ----
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [d, m, o] = await Promise.all([
        supaFetch("danalar?order=created_at.desc"),
        supaFetch("musteriler?order=hisse_no.asc"),
        supaFetch("odemeler?order=tarih.desc"),
      ]);
      setDanalar(d || []);
      setMusteriler(m || []);
      setOdemeler(o || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ---- Helpers ----
  const getMusterilerByDana = (danaId) => musteriler.filter((m) => m.dana_id === danaId);
  const getOdemelerByMusteri = (musteriId) => odemeler.filter((o) => o.musteri_id === musteriId);
  const getTotalOdenen = (musteriId) => getOdemelerByMusteri(musteriId).reduce((s, o) => s + Number(o.tutar), 0);

  const getDanaStats = (danaId) => {
    const ms = getMusterilerByDana(danaId);
    const toplamUcret = ms.reduce((s, m) => s + Number(m.toplam_ucret), 0);
    const toplamOdenen = ms.reduce((s, m) => s + getTotalOdenen(m.id), 0);
    return { dpieces: ms.length, toplamUcret, toplamOdenen, kalan: toplamUcret - toplamOdenen };
  };

  const globalStats = {
    toplamDana: danalar.length,
    toplamMusteri: musteriler.length,
    toplamAlacak: musteriler.reduce((s, m) => s + Number(m.toplam_ucret), 0),
    toplamOdenen: musteriler.reduce((s, m) => s + getTotalOdenen(m.id), 0),
  };

  // ---- Search & Filter ----
  const searchResults = searchQuery.trim().length > 0
    ? musteriler.filter((m) => {
        const q = searchQuery.toLowerCase();
        return m.ad_soyad.toLowerCase().includes(q) || (m.telefon && m.telefon.includes(q));
      })
    : null;

  const getFilteredMusteriler = () => {
    let list = musteriler;
    if (debtFilter === "unpaid") list = list.filter((m) => getTotalOdenen(m.id) === 0 && Number(m.toplam_ucret) > 0);
    if (debtFilter === "partial") list = list.filter((m) => { const o = getTotalOdenen(m.id); return o > 0 && o < Number(m.toplam_ucret); });
    if (debtFilter === "paid") list = list.filter((m) => getTotalOdenen(m.id) >= Number(m.toplam_ucret) && Number(m.toplam_ucret) > 0);
    return list;
  };

  // ---- CRUD ----
  const addDana = async (data) => {
    await supaFetch("danalar", { method: "POST", body: JSON.stringify(data) });
    await fetchAll(); setModal(null);
  };
  const updateDana = async (id, data) => {
    await supaFetch(`danalar?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(data) });
    await fetchAll(); setModal(null);
  };
  const deleteDana = async (id) => {
    if (!confirm("Bu danayı ve tüm müşteri/ödeme kayıtlarını silmek istediğinize emin misiniz?")) return;
    await supaFetch(`danalar?id=eq.${id}`, { method: "DELETE" });
    await fetchAll(); setView("dashboard"); setSelectedDana(null);
  };
  const addMusteri = async (data) => {
    await supaFetch("musteriler", { method: "POST", body: JSON.stringify(data) });
    await fetchAll(); setModal(null);
  };
  const updateMusteri = async (id, data) => {
    await supaFetch(`musteriler?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(data) });
    await fetchAll(); setModal(null);
  };
  const deleteMusteri = async (id) => {
    if (!confirm("Bu müşteriyi ve ödeme kayıtlarını silmek istediğinize emin misiniz?")) return;
    await supaFetch(`musteriler?id=eq.${id}`, { method: "DELETE" });
    await fetchAll();
    if (view === "musteri-detay") { setView("dana-detay"); setSelectedMusteri(null); }
  };
  const addOdeme = async (data) => {
    await supaFetch("odemeler", { method: "POST", body: JSON.stringify(data) });
    await fetchAll(); setModal(null);
  };
  const deleteOdeme = async (id) => {
    if (!confirm("Bu ödeme kaydını silmek istediğinize emin misiniz?")) return;
    await supaFetch(`odemeler?id=eq.${id}`, { method: "DELETE" });
    await fetchAll();
  };

  // ---- Forms ----
  const DanaForm = ({ initial, onSubmit }) => {
    const [form, setForm] = useState(initial || { numara: "", toplam_fiyat: "", not_text: "" });
    return (
      <div>
        <Input label="Dana Adı / Numarası" value={form.numara} onChange={(e) => setForm({ ...form, numara: e.target.value })} placeholder="ör: Dana #1" />
        <Input label="Toplam Fiyat (₺)" type="number" value={form.toplam_fiyat} onChange={(e) => setForm({ ...form, toplam_fiyat: e.target.value })} placeholder="ör: 70000" />
        <TextArea label="Not (opsiyonel)" value={form.not_text} onChange={(e) => setForm({ ...form, not_text: e.target.value })} placeholder="ör: 350kg tahmini, angus cinsi" />
        <button onClick={() => onSubmit(form)} style={btnPrimary}>
          {initial ? "Güncelle" : "Dana Ekle"}
        </button>
      </div>
    );
  };

  const MusteriForm = ({ danaId, initial, onSubmit, takenHisses }) => {
    const [form, setForm] = useState(initial || { ad_soyad: "", telefon: "", adres: "", hisse_no: "", toplam_ucret: "", not_text: "" });
    const available = [1, 2, 3, 4, 5, 6, 7].filter((h) => !takenHisses.includes(h) || h === initial?.hisse_no);
    return (
      <div>
        <Input label="Ad Soyad" value={form.ad_soyad} onChange={(e) => setForm({ ...form, ad_soyad: e.target.value })} placeholder="Müşteri adı" />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, color: "#8892a4", marginBottom: 5, fontWeight: 500 }}>Hisse No</label>
          <select value={form.hisse_no} onChange={(e) => setForm({ ...form, hisse_no: Number(e.target.value) })} style={{
            width: "100%", padding: "10px 14px", background: "#0f1219", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, color: "#fff", fontSize: 14, outline: "none"
          }}>
            <option value="">Hisse seçin</option>
            {available.map((h) => <option key={h} value={h}>Hisse {h}</option>)}
          </select>
        </div>
        <Input label="Telefon" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} placeholder="05xx xxx xxxx" />
        <Input label="Adres" value={form.adres} onChange={(e) => setForm({ ...form, adres: e.target.value })} placeholder="Mahalle, sokak, no" />
        <Input label="Toplam Ücret (₺)" type="number" value={form.toplam_ucret} onChange={(e) => setForm({ ...form, toplam_ucret: e.target.value })} placeholder="ör: 10000" />
        <TextArea label="Özel Not (kesim talebi vb.)" value={form.not_text || ""} onChange={(e) => setForm({ ...form, not_text: e.target.value })} placeholder="ör: Yağsız istiyor, ciğer istemiyor, kıyma ayrı paketlenecek" />
        <button onClick={() => onSubmit({ ...form, dana_id: danaId })} style={btnPrimary}>
          {initial ? "Güncelle" : "Müşteri Ekle"}
        </button>
      </div>
    );
  };

  const OdemeForm = ({ musteriId, onSubmit }) => {
    const [form, setForm] = useState({ tutar: "", tarih: new Date().toISOString().split("T")[0], not_text: "" });
    return (
      <div>
        <Input label="Ödeme Tutarı (₺)" type="number" value={form.tutar} onChange={(e) => setForm({ ...form, tutar: e.target.value })} placeholder="ör: 3000" />
        <Input label="Tarih" type="date" value={form.tarih} onChange={(e) => setForm({ ...form, tarih: e.target.value })} />
        <Input label="Not (opsiyonel)" value={form.not_text} onChange={(e) => setForm({ ...form, not_text: e.target.value })} placeholder="ör: Kapora, 2. taksit" />
        <button onClick={() => onSubmit({ ...form, musteri_id: musteriId })} style={btnPrimary}>
          Ödeme Kaydet
        </button>
      </div>
    );
  };

  // ---- Styles ----
  const btnPrimary = {
    width: "100%", padding: "12px", background: "linear-gradient(135deg, #c0392b, #e74c3c)",
    color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
    cursor: "pointer", marginTop: 8
  };
  const card = {
    background: "#1a1f2e", borderRadius: 14, padding: "20px 22px",
    border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer",
    transition: "all 0.2s", position: "relative"
  };
  const filterBtn = (active) => ({
    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
    border: "1px solid",
    background: active ? "rgba(255,255,255,0.1)" : "transparent",
    borderColor: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
    color: active ? "#fff" : "#8892a4",
    transition: "all 0.15s"
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f1219", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🐄</div>
          <p style={{ color: "#8892a4" }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // ============================
  // DASHBOARD
  // ============================
  const DashboardView = () => {
    const borcuKalan = musteriler.filter((m) => {
      const o = getTotalOdenen(m.id);
      return o < Number(m.toplam_ucret) && Number(m.toplam_ucret) > 0;
    });

    return (
      <div>
        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8892a4" }}>
            <SearchIcon size={18} />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri ara (isim veya telefon)..."
            style={{
              width: "100%", padding: "12px 14px 12px 42px", background: "#1a1f2e",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff",
              fontSize: 14, outline: "none", boxSizing: "border-box"
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#8892a4", fontSize: 16, cursor: "pointer"
            }}>✕</button>
          )}
        </div>

        {/* Search Results */}
        {searchResults && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, color: "#8892a4", marginBottom: 12 }}>
              {searchResults.length} sonuç bulundu
            </h3>
            {searchResults.length === 0 ? (
              <div style={{ ...card, cursor: "default", textAlign: "center", padding: 24, color: "#8892a4" }}>
                Eşleşen müşteri bulunamadı
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {searchResults.map((m) => {
                  const dana = danalar.find((d) => d.id === m.dana_id);
                  const odenen = getTotalOdenen(m.id);
                  const status = getDebtStatus(Number(m.toplam_ucret), odenen);
                  return (
                    <div key={m.id} style={card} onClick={() => { setSelectedMusteri(m); setSelectedDana(dana); setView("musteri-detay"); setSearchQuery(""); }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(52,152,219,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{m.ad_soyad}</div>
                          <div style={{ fontSize: 12, color: "#8892a4" }}>
                            {dana?.numara} • Hisse {m.hisse_no} {m.telefon && `• ${m.telefon}`}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: status.bg, color: status.color }}>
                            {status.label}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{formatTL(Number(m.toplam_ucret) - odenen)} kalan</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!searchResults && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Toplam Dana", value: globalStats.toplamDana, icon: <CowIcon />, color: "#e74c3c" },
                { label: "Toplam Müşteri", value: globalStats.toplamMusteri, icon: <UserIcon size={20} />, color: "#3498db" },
                { label: "Toplam Alacak", value: formatTL(globalStats.toplamAlacak), icon: <WalletIcon size={20} />, color: "#e67e22" },
                { label: "Tahsil Edilen", value: formatTL(globalStats.toplamOdenen), icon: <WalletIcon size={20} />, color: "#27ae60" },
              ].map((s, i) => (
                <div key={i} style={{ ...card, cursor: "default" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
                    <span style={{ fontSize: 12, color: "#8892a4", fontWeight: 500 }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Tahsilat bar */}
            {globalStats.toplamAlacak > 0 && (
              <div style={{ ...card, cursor: "default", marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: "#8892a4" }}>Tahsilat Durumu</span>
                  <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                    {((globalStats.toplamOdenen / globalStats.toplamAlacak) * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ height: 10, background: "#0f1219", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 5,
                    width: `${Math.min((globalStats.toplamOdenen / globalStats.toplamAlacak) * 100, 100)}%`,
                    background: "linear-gradient(90deg, #27ae60, #2ecc71)", transition: "width 0.5s"
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "#8892a4" }}>
                  <span>Kalan: {formatTL(globalStats.toplamAlacak - globalStats.toplamOdenen)}</span>
                  <span>Toplam: {formatTL(globalStats.toplamAlacak)}</span>
                </div>
              </div>
            )}

            {/* Borcu kalanlar uyarı */}
            {borcuKalan.length > 0 && (
              <div style={{
                ...card, cursor: "default", marginBottom: 28,
                borderColor: "rgba(231,76,60,0.2)", background: "linear-gradient(135deg, #1a1f2e, #2a1520)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e74c3c" }}>
                    Borcu Kalan Müşteriler ({borcuKalan.length})
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {borcuKalan.slice(0, 12).map((m) => {
                    const kalan = Number(m.toplam_ucret) - getTotalOdenen(m.id);
                    return (
                      <div key={m.id} onClick={() => {
                        const dana = danalar.find((d) => d.id === m.dana_id);
                        setSelectedMusteri(m); setSelectedDana(dana); setView("musteri-detay");
                      }} style={{
                        padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                        background: "#0f1219", border: "1px solid rgba(231,76,60,0.15)",
                        display: "flex", alignItems: "center", gap: 6
                      }}>
                        <span style={{ color: "#fff", fontWeight: 500 }}>{m.ad_soyad}</span>
                        <span style={{ color: "#e74c3c", fontWeight: 600 }}>{formatTL(kalan)}</span>
                      </div>
                    );
                  })}
                  {borcuKalan.length > 12 && (
                    <span style={{ padding: "6px 12px", fontSize: 12, color: "#8892a4" }}>+{borcuKalan.length - 12} kişi daha</span>
                  )}
                </div>
              </div>
            )}

            {/* Dana listesi header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Danalar</h2>
              <button onClick={() => setModal("yeni-dana")} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                background: "linear-gradient(135deg, #c0392b, #e74c3c)", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}>
                <PlusIcon size={16} /> Yeni Dana
              </button>
            </div>

            {/* Filtre */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
              <FilterIcon size={14} color="#8892a4" />
              {[
                { key: "all", label: "Tümü" },
                { key: "unpaid", label: "🔴 Ödeme Yok" },
                { key: "partial", label: "🟡 Kısmi" },
                { key: "paid", label: "🟢 Tamam" },
              ].map((f) => (
                <button key={f.key} onClick={() => setDebtFilter(f.key)} style={filterBtn(debtFilter === f.key)}>
                  {f.label}
                </button>
              ))}
            </div>

            {danalar.length === 0 ? (
              <div style={{ ...card, cursor: "default", textAlign: "center", padding: 40, color: "#8892a4" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🐄</div>
                <p>Henüz dana eklenmemiş</p>
                <p style={{ fontSize: 13 }}>Yukarıdaki "Yeni Dana" butonuyla başlayın</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                {danalar.map((d) => {
                  const stats = getDanaStats(d.id);
                  const pct = stats.toplamUcret > 0 ? (stats.toplamOdenen / stats.toplamUcret) * 100 : 0;
                  const danaMusteri = getMusterilerByDana(d.id);

                  if (debtFilter !== "all") {
                    const filtered = getFilteredMusteriler().filter((m) => m.dana_id === d.id);
                    if (filtered.length === 0) return null;
                  }

                  return (
                    <div key={d.id} style={card} onClick={() => { setSelectedDana(d); setView("dana-detay"); }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(231,76,60,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e74c3c18", display: "flex", alignItems: "center", justifyContent: "center", color: "#e74c3c" }}>
                            <CowIcon />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{d.numara}</div>
                            <div style={{ fontSize: 12, color: "#8892a4" }}>{formatDate(d.tarih)}</div>
                          </div>
                        </div>
                        <div style={{
                          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: danaMusteri.length === 7 ? "#27ae6020" : "#e67e2220",
                          color: danaMusteri.length === 7 ? "#27ae60" : "#e67e22"
                        }}>
                          {danaMusteri.length}/7 Hisse
                        </div>
                      </div>
                      {d.not_text && <div style={{ fontSize: 12, color: "#8892a4", marginTop: 8 }}>{d.not_text}</div>}

                      {/* Mini durum noktaları */}
                      <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                        {[1, 2, 3, 4, 5, 6, 7].map((hNo) => {
                          const m = danaMusteri.find((x) => x.hisse_no === hNo);
                          if (!m) return <div key={hNo} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2a2f3e" }} />;
                          const status = getDebtStatus(Number(m.toplam_ucret), getTotalOdenen(m.id));
                          return <div key={hNo} style={{ width: 8, height: 8, borderRadius: "50%", background: status.color }} title={`${m.ad_soyad}: ${status.label}`} />;
                        })}
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <div style={{ height: 5, background: "#0f1219", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? "#27ae60" : "#e74c3c", borderRadius: 3, transition: "width 0.4s" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#8892a4" }}>
                          <span>{formatTL(stats.toplamOdenen)} tahsil</span>
                          <span>{formatTL(stats.kalan)} kalan</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ============================
  // DANA DETAY
  // ============================
  const DanaDetayView = () => {
    if (!selectedDana) return null;
    const dana = danalar.find((d) => d.id === selectedDana.id) || selectedDana;
    const danaMusteri = getMusterilerByDana(dana.id);
    const takenHisses = danaMusteri.map((m) => m.hisse_no);
    const stats = getDanaStats(dana.id);

    return (
      <div>
        <button onClick={() => { setView("dashboard"); setSelectedDana(null); }} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: "#8892a4", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0
        }}>
          <BackIcon size={16} /> Geri
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#e74c3c18", display: "flex", alignItems: "center", justifyContent: "center", color: "#e74c3c" }}>
              <CowIcon />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>{dana.numara}</h2>
              <span style={{ fontSize: 12, color: "#8892a4" }}>{formatDate(dana.tarih)} {dana.not_text && `• ${dana.not_text}`}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setModal("edit-dana")} style={{
              display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
              background: "#1a1f2e", color: "#8892a4", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, fontSize: 12, cursor: "pointer"
            }}>
              <EditIcon size={14} /> Düzenle
            </button>
            <button onClick={() => deleteDana(dana.id)} style={{
              display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
              background: "#1a1f2e", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.2)",
              borderRadius: 8, fontSize: 12, cursor: "pointer"
            }}>
              <TrashIcon size={14} /> Sil
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Toplam Ücret", value: formatTL(stats.toplamUcret), color: "#3498db" },
            { label: "Tahsil Edilen", value: formatTL(stats.toplamOdenen), color: "#27ae60" },
            { label: "Kalan Borç", value: formatTL(stats.kalan), color: "#e74c3c" },
          ].map((s, i) => (
            <div key={i} style={{ ...card, cursor: "default", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#8892a4", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Hisseler</h3>
          {takenHisses.length < 7 && (
            <button onClick={() => setModal("yeni-musteri")} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
              background: "linear-gradient(135deg, #c0392b, #e74c3c)", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}>
              <PlusIcon size={14} /> Müşteri Ekle
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((hNo) => {
            const m = danaMusteri.find((x) => x.hisse_no === hNo);
            if (!m) {
              return (
                <div key={hNo} style={{ ...card, cursor: "default", opacity: 0.5, borderStyle: "dashed" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#8892a420", display: "flex", alignItems: "center", justifyContent: "center", color: "#8892a4", fontSize: 13, fontWeight: 700 }}>{hNo}</div>
                    <span style={{ color: "#8892a4", fontSize: 13 }}>Boş hisse</span>
                  </div>
                </div>
              );
            }
            const odenen = getTotalOdenen(m.id);
            const kalan = Number(m.toplam_ucret) - odenen;
            const status = getDebtStatus(Number(m.toplam_ucret), odenen);
            const pct = m.toplam_ucret > 0 ? (odenen / Number(m.toplam_ucret)) * 100 : 0;
            return (
              <div key={hNo} style={{ ...card, borderLeft: `3px solid ${status.color}` }}
                onClick={() => { setSelectedMusteri(m); setView("musteri-detay"); }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, background: status.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: status.color, fontSize: 13, fontWeight: 700
                    }}>{hNo}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{m.ad_soyad}</div>
                      <div style={{ fontSize: 11, color: "#8892a4" }}>{m.telefon || "Tel yok"}</div>
                    </div>
                  </div>
                  <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: status.bg, color: status.color }}>
                    {status.label}
                  </span>
                </div>
                {m.not_text && (
                  <div style={{
                    marginTop: 8, padding: "6px 10px", borderRadius: 6,
                    background: "#0f1219", fontSize: 11, color: "#e67e22",
                    display: "flex", alignItems: "center", gap: 4
                  }}>
                    <NoteIcon size={12} /> {m.not_text}
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <div style={{ height: 4, background: "#0f1219", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: status.color, borderRadius: 2 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "#8892a4" }}>
                    <span>{formatTL(odenen)} / {formatTL(m.toplam_ucret)}</span>
                    {kalan > 0 && <span style={{ color: "#e74c3c" }}>{formatTL(kalan)} kalan</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Modal open={modal === "yeni-musteri"} onClose={() => setModal(null)} title="Yeni Müşteri Ekle">
          <MusteriForm danaId={dana.id} onSubmit={addMusteri} takenHisses={takenHisses} />
        </Modal>
        <Modal open={modal === "edit-dana"} onClose={() => setModal(null)} title="Dana Düzenle">
          <DanaForm initial={{ numara: dana.numara, toplam_fiyat: dana.toplam_fiyat, not_text: dana.not_text || "" }} onSubmit={(data) => updateDana(dana.id, data)} />
        </Modal>
      </div>
    );
  };

  // ============================
  // MÜŞTERİ DETAY
  // ============================
  const MusteriDetayView = () => {
    if (!selectedMusteri) return null;
    const m = musteriler.find((x) => x.id === selectedMusteri.id) || selectedMusteri;
    const dana = danalar.find((d) => d.id === m.dana_id);
    const musteriOdemeler = getOdemelerByMusteri(m.id);
    const odenen = getTotalOdenen(m.id);
    const kalan = Number(m.toplam_ucret) - odenen;
    const status = getDebtStatus(Number(m.toplam_ucret), odenen);
    const takenHisses = getMusterilerByDana(m.dana_id).map((x) => x.hisse_no);

    return (
      <div>
        <button onClick={() => { setView("dana-detay"); setSelectedMusteri(null); }} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: "#8892a4", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0
        }}>
          <BackIcon size={16} /> {dana?.numara || "Dana"}'ya Dön
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>{m.ad_soyad}</h2>
              <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: status.bg, color: status.color }}>
                {status.label}
              </span>
            </div>
            <span style={{ fontSize: 13, color: "#8892a4" }}>Hisse {m.hisse_no} • {dana?.numara}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {m.telefon && (
              <>
                <button onClick={() => openWhatsApp(m.telefon, `Merhaba ${m.ad_soyad}, kurban hisseniz ile ilgili bilgilendirme:\n\nToplam ücret: ${formatTL(m.toplam_ucret)}\nÖdenen: ${formatTL(odenen)}\nKalan: ${formatTL(kalan)}\n\nBilginize.`)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
                    background: "#1a1f2e", color: "#25D366", border: "1px solid rgba(37,211,102,0.3)",
                    borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600
                  }}>
                  <WhatsAppIcon size={14} /> Borç Bildir
                </button>
                <button onClick={() => openWhatsApp(m.telefon, `Merhaba ${m.ad_soyad}, kurban etiniz hazır olmuştur. Teslim için bilgi verilecektir. Teşekkürler.`)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
                    background: "#1a1f2e", color: "#25D366", border: "1px solid rgba(37,211,102,0.3)",
                    borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600
                  }}>
                  <WhatsAppIcon size={14} /> Et Hazır
                </button>
              </>
            )}
            <button onClick={() => setModal("edit-musteri")} style={{
              display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
              background: "#1a1f2e", color: "#8892a4", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, fontSize: 12, cursor: "pointer"
            }}>
              <EditIcon size={14} /> Düzenle
            </button>
            <button onClick={() => deleteMusteri(m.id)} style={{
              display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
              background: "#1a1f2e", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.2)",
              borderRadius: 8, fontSize: 12, cursor: "pointer"
            }}>
              <TrashIcon size={14} /> Sil
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
          <div style={{ ...card, cursor: "default" }}>
            <div style={{ fontSize: 12, color: "#8892a4", marginBottom: 4 }}>Telefon</div>
            <div style={{ fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              {m.telefon || "—"}
              {m.telefon && <a href={`tel:${m.telefon}`} style={{ color: "#3498db" }}><PhoneIcon size={14} /></a>}
            </div>
          </div>
          <div style={{ ...card, cursor: "default" }}>
            <div style={{ fontSize: 12, color: "#8892a4", marginBottom: 4 }}>Adres</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{m.adres || "—"}</div>
          </div>
          <div style={{ ...card, cursor: "default" }}>
            <div style={{ fontSize: 12, color: "#8892a4", marginBottom: 4 }}>Hisse No</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Hisse {m.hisse_no}</div>
          </div>
        </div>

        {m.not_text && (
          <div style={{
            ...card, cursor: "default", marginBottom: 20,
            borderColor: "rgba(230,126,34,0.2)", background: "linear-gradient(135deg, #1a1f2e, #2a2520)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <NoteIcon size={16} color="#e67e22" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e67e22" }}>Özel Talepler</span>
            </div>
            <div style={{ fontSize: 14, color: "#ddd", lineHeight: 1.5 }}>{m.not_text}</div>
          </div>
        )}

        <div style={{ ...card, cursor: "default", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "#8892a4", marginBottom: 4 }}>Toplam Ücret</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#3498db" }}>{formatTL(m.toplam_ucret)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#8892a4", marginBottom: 4 }}>Ödenen</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#27ae60" }}>{formatTL(odenen)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#8892a4", marginBottom: 4 }}>Kalan</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: kalan > 0 ? "#e74c3c" : "#27ae60" }}>{formatTL(kalan)}</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 8, background: "#0f1219", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${Math.min(m.toplam_ucret > 0 ? (odenen / Number(m.toplam_ucret)) * 100 : 0, 100)}%`,
                background: kalan <= 0 ? "linear-gradient(90deg, #27ae60, #2ecc71)" : "linear-gradient(90deg, #e74c3c, #e67e22)",
                transition: "width 0.4s"
              }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Ödeme Geçmişi</h3>
          <button onClick={() => setModal("yeni-odeme")} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
            background: "linear-gradient(135deg, #27ae60, #2ecc71)", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer"
          }}>
            <PlusIcon size={14} /> Ödeme Ekle
          </button>
        </div>

        {musteriOdemeler.length === 0 ? (
          <div style={{ ...card, cursor: "default", textAlign: "center", padding: 30, color: "#8892a4" }}>
            <p style={{ fontSize: 13 }}>Henüz ödeme kaydı yok</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {musteriOdemeler.map((o) => (
              <div key={o.id} style={{ ...card, cursor: "default", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "#27ae60" }}>{formatTL(o.tutar)}</div>
                  <div style={{ fontSize: 12, color: "#8892a4" }}>{formatDate(o.tarih)} {o.not_text && `• ${o.not_text}`}</div>
                </div>
                <button onClick={() => deleteOdeme(o.id)} style={{
                  background: "none", border: "none", color: "#e74c3c40", cursor: "pointer", padding: 4
                }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#e74c3c"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#e74c3c40"}>
                  <TrashIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Modal open={modal === "yeni-odeme"} onClose={() => setModal(null)} title="Yeni Ödeme Ekle">
          <OdemeForm musteriId={m.id} onSubmit={addOdeme} />
        </Modal>
        <Modal open={modal === "edit-musteri"} onClose={() => setModal(null)} title="Müşteri Düzenle">
          <MusteriForm danaId={m.dana_id} initial={{
            ad_soyad: m.ad_soyad, telefon: m.telefon || "", adres: m.adres || "",
            hisse_no: m.hisse_no, toplam_ucret: m.toplam_ucret, not_text: m.not_text || ""
          }} onSubmit={(data) => updateMusteri(m.id, data)} takenHisses={takenHisses} />
        </Modal>
      </div>
    );
  };

  // ============================
  // RENDER
  // ============================
  return (
    <div style={{ minHeight: "100vh", background: "#0f1219", color: "#fff", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
      <div style={{
        background: "#1a1f2e", borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => { setView("dashboard"); setSelectedDana(null); setSelectedMusteri(null); setSearchQuery(""); setDebtFilter("all"); }}>
          <span style={{ fontSize: 24 }}>🐄</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#e74c3c" }}>Kurban Takip</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {globalStats.toplamAlacak > 0 && (
            <div style={{ fontSize: 12, color: "#8892a4" }}>
              Kalan: <span style={{ color: "#e74c3c", fontWeight: 600 }}>{formatTL(globalStats.toplamAlacak - globalStats.toplamOdenen)}</span>
            </div>
          )}
          {error && <div style={{ fontSize: 12, color: "#e74c3c", background: "#e74c3c15", padding: "4px 12px", borderRadius: 6 }}>Hata: {error}</div>}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px" }}>
        {view === "dashboard" && <DashboardView />}
        {view === "dana-detay" && <DanaDetayView />}
        {view === "musteri-detay" && <MusteriDetayView />}
      </div>

      <Modal open={modal === "yeni-dana"} onClose={() => setModal(null)} title="Yeni Dana Ekle">
        <DanaForm onSubmit={addDana} />
      </Modal>
    </div>
  );
}
