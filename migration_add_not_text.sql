-- Müşteriler tablosuna özel not alanı ekleme
-- Bu SQL'i Supabase SQL Editor'da çalıştırın
ALTER TABLE musteriler ADD COLUMN IF NOT EXISTS not_text TEXT;
