# 🚀 GitHub'a Yükleme Rehberi

## Seçenek 1: GitHub Desktop (EN KOLAY)

### Adım 1: GitHub Desktop İndir
1. https://desktop.github.com/ adresine git
2. İndir ve kur
3. GitHub hesabınla giriş yap

### Adım 2: Repository Oluştur
1. GitHub Desktop'ı aç
2. **File → Add Local Repository**
3. Klasörü seç: `C:\Users\cosku\CascadeProjects\muzik-yetenek-sinavi`
4. "Create a repository" de
5. Repository adı: **muzik-yetenek-sinavi**
6. "Create Repository" butonuna bas

### Adım 3: GitHub'a Yükle
1. **Publish repository** butonuna bas
2. ✅ "Keep this code private" işaretini kaldır (public yap)
3. **Publish repository**

### Adım 4: GitHub Pages Aktif Et
1. GitHub.com'da repository'ne git
2. **Settings** → **Pages**
3. Source: **main** branch seçin
4. **Save**
5. 1-2 dakika bekle

### Adım 5: URL'ni Al
URL'in: `https://KULLANICI_ADIN.github.io/muzik-yetenek-sinavi`

---

## Seçenek 2: Web Üzerinden (GIT OLMADAN)

### Adım 1: GitHub'da Repository Oluştur
1. https://github.com/new adresine git
2. Repository adı: **muzik-yetenek-sinavi**
3. ✅ Public seç
4. ✅ "Add a README file" işaretle
5. **Create repository**

### Adım 2: Dosyaları Yükle
1. Repository sayfasında **Add file → Upload files**
2. Tüm dosyaları sürükle-bırak:
   - index.html
   - style.css
   - app.js
   - manifest.json
   - README.md
   - APK_OLUSTURMA.md
3. **Commit changes**

### Adım 3: GitHub Pages Aktif Et
1. **Settings** → **Pages**
2. Source: **main** branch
3. **Save**

### Adım 4: URL'ni Al
URL'in: `https://KULLANICI_ADIN.github.io/muzik-yetenek-sinavi`

---

## Seçenek 3: Git Komut Satırı (İLERİ SEVİYE)

### Git Kurulumu
1. https://git-scm.com/download/win
2. İndir ve kur
3. PowerShell'i yeniden başlat

### Komutlar

```bash
# Klasöre git
cd C:\Users\cosku\CascadeProjects\muzik-yetenek-sinavi

# Git başlat
git init

# Dosyaları ekle
git add .

# Commit yap
git commit -m "İlk commit - Müzik Yetenek Sınavı Uygulaması"

# GitHub'da repository oluştur (web'den)
# Sonra bağla:
git remote add origin https://github.com/KULLANICI_ADIN/muzik-yetenek-sinavi.git

# Yükle
git branch -M main
git push -u origin main
```

---

## 📱 APK Oluşturma (GitHub Pages Aktif Olduktan Sonra)

### PWA Builder ile:

1. https://www.pwabuilder.com/ adresine git
2. URL'ni gir: `https://KULLANICI_ADIN.github.io/muzik-yetenek-sinavi`
3. **Start** bas
4. **Package For Stores** → **Android**
5. **Generate** bas
6. APK'yı indir

---

## ⚠️ Önemli Notlar

### GitHub Pages Aktif Olması
- 1-2 dakika sürebilir
- URL'e gidip kontrol edin
- Hata varsa Settings → Pages'i tekrar kontrol edin

### Repository Public Olmalı
- APK için public olması gerekli
- Private'da GitHub Pages çalışmaz (ücretsiz hesapta)

### Dosya İsimleri
- Türkçe karakter kullanmayın
- Boşluk yerine tire (-) kullanın

---

## 🎯 Hızlı Başlangıç

**En kolay yol:**
1. GitHub Desktop indir
2. Repository oluştur
3. Publish et
4. GitHub Pages aktif et
5. PWA Builder'da APK oluştur

**Toplam süre: ~15 dakika**

---

## 📞 Sorun Giderme

### "Repository already exists"
- Farklı bir isim deneyin
- Veya mevcut repository'yi silin

### GitHub Pages çalışmıyor
- Settings → Pages kontrol edin
- main branch seçili mi?
- 5 dakika bekleyin

### APK oluşturulmuyor
- URL doğru mu?
- HTTPS ile mi açılıyor?
- manifest.json var mı?

---

## ✅ Başarı Kontrolü

URL'nizi tarayıcıda açın:
- ✅ Uygulama açılıyor mu?
- ✅ Mikrofon izni istiyor mu?
- ✅ Sesler çalıyor mu?

Hepsi ✅ ise APK oluşturabilirsiniz!
