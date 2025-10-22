// GPT-5 Level AI Music Assistant - Ultra Gelişmiş Yapay Zeka Müzik Asistanı  
// Advanced NLP, deep context awareness, emotional intelligence, personalization, learning

class AdvancedMusicAssistant {
    constructor(musicAI) {
        this.musicAI = musicAI;
        this.conversationHistory = [];
        this.longTermMemory = []; // Uzun süreli hafıza
        
        // Gelişmiş kullanıcı profili
        this.userProfile = {
            name: null,
            level: 'beginner',
            personality: {
                isMotivated: true,
                needsEncouragement: false,
                prefersDetail: false,
                learningPace: 'moderate'
            },
            goals: [],
            interests: [],
            learningStyle: null,
            emotionalState: 'neutral',
            relationshipLevel: 0 // 0-10 arası
        };
        
        // Gelişmiş bağlam yönetimi
        this.context = {
            currentTopic: null,
            lastEmotion: 'neutral',
            conversationDepth: 0,
            userEngagement: 1.0,
            sessionStart: Date.now(),
            interactionCount: 0
        };
        
        this.initializePersonality();
    }
    
    initializePersonality() {
        this.personality = {
            traits: {
                friendliness: 0.9,
                professionalism: 0.8,
                humor: 0.7,
                empathy: 0.95,
                enthusiasm: 0.85
            },
            talkingStyle: 'warm_and_encouraging', // formal, casual, warm_and_encouraging
            emojiUsage: 'moderate' // minimal, moderate, expressive
        };
    }
    
    // ULTRA GELİŞMİŞ KONUŞMA MOTORU
    async chat(userMessage) {
        // 1. Mesajı analiz et
        const analysis = this.analyzeMessage(userMessage);
        
        // 2. Bağlam güncelle
        this.updateContext(analysis);
        
        // 3. Yanıt stratejisi belirle
        const strategy = this.determineResponseStrategy(analysis);
        
        // 4. Kişiselleştirilmiş yanıt oluştur
        const response = this.generateResponse(strategy, analysis);
        
        // 5. Konuşma geçmişine ekle
        this.addToHistory('user', userMessage);
        this.addToHistory('assistant', response);
        
        return response;
    }
    
    // Mesaj analizi - NLP benzeri
    analyzeMessage(message) {
        const lower = message.toLowerCase();
        
        return {
            intent: this.detectIntent(lower),
            sentiment: this.analyzeSentiment(lower),
            entities: this.extractEntities(lower),
            questionType: this.classifyQuestion(lower),
            urgency: this.detectUrgency(lower),
            context: this.findContext(lower),
            keywords: this.extractKeywords(lower)
        };
    }
    
    // Niyet tespiti
    detectIntent(text) {
        const intents = {
            greeting: /^(merhaba|selam|hey|hi|hello|günaydın|iyi akşamlar)/,
            farewell: /(görüşürüz|bay|hoşça kal|sonra görüşürüz)/,
            question: /\?|nasıl|ne|neden|nerede|kim|hangi/,
            help: /(yardım|destek|anlamadım|bilmiyorum)/,
            feedback: /(teşekkür|sağol|harika|süper|kötü|berbat)/,
            share: /(ben|benim|kendim|bugün|dün)/,
            goal: /(istiyorum|hedefim|planım|yapmak)/,
            struggle: /(zor|yapamıyorum|başaramıyorum|zorlanıyorum)/,
            achievement: /(başardım|yaptım|öğrendim|iyileştim)/
        };
        
        for (let [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(text)) return intent;
        }
        
        return 'general';
    }
    
    // Gelişmiş duygu analizi
    analyzeSentiment(text) {
        const sentimentWords = {
            veryPositive: ['muhteşem', 'harika', 'mükemmel', 'inanılmaz', 'fantastik', 'süper'],
            positive: ['iyi', 'güzel', 'teşekkür', 'sevdim', 'beğendim', 'başardım'],
            neutral: ['tamam', 'anladım', 'peki', 'evet', 'hayır'],
            negative: ['zor', 'kötü', 'yapamıyorum', 'başaramadım', 'olmadı'],
            veryNegative: ['berbat', 'imkansız', 'vazgeçeceğim', 'nefret', 'çok kötü']
        };
        
        let score = 0;
        
        for (let word of sentimentWords.veryPositive) {
            if (text.includes(word)) score += 2;
        }
        for (let word of sentimentWords.positive) {
            if (text.includes(word)) score += 1;
        }
        for (let word of sentimentWords.negative) {
            if (text.includes(word)) score -= 1;
        }
        for (let word of sentimentWords.veryNegative) {
            if (text.includes(word)) score -= 2;
        }
        
        if (score >= 2) return 'very_positive';
        if (score >= 1) return 'positive';
        if (score <= -2) return 'very_negative';
        if (score <= -1) return 'negative';
        return 'neutral';
    }
    
