-- =============================================
-- KURBAN TAKİP SİSTEMİ - Supabase Schema
-- =============================================

-- 1) Danalar tablosu
CREATE TABLE danalar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numara TEXT NOT NULL,           -- Dana numarası/ismi (ör: "Dana #1", "Angus 01")
  toplam_fiyat NUMERIC(12,2) NOT NULL DEFAULT 0,
  tarih DATE NOT NULL DEFAULT CURRENT_DATE,
  not_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Müşteriler tablosu (her dana için max 7 hisse)
CREATE TABLE musteriler (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dana_id UUID NOT NULL REFERENCES danalar(id) ON DELETE CASCADE,
  hisse_no INTEGER NOT NULL CHECK (hisse_no BETWEEN 1 AND 7),
  ad_soyad TEXT NOT NULL,
  telefon TEXT,
  adres TEXT,
  toplam_ucret NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dana_id, hisse_no)       -- Bir danada aynı hisse numarası iki kez olamaz
);

-- 3) Ödemeler tablosu
CREATE TABLE odemeler (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  musteri_id UUID NOT NULL REFERENCES musteriler(id) ON DELETE CASCADE,
  tutar NUMERIC(12,2) NOT NULL,
  tarih DATE NOT NULL DEFAULT CURRENT_DATE,
  not_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexler
CREATE INDEX idx_musteriler_dana_id ON musteriler(dana_id);
CREATE INDEX idx_odemeler_musteri_id ON odemeler(musteri_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_danalar_updated
  BEFORE UPDATE ON danalar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_musteriler_updated
  BEFORE UPDATE ON musteriler
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security) - basit tutuyoruz, public erişim
ALTER TABLE danalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE musteriler ENABLE ROW LEVEL SECURITY;
ALTER TABLE odemeler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access danalar" ON danalar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access musteriler" ON musteriler FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access odemeler" ON odemeler FOR ALL USING (true) WITH CHECK (true);
