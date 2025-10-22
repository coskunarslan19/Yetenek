# 📱 Mobil Uygulama Kurulum Rehberi

## Android ve iOS için Uygulama Oluşturma

### 🔧 Gereksinimler

#### Windows için Android:
1. **Node.js** (v16 veya üzeri) - https://nodejs.org/
2. **Android Studio** - https://developer.android.com/studio
3. **JDK 17** - Android Studio ile gelir

#### Mac için iOS:
1. **Node.js** (v16 veya üzeri)
2. **Xcode** (Mac App Store'dan)
3. **CocoaPods** - `sudo gem install cocoapods`

---

## 📦 Kurulum Adımları

### 1. Node.js Paketlerini Yükle
```bash
cd C:\Users\cosku\CascadeProjects\muzik-yetenek-sinavi
npm install
```

### 2. Capacitor'ı Başlat
```bash
npx cap init
```

### 3. Android Platformu Ekle
```bash
npx cap add android
```

### 4. iOS Platformu Ekle (Sadece Mac'te)
```bash
npx cap add ios
```

### 5. Projeyi Senkronize Et
```bash
npx cap sync
```

---

## 🤖 Android Uygulaması Oluşturma

### 1. Android Studio'yu Aç
```bash
npx cap open android
```

### 2. Android Studio'da:
- **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- APK dosyası `android/app/build/outputs/apk/debug/` klasöründe oluşur

### 3. APK'yı Telefona Yükle:
- APK dosyasını telefona gönder
- Telefonda "Bilinmeyen Kaynaklardan Yükleme"yi aç
- APK'yı yükle

---

## 🍎 iOS Uygulaması Oluşturma (Mac Gerekli)

### 1. Xcode'u Aç
```bash
npx cap open ios
```

### 2. Xcode'da:
- Signing & Capabilities → Team seç
- Product → Archive
- Distribute App → Ad Hoc veya App Store

---

## 🚀 Hızlı Test

### Android Emulator'de Test:
1. Android Studio → AVD Manager → Create Virtual Device
2. Emulator'ü başlat
3. `npx cap run android`

### iOS Simulator'de Test (Mac):
1. `npx cap run ios`

---

## 📝 Kod Değişikliklerinden Sonra

Her kod değişikliğinden sonra:
```bash
npx cap sync
```

---

## 🎨 Uygulama İkonu ve Splash Screen

### İkon Ekleme:
1. `android/app/src/main/res/` klasörüne ikon dosyalarını ekle
2. `ios/App/App/Assets.xcassets/` klasörüne ikon dosyalarını ekle

### Splash Screen:
- `capacitor.config.json` dosyasında ayarlandı
- Renk: `#818cf8` (mor)

---

## ⚠️ Önemli Notlar

1. **Mikrofon İzni**: Otomatik olarak istenir
2. **İnternet Gerekmez**: Tamamen offline çalışır
3. **Dosya Boyutu**: ~5-10 MB

---

## 🔗 Alternatif: Online Derleme Servisleri

Bilgisayarınızda Android Studio yoksa:

### 1. **Capacitor Cloud** (Ücretli)
- https://capacitorjs.com/cloud

### 2. **Ionic Appflow** (Ücretli)
- https://ionic.io/appflow

### 3. **GitHub Actions** (Ücretsiz)
- Otomatik APK/IPA oluşturma

---

## 📱 APK Paylaşma

APK oluşturduktan sonra:
1. Google Drive'a yükle
2. Link'i paylaş
3. Kullanıcılar indirir ve yükler

**NOT**: Google Play Store'a yüklemek için Google Developer hesabı gerekir ($25 tek seferlik ücret)

---

## 🆘 Sorun Giderme

### "Command not found: npx"
```bash
npm install -g npm
```

### "JAVA_HOME not set"
- Android Studio → File → Project Structure → SDK Location
- JDK path'i kopyala ve sistem değişkenlerine ekle

### Gradle Hatası
```bash
cd android
./gradlew clean
cd ..
npx cap sync
```

---

## 📞 Destek

Sorun yaşarsan:
1. `npx cap doctor` komutunu çalıştır
2. Hata mesajını kontrol et
3. Capacitor dokümantasyonuna bak: https://capacitorjs.com/docs