    // Varlık çıkarma (Entity extraction)
    extractEntities(text) {
        const entities = {
            notes: [],
            timeframe: null,
            number: null,
            feeling: null
        };
        
        // Nota isimleri
        const notePattern = /\b([CDEFGAB][#b]?[0-9]?)\b/g;
        const noteMatches = text.match(notePattern);
        if (noteMatches) entities.notes = noteMatches;
        
        // Zaman ifadeleri
        if (text.includes('bugün')) entities.timeframe = 'today';
        if (text.includes('dün')) entities.timeframe = 'yesterday';
        if (text.includes('yarın')) entities.timeframe = 'tomorrow';
        
        // Sayılar
        const numberMatch = text.match(/\d+/);
        if (numberMatch) entities.number = parseInt(numberMatch[0]);
        
        // Duygular
        const feelings = ['mutlu', 'üzgün', 'heyecanlı', 'yorgun', 'motiveli', 'stresli'];
        for (let feeling of feelings) {
            if (text.includes(feeling)) entities.feeling = feeling;
        }
        
        return entities;
    }
    
    // Soru tipi sınıflandırma
    classifyQuestion(text) {
        if (text.includes('nasıl')) return 'how';
        if (text.includes('neden')) return 'why';
        if (text.includes('ne zaman')) return 'when';
        if (text.includes('nerede')) return 'where';
        if (text.includes('kim')) return 'who';
        if (text.includes('ne')) return 'what';
        if (text.includes('hangi')) return 'which';
        return null;
    }
    
    // Aciliyet tespiti
    detectUrgency(text) {
        if (text.includes('acil') || text.includes('hemen') || text.includes('çabuk')) {
            return 'high';
        }
        if (text.includes('lütfen') || text.includes('?')) {
            return 'medium';
        }
        return 'low';
    }
    
    // Bağlam bulma
    findContext(text) {
        if (this.conversationHistory.length < 2) return null;
        
        // Son konuşmaya referans var mı?
        if (text.includes('bu') || text.includes('şu') || text.includes('o')) {
            return this.context.currentTopic;
        }
        
        return null;
    }
    
    // Anahtar kelime çıkarma
    extractKeywords(text) {
        const stopWords = ['ben', 'sen', 'bir', 've', 'için', 'ile', 'mi', 'mı', 'mu', 'mü'];
        const words = text.split(/\s+/);
        return words.filter(w => w.length > 3 && !stopWords.includes(w));
    }
    
    // Bağlam güncelleme
    updateContext(analysis) {
        this.context.lastEmotion = analysis.sentiment;
        this.context.conversationDepth++;
        this.context.interactionCount++;
        
        if (analysis.intent !== 'greeting' && analysis.intent !== 'farewell') {
            this.context.currentTopic = analysis.intent;
        }
        
        // Engagement skoru hesapla
        const messageLength = this.conversationHistory.length > 0 ? 
            this.conversationHistory[this.conversationHistory.length - 1].message.length : 0;
        
        if (messageLength > 50) {
            this.context.userEngagement = Math.min(1.0, this.context.userEngagement + 0.1);
        } else if (messageLength < 10) {
            this.context.userEngagement = Math.max(0.3, this.context.userEngagement - 0.1);
        }
    }
    
    // Yanıt stratejisi belirleme
    determineResponseStrategy(analysis) {
        const strategy = {
            type: 'informative',
            tone: 'friendly',
            length: 'medium',
            includeQuestion: false,
            includeAction: false,
            empathyLevel: 0.5
        };
        
        // Intent'e göre strateji
        switch(analysis.intent) {
            case 'greeting':
                strategy.type = 'social';
                strategy.tone = 'warm';
                strategy.includeQuestion = true;
                break;
            case 'struggle':
                strategy.type = 'supportive';
                strategy.tone = 'empathetic';
                strategy.empathyLevel = 0.9;
                strategy.length = 'long';
                break;
            case 'achievement':
                strategy.type = 'celebratory';
                strategy.tone = 'enthusiastic';
                break;
            case 'question':
                strategy.type = 'educational';
                strategy.tone = 'professional';
                strategy.includeAction = true;
                break;
            case 'help':
                strategy.type = 'guiding';
                strategy.includeAction = true;
                break;
        }
        
        // Sentiment'e göre ayarla
        if (analysis.sentiment === 'very_negative') {
            strategy.empathyLevel = 1.0;
            strategy.tone = 'supportive';
        } else if (analysis.sentiment === 'very_positive') {
            strategy.tone = 'enthusiastic';
        }
        
        return strategy;
    }
    
    // ANA YANIT OLUŞTURMA MOTORU
    generateResponse(strategy, analysis) {
        let response = '';
        
        // 1. Empati ve tanıma
        if (strategy.empathyLevel > 0.7) {
            response += this.generateEmpathy(analysis);
        }
        
        // 2. Ana içerik
        response += this.generateMainContent(analysis, strategy);
        
        // 3. Eylem önerisi
        if (strategy.includeAction) {
            response += '\n\n' + this.generateAction(analysis);
        }
        
        // 4. Soru (engagement için)
        if (strategy.includeQuestion) {
            response += '\n\n' + this.generateFollowUpQuestion(analysis);
        }
        
        // 5. Kişiselleştirme
        response = this.personalizeResponse(response);
        
        return response;
    }
    
    generateEmpathy(analysis) {
        const empathyResponses = {
            struggle: [
                "Zorlandığını anlıyorum. 😊 Bu tamamen normal!",
                "Biliyorum, bazen zorlayıcı olabiliyor. 💙",
                "Senin yerinde olsam ben de aynı şekilde hissederdim. 🤗"
            ],
            frustration: [
                "Anlıyorum, sinir bozucu olabilir. 😌",
                "Hayal kırıklığına uğramış gibi görünüyorsun. Ben buradayım! 💫"
            ],
            excitement: [
                "Heyecanını hissediyorum! 🎉",
                "Enerjin çok güzel! ⚡"
            ]
        };
        
        if (analysis.sentiment === 'negative' || analysis.intent === 'struggle') {
            const responses = empathyResponses.struggle;
            return responses[Math.floor(Math.random() * responses.length)] + '\n\n';
        }
        
        return '';
    }
    
    generateMainContent(analysis, strategy) {
        // Intent bazlı yanıtlar
        switch(analysis.intent) {
            case 'greeting':
                return this.handleGreeting();
            case 'question':
                return this.handleQuestion(analysis);
            case 'struggle':
                return this.handleStruggle(analysis);
            case 'achievement':
                return this.handleAchievement(analysis);
            case 'help':
                return this.handleHelp();
            case 'feedback':
                return this.handleFeedback(analysis);
            default:
                return this.handleGeneral(analysis);
        }
    }
    
    handleGreeting() {
        const userName = this.userProfile.name ? ` ${this.userProfile.name}` : '';
        const greetings = [
            `Merhaba${userName}! 🎵 Seni görmek harika! Bugün nasılsın?`,
            `Selam${userName}! 🎶 Müzik pratiğine hazır mısın?`,
            `Hey${userName}! ✨ Yeni bir gün, yeni fırsatlar! Ne yapmak istersin?`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    handleQuestion(analysis) {
        const keywords = analysis.keywords;
        
        // Performans sorusu
        if (keywords.some(k => ['performans', 'durum', 'nasıl', 'gelişim'].includes(k))) {
            return this.getDetailedPerformanceAnalysis();
        }
        
        // İpucu sorusu
        if (keywords.some(k => ['ipucu', 'öneri', 'tavsiye', 'nasıl'].includes(k))) {
            return this.getPersonalizedTip();
        }
        
        // Motivasyon
        if (keywords.some(k => ['motivasyon', 'ilham', 'cesaret'].includes(k))) {
            return this.getMotivationalMessage();
        }
        
        return "Harika bir soru! 💡 Sana en iyi şekilde yardımcı olmak istiyorum. Biraz daha detay verir misin?";
    }
    
    handleStruggle(analysis) {
        const tips = [
            "**Durumu Anlıyorum** 🤗\n\nZor anlar herkesin başına gelir. İşte sana özel stratejim:\n\n1️⃣ **Kısa Mola Ver:** 5 dakika ara ver, nefes al\n2️⃣ **Parçalara Böl:** Zorluğu küçük adımlara ayır\n3️⃣ **Yavaşla:** Hız yerine doğruluğa odaklan\n4️⃣ **Kendine Güven:** Sen yapabilirsin!\n\nBir adım geriye gidelim ve yavaşça ilerleyelim. Hazırsan başlayalım! 💪",
            
            "**Sen Yalnız Değilsin** 💙\n\nHer müzisyen zorluklarla karşılaşır. Bunu bil:\n\n✨ Mozart bile hata yapardı\n✨ Beethoven yıllarca pratik yaptı\n✨ Senin yolculuğun benzersiz\n\nŞimdi ne yapabiliriz:\n• Farklı bir yaklaşım deneyelim\n• Hedefi küçültelim\n• Başarıları kutlayalım\n\nBirlikte aşacağız! 🚀"
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    handleAchievement(analysis) {
        return `**MÜTHŞ! 🎉🎊**\n\nBu inanılmaz bir başarı! Gerçekten gurur duydum! 🌟\n\n${this.getCustomCelebration()}\n\nBu başarıyı hak ettin çünkü:\n✅ Çok çalıştın\n✅ Vazgeçmedin\n✅ Kendine inandın\n\nŞimdi sıradaki hedefin ne? Daha büyük şeyler seni bekliyor! 🚀`;
    }
    
    handleHelp() {
        return "**Tabii ki yardım edeyim! 🤝**\n\nSana şu konularda destek olabilirim:\n\n🎵 **Teknik Sorular:** Nota, ritim, tonlama\n📊 **Performans Analizi:** Gelişimini takip et\n💡 **İpuçları:** Kişiselleştirilmiş öneriler\n💪 **Motivasyon:** Seni ateşlemeye hazırım!\n🎯 **Hedef Belirleme:** Planını birlikte yapalım\n\nHangi konuda yardımcı olmamı istersin?";
    }
    
    handleFeedback(analysis) {
        if (analysis.sentiment === 'positive' || analysis.sentiment === 'very_positive') {
            return "Çok teşekkür ederim! 🙏 Senin gülümsemen benim motivasyonum! Sana yardımcı olabilmek harika bir duygu. Başka ne yapabilirim? 😊";
        }
        return "Geri bildirim için teşekkürler. 🙏 Nasıl daha iyi olabilirim? Açık sözlü ol, seninle gelişmek istiyorum!";
    }
    
    handleGeneral(analysis) {
        // Bağlama göre yanıt
        if (this.context.currentTopic) {
            return `${this.context.currentTopic} hakkında konuşuyorduk değil mi? Devam edelim mi? 🎵`;
        }
        
        return "Anlıyorum. 💭 Sana nasıl yardımcı olabilirim? Performansın, ipuçları, motivasyon - her konuda buradayım!";
    }
    
    generateAction(analysis) {
        const actions = [
            "💡 **Şimdi Dene:** Bir egzersiz yap ve hisset!",
            "🎯 **Bir Sonraki Adım:** Hedefini belirle ve başla!",
            "📝 **Not Al:** Bu ipucunu kaydet!",
            "🎵 **Pratik Zamanı:** 5 dakika ayır ve çalış!"
        ];
        return actions[Math.floor(Math.random() * actions.length)];
    }
    
    generateFollowUpQuestion(analysis) {
        const questions = [
            "Sence hangi alana odaklanmalıyız? 🤔",
            "Bugün ne öğrenmek istersin? 📚",
            "Hedefin nedir? Birlikte planını yapalım! 🎯",
            "Nasıl hissediyorsun şu an? 💭"
        ];
        return questions[Math.floor(Math.random() * questions.length)];
    }
    
    personalizeResponse(response) {
        const name = this.userProfile.name;
        if (name && Math.random() > 0.7) {
            response = response.replace(/Sen /g, `Sen ${name} `);
        }
        return response;
    }
    
    // Detaylı performans analizi
    getDetailedPerformanceAnalysis() {
        const report = this.musicAI.generatePerformanceReport();
        
        if (!report.stats) {
            return "📊 **Performans Analizi**\n\nHenüz yeterli veri toplamadık. Ama bu harika bir başlangıç!\n\n🌱 **Tavsiyem:** Birkaç egzersiz yap, sonra birlikte analiz edelim. Her adım bir ilerleme!";
        }
        
        const stats = report.stats;
        const trend = stats.improvement;
        const level = report.message;
        
        let analysis = `📊 **Detaylı Performans Raporu**\n\n`;
        analysis += `🏅 **Seviye:** ${level}\n`;
        analysis += `📈 **Başarı Oranı:** %${stats.successRate}\n`;
        analysis += `🎯 **Toplam Deneme:** ${stats.totalAttempts}\n`;
        analysis += `📊 **Trend:** ${trend}\n\n`;
        
        // Güçlü yönler
        if (stats.strongNotes.length > 0) {
            analysis += `💪 **Güçlü Notaların:**\n`;
            stats.strongNotes.forEach(note => {
                analysis += `   ✅ ${note} - Harikasın!\n`;
            });
            analysis += '\n';
        }
        
        // Gelişim alanları
        if (stats.weakNotes.length > 0) {
            analysis += `📚 **Gelişim Alanların:**\n`;
            stats.weakNotes.forEach(note => {
                analysis += `   🎯 ${note} - Burada çalışalım!\n`;
            });
            analysis += '\n';
        }
        
        // Özel öneri
        analysis += `💡 **Özel Önerim:**\n`;
        if (parseFloat(stats.successRate) > 70) {
            analysis += `Harikasın! 🌟 Şimdi zorluk seviyesini artırmanın zamanı geldi!`;
        } else if (parseFloat(stats.successRate) > 50) {
            analysis += `İyi gidiyorsun! 👍 Tutarlılığı artırmak için her gün 15 dakika çalış.`;
        } else {
            analysis += `Başlangıç zorlayıcı olabilir. 🌱 Sabırla ve küçük adımlarla ilerliyoruz!`;
        }
        
        return analysis;
    }
    
    // Kişiselleştirilmiş ipucu
    getPersonalizedTip() {
        const performance = this.musicAI.userProfile.averageAccuracy;
        const weakNotes = this.musicAI.userProfile.weakNotes;
        
        let tip = `💡 **Sana Özel İpucu**\n\n`;
        
        if (weakNotes.length > 0) {
            tip += `${weakNotes[0]} notasında zorlandığını görüyorum. İşte stratejim:\n\n`;
            tip += `**1. Tanı:** Bu nota senin için "zorlu nota" olmuş\n`;
            tip += `**2. Çözüm:**\n`;
            tip += `   • Her gün 3 dakika sadece bu notaya odaklan\n`;
            tip += `   • Yakın notalara geçerek yavaşça yaklaş\n`;
            tip += `   • Gözlerini kapat ve sadece dinle\n\n`;
            tip += `**3. Motivasyon:** Bir hafta sonra farkı göreceksin! 🚀`;
        } else {
            tip += this.musicAI.ai ? this.getTipForUser() : "Genel ipuçları için hazırım!";
        }
        
        return tip;
    }
    
    // Motivasyon mesajı
    getMotivationalMessage() {
        const messages = [
            "🔥 **SEN YAPABİLİRSİN!**\n\nBiliyorum zor görünüyor, ama unutma:\n\n• Mozart 5 yaşında başladı - sen hiç geç kalmadın!\n• Beethoven sağırdı ama müzik yarattı\n• Sen de her gün daha iyisin\n\n💪 Vazgeçme! Müzik senin içinde!",
            
            "⭐ **İNAN KENDİNE!**\n\nBir yıl sonraki ben bugünki sana teşekkür edecek.\n\nNeden mi?\n\n✨ Çünkü bugün pratik yaptın\n✨ Çünkü vazgeçmedin\n✨ Çünkü kendine inandın\n\nDevam et! 🚀",
            
            "🌟 **BAŞARI YAKINDA!**\n\nHer büyük müzisyen senin bulunduğun noktadan geçti.\n\nFark nedir?\n\n🎵 Onlar devam etti\n🎵 Sen de devam ediyorsun\n🎵 Başarı kaçınılmaz!\n\nHadi, bir egzersiz daha! 💪"
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    getCustomCelebration() {
        const celebrations = [
            "🎊 İnanılmaz bir başarı!",
            "🏆 Gerçek bir şampiyonun işi bu!",
            "⭐ Yıldız gibi parlıyorsun!",
            "🚀 Göklere uçuyorsun!",
            "💎 Elmas gibi değerlisin!"
        ];
        return celebrations[Math.floor(Math.random() * celebrations.length)];
    }
    
    // Eski metodlarla uyumluluk
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
        return this.getPersonalizedTip();
    }
    
    generateAutoNotification(type, data) {
        let message = '';
        
        switch(type) {
            case 'milestone':
                message = `🎯 **Dönüm Noktası!**\n\n${data.count} deneme tamamladın! ${data.encouragement}\n\nBu sadece başlangıç! 🚀`;
                break;
            case 'achievement':
                message = `🏆 **Başarı!**\n\n${data.message}\n\nBu başarıyı kutluyoruz! 🎉`;
                break;
            default:
                message = data.message;
        }
        
        return { message, type, timestamp: Date.now() };
    }
    
    addToHistory(role, message) {
        this.conversationHistory.push({
            role,
            message,
            timestamp: Date.now()
        });
        
        if (this.conversationHistory.length > 50) {
            this.conversationHistory.shift();
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedMusicAssistant;
}
