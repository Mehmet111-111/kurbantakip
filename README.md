# 🐄 Kurban Takip Sistemi

Kasaplar için kurban dönemi müşteri ve ödeme takip uygulaması.

## Özellikler

- Dana ve hisse yönetimi (7 hisse/dana)
- Müşteri kayıt (ad, telefon, adres)
- Ödeme takibi (çoklu ödeme girişi, kalan borç hesaplama)
- Hızlı müşteri arama (isim veya telefon ile)
- Borç durumu renk kodları (🔴 Ödeme yok / 🟡 Kısmi / 🟢 Tamam)
- Borcu kalan müşteriler uyarısı ve filtreleme
- Özel notlar (kesim talepleri: "yağsız istiyor" vb.)
- WhatsApp ile tek tıkla bilgilendirme (borç bilgisi, et hazır mesajı)

## Kurulum

### 1. Supabase Kurulumu

1. [supabase.com](https://supabase.com) adresinde yeni proje oluşturun
2. SQL Editor'da aşağıdaki SQL'leri sırasıyla çalıştırın:

**İlk kurulum (supabase_schema.sql):**
```sql
-- Tüm tabloları oluşturur
-- supabase_schema.sql dosyasının içeriğini yapıştırın
```

**Not alanı ekleme:**
```sql
ALTER TABLE musteriler ADD COLUMN IF NOT EXISTS not_text TEXT;
```

### 2. Supabase Bilgilerini Girme

`src/KurbanTakip.jsx` dosyasında 4. ve 5. satırdaki değerleri kendi Supabase bilgilerinizle değiştirin:

```javascript
const SUPABASE_URL = "https://SIZIN-PROJE-ID.supabase.co";
const SUPABASE_ANON_KEY = "SIZIN-ANON-KEY";
```

Bu bilgileri Supabase Dashboard → Settings → API bölümünden bulabilirsiniz.

### 3. Uygulamayı Çalıştırma

Bilgisayarınızda [Node.js](https://nodejs.org) yüklü olmalıdır (v18+).

```bash
# Proje klasörüne girin
cd kurban-takip-app

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm run dev
```

Tarayıcınızda otomatik olarak `http://localhost:3000` açılacaktır.

## Kullanım

1. **Dana Ekle** → "Yeni Dana" butonuna tıklayın, dana adı ve fiyatı girin
2. **Müşteri Ekle** → Dana detayında "Müşteri Ekle" ile hisse, ad, telefon, adres, ücret girin
3. **Ödeme Kaydet** → Müşteri detayında "Ödeme Ekle" ile alınan parayı kaydedin
4. **WhatsApp Bildirim** → Müşteri detayında "Borç Bildir" veya "Et Hazır" butonlarıyla mesaj gönderin
5. **Arama** → Dashboard'daki arama barından isim veya telefon ile arayın
6. **Filtreleme** → Borç durumuna göre danaları filtreleyin

## Teknolojiler

- React 18 + Vite
- Supabase (PostgreSQL)
- Vanilla CSS (framework yok)
