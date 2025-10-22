# 🎹 Müzik Yetenek Sınavı Uygulaması

Müzik bölümleri yetenek sınavları için geliştirilmiş web tabanlı bir uygulama. Piyano notalarını çalar ve öğrencinin mikrofon ile söylediği sesi tuner teknolojisi ile kontrol eder.

## 🎯 Özellikler

- **Rastgele Nota Çalma**: C4'den B5'e kadar 24 farklı piyano notası
- **Gerçek Zamanlı Pitch Detection**: Mikrofon ile ses algılama ve frekans analizi
- **Görsel Tuner**: Pitch meter ile hedef ve algılanan frekansı görsel olarak karşılaştırma
- **Skor Takibi**: Doğru ve yanlış cevapları takip etme
- **Modern Arayüz**: Kullanıcı dostu, responsive tasarım

## 🚀 Kullanım

1. **Uygulamayı Başlatma**:
   - `index.html` dosyasını bir web tarayıcısında açın
   - Modern bir tarayıcı kullanın (Chrome, Firefox, Edge önerilir)

2. **Test Adımları**:
   - "Rastgele Nota Çal" butonuna tıklayın
   - Piyano notasını dinleyin
   - "Dinlemeye Başla" butonuna tıklayın (mikrofon izni verin)
   - Duyduğunuz notayı mikrofona söyleyin
   - Uygulama otomatik olarak doğruluğu kontrol edecektir

3. **Sonuçları Görüntüleme**:
   - Hedef nota ve frekans
   - Algılanan nota ve frekans
   - Frekans farkı
   - Görsel pitch meter
   - Doğru/Yanlış skor tablosu

## 📋 Gereksinimler

- Modern web tarayıcısı (Chrome 60+, Firefox 55+, Edge 79+)
- Mikrofon erişimi
- HTTPS veya localhost (mikrofon erişimi için gerekli)

## 🎵 Nota Aralığı

Uygulama aşağıdaki notaları içerir:
- A3 (220.00 Hz) - E5 (659.25 Hz)
- Toplam 20 nota
- Yarım tonlar dahil (A#, C#, D#, F#, G#)

## 🔧 Teknik Detaylar

### Teknolojiler
- **Web Audio API**: Ses üretimi ve analizi
- **MediaStream API**: Mikrofon erişimi
- **Canvas API**: Görsel pitch meter
- **Autocorrelation Algorithm**: Pitch detection

### Tolerans
- Doğru kabul edilme toleransı: ±25 Hz
- Görsel gösterim aralığı: ±50 Hz

### Pitch Detection
- FFT Size: 4096
- Sample Rate: Tarayıcı varsayılanı (genellikle 44100 Hz veya 48000 Hz)
- RMS Threshold: 0.01 (ses seviyesi eşiği)

## 📱 Responsive Tasarım

Uygulama mobil cihazlarda da çalışır:
- Tablet ve telefon uyumlu
- Dokunmatik kontroller
- Responsive layout

## 🎨 Özelleştirme

### Nota Aralığını Değiştirme
`app.js` dosyasındaki `notes` dizisini düzenleyin:

```javascript
this.notes = [
    { name: 'C4', frequency: 261.63 },
    // Daha fazla nota ekleyin...
];
```

### Toleransı Ayarlama
`detectPitch()` fonksiyonundaki tolerans değerini değiştirin:

```javascript
if (diff < 25) { // 25 Hz tolerans
    this.showResult(true);
}
```

### Görünümü Değiştirme
`style.css` dosyasındaki renk ve stil değerlerini düzenleyin.

## 🐛 Sorun Giderme

### Mikrofon Çalışmıyor
- Tarayıcı izinlerini kontrol edin
- HTTPS veya localhost kullandığınızdan emin olun
- Mikrofon donanımınızı test edin

### Ses Algılanmıyor
- Mikrofon seviyesini artırın
- Arka plan gürültüsünü azaltın
- Mikrofona daha yakın konuşun

### Yanlış Nota Algılanıyor
- Daha net ve uzun söyleyin
- Tek bir nota söyleyin (vibrato yapmayın)
- Mikrofon kalitesini kontrol edin

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici Notları

- Autocorrelation algoritması pitch detection için kullanılır
- ADSR envelope ile daha doğal piyano sesi
- Real-time audio processing
- Canvas-based visualization

## 🔮 Gelecek Geliştirmeler

- [ ] Daha fazla enstrüman sesi (keman, flüt, vb.)
- [ ] Zorluk seviyeleri
- [ ] Aralık tanıma (interval recognition)
- [ ] Melodi tekrarı
- [ ] Kullanıcı profilleri ve ilerleme takibi
- [ ] Ses kaydı ve playback
