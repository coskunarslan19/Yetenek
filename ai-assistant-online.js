// Online AI Assistant - İnternete Bağlı Gerçek AI
// OpenAI GPT-4 API entegrasyonu ile gerçek sohbet

class OnlineAIAssistant {
    constructor(musicAI) {
        this.musicAI = musicAI;
        this.conversationHistory = [];
        this.apiKey = null;
        this.model = 'gpt-4o-mini'; // Daha ucuz ve hızlı
        this.maxTokens = 500;
        
        // Sistem prompt'u - AI'ın karakteri
        this.systemPrompt = `Sen profesyonel bir müzik eğitmenisin. İsmin "Müzik Koçu AI" ve Türkçe konuşuyorsun.

KİŞİLİĞİN:
- Çok samimi, sıcak ve destekleyici
- Empatik ve anlayışlı
- Motivasyonel ve ilham verici
- Hem teknik hem de duygusal destek sağlayan
- Kullanıcıyı tanıdıkça daha kişisel davranan

GÖREVLER:
1. Müzik öğrencilerine rehberlik et
2. Nota öğrenme, ses eğitimi, ritim çalışmaları hakkında bilgi ver
3. Motivasyon sağla ve cesaretlendir
4. Performans analizi yap ve önerilerde bulun
5. Kullanıcının duygusal durumunu anla ve ona göre yaklaş

ÖNEMLİ KURALLAR:
- Kısa ve öz yanıtlar ver (maksimum 3-4 cümle)
- Emoji kullan ama abartma (1-2 emoji)
- Doğal ve akıcı Türkçe konuş
- Kullanıcının ismini öğrenirsen, ara sıra kullan
- Önceki konuşmaları hatırla ve referans ver

SEN BİR MÜZİK KOÇUSUN - Arkadaş canlısı ama profesyonel!`;
    }
    
    // API Key ayarla
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('openai_api_key', key);
        console.log('✅ OpenAI API Key kaydedildi!');
    }
    
    // API Key yükle
    loadApiKey() {
        const stored = localStorage.getItem('openai_api_key');
        if (stored) {
            this.apiKey = stored;
            return true;
        }
        return false;
    }
    
    // API Key kontrol
    hasApiKey() {
        return this.apiKey !== null && this.apiKey.length > 0;
    }
    
    // Performans verisi hazırla
    getPerformanceContext() {
        const report = this.musicAI.generatePerformanceReport();
        
        if (!report.stats) {
            return "Kullanıcı henüz başlamamış.";
        }
        
        return `PERFORMANS VERİSİ:
- Toplam deneme: ${report.stats.totalAttempts}
- Başarı oranı: %${report.stats.successRate}
- Güçlü notalar: ${report.stats.strongNotes.join(', ') || 'Henüz yok'}
- Zayıf notalar: ${report.stats.weakNotes.join(', ') || 'Henüz yok'}
- Trend: ${report.stats.improvement}`;
    }
    
    // Ana sohbet fonksiyonu - Gerçek AI
    async chat(userMessage) {
        // API key kontrolü
        if (!this.hasApiKey()) {
            return this.getApiKeySetupMessage();
        }
        
        try {
            // Performans bağlamını ekle
            const performanceContext = this.getPerformanceContext();
            
            // Mesaj geçmişini hazırla
            const messages = [
                {
                    role: 'system',
                    content: this.systemPrompt + '\n\n' + performanceContext
                }
            ];
            
            // Son 10 mesajı ekle (token limiti için)
            const recentHistory = this.conversationHistory.slice(-10);
            messages.push(...recentHistory);
            
            // Yeni kullanıcı mesajı
            messages.push({
                role: 'user',
                content: userMessage
            });
            
            // OpenAI API çağrısı
            const response = await this.callOpenAI(messages);
            
            // Geçmişe ekle
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            
            // Geçmişi sınırla (son 20 mesaj)
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }
            
            return response;
            
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return this.getErrorMessage(error);
        }
    }
    
    // OpenAI API çağrısı
    async callOpenAI(messages) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                max_tokens: this.maxTokens,
                temperature: 0.8, // Yaratıcılık
                top_p: 0.9,
                frequency_penalty: 0.3, // Tekrar azaltma
                presence_penalty: 0.3 // Çeşitlilik
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API çağrısı başarısız');
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    }
    
    // API key setup mesajı
    getApiKeySetupMessage() {
        return `🔑 **OpenAI API Key Gerekli**

Bu özellik gerçek GPT-4 ile konuşmanızı sağlar!

**Nasıl Ayarlanır?**

1. https://platform.openai.com adresine gidin
2. API Keys bölümünden yeni key oluşturun
3. Konsolda şunu yazın:
   \`\`\`
   app.assistant.setApiKey('sk-...')
   \`\`\`
4. Artık gerçek AI ile konuşabilirsiniz!

**Not:** API key'iniz tarayıcıda güvenle saklanır. ✅`;
    }
    
    // Hata mesajı
    getErrorMessage(error) {
        if (error.message.includes('Invalid API Key')) {
            return `❌ **Geçersiz API Key**

API key'iniz hatalı. Lütfen kontrol edin:
1. https://platform.openai.com adresinde key'inizi kontrol edin
2. \`app.assistant.setApiKey('sk-...')\` komutu ile tekrar ayarlayın`;
        }
        
        if (error.message.includes('insufficient_quota')) {
            return `💳 **Yetersiz Bakiye**

OpenAI hesabınızda bakiye kalmamış. 
https://platform.openai.com/account/billing adresinden bakiye yükleyin.`;
        }
        
        if (error.message.includes('rate_limit')) {
            return `⏳ **Çok Fazla İstek**

Biraz yavaşlayın, 1 dakika bekleyin. ⏰`;
        }
        
        return `❌ **Bir hata oluştu**

${error.message}

Lütfen tekrar deneyin. Sorun devam ederse API key'inizi kontrol edin.`;
    }
    
    // Uyumluluk metodları (eski API ile)
    generateSmartResponse(userInput) {
        return this.chat(userInput);
    }
    
    getEncouragementMessage(isSuccess) {
        if (isSuccess) {
            return "Harika! 🌟 Mükemmel bir performans!";
        }
        return "Sorun değil! 💪 Her hata bir öğrenme fırsatıdır!";
    }
    
    getTipForUser() {
        return this.chat("Bana kısa bir müzik ipucu ver");
    }
    
    generateAutoNotification(type, data) {
        let message = '';
        
        switch(type) {
            case 'milestone':
                message = `🎯 ${data.count} deneme tamamladın! ${data.encouragement}`;
                break;
            case 'achievement':
                message = `🏆 ${data.message}`;
                break;
            default:
                message = data.message;
        }
        
        return { message, type, timestamp: Date.now() };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnlineAIAssistant;
}
