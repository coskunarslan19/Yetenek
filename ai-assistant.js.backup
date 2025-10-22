// Advanced AI Music Assistant - Gelişmiş Yapay Zeka Müzik Asistanı
// Kullanıcılarla doğal sohbet edebilen, bağlam anlayan, kişiselleştirilmiş akıllı asistan

class MusicAssistant {
    constructor(musicAI) {
        this.musicAI = musicAI;
        this.conversationHistory = [];
        this.assistantName = "Müzik Asistanı";
        this.userPreferences = {
            name: null,
            level: 'beginner',
            favoriteGenre: null,
            practiceGoals: []
        };
        
        // Context tracking - Bağlam takibi
        this.currentContext = {
            lastTopic: null,
            userName: null,
            mood: 'neutral', // positive, neutral, negative
            sessionStartTime: Date.now(),
            questionsAsked: 0,
            lastInteraction: Date.now()
        };
        
        // Gelişmiş kişilik
        this.personality = {
            friendly: true,
            encouraging: true,
            professional: true,
            humorous: true,
            empathetic: true,
            adaptive: true
        };
        
        // Konuşma kalıpları - Daha doğal ve samimi
        this.conversationPatterns = {
            greetings: [
                "Merhaba{name}! 🎵 Bugün sana nasıl yardımcı olabilirim?",
                "Selam{name}! 🎶 Müzik pratiği için hazır mısın?",
                "Hey{name}! 🎼 Yeni şeyler öğrenmeye hazır mısın?",
                "Hoş geldin{name}! ✨ Bugün hangi konuda destek istiyorsun?"
            ],
            acknowledgments: [
                "Anlıyorum! 👍",
                "Tabii ki! 😊",
                "Elbette! 🎯",
                "Kesinlikle! ⭐",
                "Harika soru! 💡"
            ],
            thinking: [
                "Düşünüyorum... 🤔",
                "Bir bakalım... 📊",
                "Analiz ediyorum... 🔍",
                "Değerlendiriyorum... 📈"
            ],
            transitions: [
                "Bu arada,",
                "Ayrıca,",
                "Bir de,",
                "Unutmadan,",
                "İlave olarak,"
            ]
        };
        
        // Zengin bilgi tabanı
        this.knowledgeBase = {
            welcomeMessages: [
                "Merhaba! Ben senin kişisel müzik koçunuyum! 🎵\n\nBirlikte müzikal yolculuğunda sana rehberlik edeceğim. İster yeni başlıyor ol, ister deneyimli bir müzisyen, sana özel ipuçları ve motivasyon sunacağım!\n\nHazırsan başlayalım! 🚀",
                
                "Selam! 🎶 Ben senin yapay zeka destekli müzik asistanınım!\n\nSeninle konuşmaktan ve sana yardım etmekten mutluluk duyarım. Sorularını sorabilir, ipuçları alabilir ve birlikte gelişebiliriz!\n\nNe hakkında konuşmak istersin? 😊",
                
                "Hey! Hoş geldin! ✨\n\nBen burada sana destek olmak, sorularını yanıtlamak ve müzikal becerilerini geliştirmene yardımcı olmak için varım.\n\nBirlikte harika şeyler başaracağız! 💪"
            ],
            
            conversationStarters: {
                smallTalk: [
                    "Bugün nasılsın? Müzik pratiğine hazır mısın? 😊",
                    "Son pratiklerinden sonra kendini nasıl hissediyorsun? 🎵",
                    "Bugün enerjin nasıl? Yeni şeyler öğrenmeye hazır mısın? ⚡",
                    "Müzikal ruh halin nasıl? Neşeli mi, sakin mi? 🎭"
                ],
                checkIn: [
                    "Seni görmeyeli uzun zaman oldu! Ne yapıyordun? 🤗",
                    "Tekrar hoş geldin! Ara verdin mi yoksa meşgul müydün? 👋",
                    "Merhaba yabancı! Neredeydin? 😄",
                    "Geri döndüğüne sevindim! Nasıl geçti arası? 🌟"
                ]
            },
            
            tips: {
                beginner: {
                    technical: [
                        "💡 **Nefes Kontrolü Temeli**\n\nDoğru nefes almak herşeyin temelidir! Derin nefes al, karnından şarkı söyle. Diyafram nefesi kullanmayı öğren.\n\n**Pratik:** Her gün 5 dakika sadece nefes egzersizi yap.",
                        
                        "💡 **Tempo ve Ritim**\n\nAcele etme! Müzik bir yarış değil. Her notayı hisset, zaman ayır.\n\n**Pratik:** Metronome kullan, 60 BPM'den başla.",
                        
                        "💡 **Kulak Eğitimi**\n\nNotaları duymayı öğren. Gözlerini kapat ve sadece dinle.\n\n**Pratik:** Günde 10 dakika nota tanıma çalış.",
                        
                        "💡 **Relaksasyon**\n\nGergin omuzlar kötü ses demektir. Rahatla, gevşe.\n\n**Pratik:** Şarkı söylemeden önce omuz rotasyonu yap."
                    ],
                    mental: [
                        "🧠 **Kendine İnan!**\n\nHerkes bir gün başladı. Sen de yapabilirsin!\n\nYetenek %10, çalışma %90. Devam et!",
                        
                        "🧠 **Hatalar İyidir**\n\nHer hata bir öğrenme fırsatıdır. Mükemmel olmak zorunda değilsin.\n\nHataların seni daha iyi yapar!",
                        
                        "🧠 **Sabır ve Süreklilik**\n\nBüyük değişimler küçük adımlarla başlar.\n\nHer gün조금 (biraz) ilerleme = Büyük başarı!"
                    ]
                },
                intermediate: {
                    technical: [
                        "🎯 **Dinamikler**\n\nSadece doğru nota yetmez. Forte (güçlü) ve piano (yumuşak) arasındaki farkı öğren.\n\n**Pratik:** Aynı notayı farklı ses seviyelerinde söyle.",
                        
                        "🎯 **Aralık Çalışması**\n\nNotalar arası geçişleri hızlandır. Terceler, beşliler, oktavlar...\n\n**Pratik:** Her gün farklı aralıkları çalış.",
                        
                        "🎯 **Vibrato Teknikleri**\n\nSesinize yaşam katın! Vibrato duyguyu aktarır.\n\n**Pratik:** Yavaş vibrato ile başla, hızlandır.",
                        
                        "🎯 **Phrase ve İfade**\n\nMüziği cümleler halinde düşün. Her cümlenin bir hikayesi var.\n\n**Pratik:** Şarkı sözlerini anlayarak söyle."
                    ],
                    mental: [
                        "🧠 **Hedef Belirleme**\n\nNereye gitmek istediğini bil. Kısa ve uzun vadeli hedefler koy.\n\nHedefler motivasyon kaynağıdır!",
                        
                        "🧠 **Kayıt Al ve Dinle**\n\nKendinizi dinlemek acı verebilir ama çok öğreticidir.\n\nObjektif geri bildirim en iyisidir!",
                        
                        "🧠 **Çeşitlilik**\n\nSadece bir tarzda kalmayın. Farklı türleri deneyin.\n\nÇeşitlilik becerinizi genişletir!"
                    ]
                },
                advanced: {
                    technical: [
                        "🏆 **Mikrotonal Hassasiyet**\n\nCent seviyesinde doğruluk. Kulağını en ince detaylara eğit.\n\n**Pratik:** Tuner ile çok hassas çalış.",
                        
                        "🏆 **Poliritmik Anlayış**\n\nFarklı ritimleri aynı anda duy. Karmaşık yapıları çöz.\n\n**Pratik:** 3/4 ve 4/4 ritimleri iç içe çalış.",
                        
                        "🏆 **Tını ve Renk**\n\nSesinizin rengini kontrol edin. Her nota bir renktir.\n\n**Pratik:** Aynı notayı farklı tınılarla söyle.",
                        
                        "🏆 **İmprovizasyon**\n\nAklından müzik yarat. Özgür ol, keşfet.\n\n**Pratik:** Rastgele notalar üzerine melodi kur."
                    ],
                    mental: [
                        "🧠 **Öğretmek = Öğrenmek**\n\nBilginizi başkalarıyla paylaşın. Öğretirken daha çok öğrenirsiniz.\n\nBir öğrenci edinin!",
                        
                        "🧠 **Performans Psikolojisi**\n\nSahne heyecanını yönetin. Zihinsel hazırlık fiziksel kadar önemli.\n\nMeditasyon ve görselleştirme yapın!",
                        
                        "🧠 **Sürekli Yenilik**\n\nKonfor alanından çık. Her zaman yeni şeyler dene.\n\nBüyüme = Rahatsızlık!"
                    ]
                }
            },
            
            encouragement: {
                general: [
                    "Sen harikasın! 🌟 İlerlemen gerçekten etkileyici!",
                    "Wow! Bu çok iyiydi! 🎉 Devam et böyle!",
                    "Mükemmel! 🚀 Yeteneğin parlıyor!",
                    "İnanılmaz! ⭐ Gerçekten gurur duydum!",
                    "Süper! 💪 Bunun için çok çalıştın belli!"
                ],
                struggling: [
                    "Pes etme! 💪 Her ustanın başladığı bir yer var.",
                    "Zorluklarsakin kalmak önemli. 🧘 Yavaş ve kararlı adımlar at.",
                    "Hatalar büyümenin bir parçası. 🌱 Sen öğreniyorsun!",
                    "Bugün zor olabilir, ama yarın daha kolay olacak. 🌅",
                    "Ben sana inanıyorum! 🌟 Sen yapabilirsin!"
                ],
                milestone: [
                    "🎊 Tebrikler! Büyük bir ilerleme kaydettiniz!",
                    "🏆 Başardınız! Bu bir dönüm noktası!",
                    "🎯 Hedefi vurdunuz! Mükemmel!",
                    "✨ Harika bir başarı! Kutlarız!",
                    "🌟 İnanılmaz! Yeni bir seviyeye ulaştınız!"
                ]
            },
            
            corrections: {
                gentle: [
                    "Sorun değil! 😊 Denemeye devam edelim.",
                    "Yaklaştın! 👍 Bir kez daha deneyelim.",
                    "Neredeyse! 🎯 Birazcık daha odaklan.",
                    "İyi deneme! 💫 Şimdi şöyle yapalım...",
                    "Fena değil! 👌 Küçük bir ayarlama yapalım."
                ],
                constructive: [
                    "Anlıyorum zorlandığını. 🤔 Şunu deneyelim:\n\n",
                    "Biraz farklı yaklaşalım. 💡 Şu stratejiyi dene:\n\n",
                    "Başka bir yöntem deneyebiliriz. 🔄 Mesela:\n\n",
                    "Adım adım gidelim. 📝 İlk olarak:\n\n",
                    "Birlikte çözelim. 🤝 İşte bir ipucu:\n\n"
                ]
            },
            
            emotions: {
                happy: ["😊", "🎉", "✨", "🌟", "💫", "🎵", "🎶", "🎼"],
                encouraging: ["💪", "🚀", "⭐", "🎯", "💯", "🔥", "⚡", "✅"],
                thinking: ["🤔", "💭", "📊", "📈", "🔍", "📚", "💡", "🧠"],
                celebrating: ["🎊", "🏆", "🥇", "🎖️", "👏", "🙌", "🎁", "🌈"]
            }
        };
        
        // Konuşma zekası - Conversation Intelligence
        this.conversationIntelligence = {
            lastQuestions: [],
            topicsDiscussed: [],
            userSentiment: 'neutral',
            engagementLevel: 0
        };
    }
    
    // Gelişmiş karşılama mesajı - Context aware
    getWelcomeMessage() {
        const hoursSinceStart = (Date.now() - this.currentContext.sessionStartTime) / (1000 * 60 * 60);
        const userName = this.currentContext.userName ? `, ${this.currentContext.userName}` : '';
        
        if (hoursSinceStart < 0.01) { // İlk karşılama
            const messages = this.knowledgeBase.welcomeMessages;
            return messages[Math.floor(Math.random() * messages.length)];
        } else if (hoursSinceStart > 24) { // Uzun süre sonra
            const messages = this.knowledgeBase.conversationStarters.checkIn;
            return messages[Math.floor(Math.random() * messages.length)].replace('{name}', userName);
        } else { // Normal karşılama
            const messages = this.knowledgeBase.conversationStarters.smallTalk;
            return messages[Math.floor(Math.random() * messages.length)];
        }
    }
    
    // Kullanıcı adını öğren
    extractUserName(text) {
        const patterns = [
            /(?:adım|ismim|benim adım)\s+(\w+)/i,
            /ben\s+(\w+)/i,
            /^(\w+)$/i
        ];
        
        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].length > 2 && match[1].length < 20) {
                this.currentContext.userName = match[1];
                this.userPreferences.name = match[1];
                return match[1];
            }
        }
        return null;
    }
    
    // Duygu analizi - Sentiment Analysis
    analyzeSentiment(text) {
        const positiveWords = ['harika', 'süper', 'mükemmel', 'teşekkür', 'sevdim', 'mutlu', 'iyi', 'güzel', 'başardım'];
        const negativeWords = ['kötü', 'zor', 'yapamıyorum', 'başaramadım', 'yorgunum', 'vazgeçeceğim', 'anlayamıyorum'];
        
        const lowerText = text.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => {
            if (lowerText.includes(word)) score += 1;
        });
        
        negativeWords.forEach(word => {
            if (lowerText.includes(word)) score -= 1;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }
    
    // Gelişmiş performans için ipucu
    getTipForUser() {
        const performance = this.musicAI.userProfile.averageAccuracy;
        const level = performance < 0.4 ? 'beginner' : performance < 0.7 ? 'intermediate' : 'advanced';
        
        const category = Math.random() > 0.5 ? 'technical' : 'mental';
        const tips = this.knowledgeBase.tips[level][category];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        // Kişiselleştir
        const userName = this.currentContext.userName || '';
        return userName ? `Hey ${userName}! 👋\n\n${randomTip}` : randomTip;
    }
    
    // Başarı/başarısızlığa göre dinamik teşvik
    getEncouragementMessage(isSuccess) {
        const sentiment = this.conversationIntelligence.userSentiment;
        let messages;
        
        if (isSuccess) {
            messages = this.knowledgeBase.encouragement.general;
        } else {
            if (sentiment === 'negative') {
                messages = this.knowledgeBase.encouragement.struggling;
            } else {
                messages = this.knowledgeBase.corrections.gentle;
            }
        }
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Ana soru yanıtlama motoru - Geliştirilmiş
    answerQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        
        // İsim öğrenme
        const detectedName = this.extractUserName(question);
        if (detectedName && lowerQuestion.includes('ad')) {
            return `Memnun oldum ${detectedName}! 🤗 Çok güzel bir isim! Seninle çalışmak harika olacak. Şimdi müziğe odaklan
        
        // Performans soruları
        if (lowerQuestion.includes('nasıl') && (lowerQuestion.includes('gidiyor') || lowerQuestion.includes('performans'))) {
            return this.getPerformanceAnalysis();
        }
        
        // İpucu istekleri
        if (lowerQuestion.includes('ipucu') || lowerQuestion.includes('tavsiye') || lowerQuestion.includes('öneri')) {
            return this.getTipForUser();
        }
        
        // Zayıf notalar
        if (lowerQuestion.includes('zayıf') || lowerQuestion.includes('güç') || lowerQuestion.includes('zorlanıyorum')) {
            return this.getWeakNotesAdvice();
        }
        
        // Nasıl başlayacağım
        if (lowerQuestion.includes('nasıl başla') || lowerQuestion.includes('nereden başla')) {
            return this.getStartingAdvice();
        }
        
        // Genel bilgi
        if (lowerQuestion.includes('nedir') || lowerQuestion.includes('nasıl çalışır')) {
            return this.getGeneralInfo();
        }
        
        // Motivasyon
        if (lowerQuestion.includes('motivasyon') || lowerQuestion.includes('vazgeç') || lowerQuestion.includes('zor')) {
            return this.getMotivation();
        }
        
        // Default yanıt
        return "🤔 İlginç bir soru! Size şu konularda yardımcı olabilirim:\n\n" +
               "• Performans analizi ('Nasıl gidiyorum?')\n" +
               "• İpuçları ve tavsiyeler ('İpucu ver')\n" +
               "• Zayıf notalar hakkında rehberlik ('Zorlandığım notalar')\n" +
               "• Başlangıç rehberi ('Nasıl başlamalıyım?')\n" +
               "• Motivasyon ('Motivasyon ver')\n\n" +
               "Başka sorunuz var mı? 😊";
    }
    
    // Performans analizi
    getPerformanceAnalysis() {
        const report = this.musicAI.generatePerformanceReport();
        
        if (!report.stats) {
            return "📊 Henüz yeterli veri toplamadık. Birkaç egzersiz yapın, sonra performansınızı analiz edelim!";
        }
        
        const stats = report.stats;
        let analysis = `📊 **Performans Analizi**\n\n`;
        analysis += `${report.message}\n\n`;
        analysis += `✅ Toplam Deneme: ${stats.totalAttempts}\n`;
        analysis += `📈 Başarı Oranı: %${stats.successRate}\n`;
        analysis += `📊 İlerleme: ${stats.improvement}\n\n`;
        
        if (stats.strongNotes.length > 0) {
            analysis += `💪 Güçlü Notalarınız: ${stats.strongNotes.join(', ')}\n`;
        }
        
        if (stats.weakNotes.length > 0) {
            analysis += `📚 Çalışmanız Gereken Notalar: ${stats.weakNotes.join(', ')}\n\n`;
            analysis += `💡 Bu notalarda özel pratik yapmanızı öneririm!`;
        } else {
            analysis += `\n🌟 Harika! Tüm notalarda dengeli bir performans gösteriyorsunuz!`;
        }
        
        return analysis;
    }
    
    // Zayıf notalar için tavsiye
    getWeakNotesAdvice() {
        const weakNotes = this.musicAI.userProfile.weakNotes;
        
        if (weakNotes.length === 0) {
            return "🎉 Harika! Şu an zorlandığınız bir nota yok gibi görünüyor. Harika iş çıkarıyorsunuz!";
        }
        
        let advice = `📚 **Zorlandığınız Notalar**: ${weakNotes.join(', ')}\n\n`;
        advice += `💡 **Öneriler:**\n\n`;
        advice += `1. Bu notaları her gün 5 dakika özel çalışın\n`;
        advice += `2. Notayı dinleyin, kafanızda tekrarlayın, sonra söyleyin\n`;
        advice += `3. Daha yavaş tempo ile başlayın\n`;
        advice += `4. Rahat olduğunuz bir notadan başlayıp bu notalara geçiş yapın\n`;
        advice += `5. Kendinizi kaydedip dinleyin\n\n`;
        advice += `💪 Sabırlı olun, başarı gelecek!`;
        
        return advice;
    }
    
    // Başlangıç rehberi
    getStartingAdvice() {
        return `🎵 **Başlangıç Rehberi**\n\n` +
               `**1. Hazırlık 🎯**\n` +
               `• Sessiz bir ortam bulun\n` +
               `• Mikrofonunuzu test edin\n` +
               `• Rahat bir pozisyonda durun/oturun\n\n` +
               `**2. İlk Adımlar 🚀**\n` +
               `• "Tek Ses" sekmesinden başlayın\n` +
               `• "Rastgele Nota Çal" butonuna tıklayın\n` +
               `• Notayı dikkatle dinleyin\n` +
               `• "Dinlemeye Başla" butonuna basın\n` +
               `• Duyduğunuz notayı söyleyin\n\n` +
               `**3. İpuçları 💡**\n` +
               `• Acele etmeyin, her nota için zaman ayırın\n` +
               `• Derin nefes alın ve rahatlamaya çalışın\n` +
               `• İlk denemelerinizde mükemmel olmayı beklemeyin\n` +
               `• Her gün 10-15 dakika pratik yapın\n\n` +
               `Hazırsanız başlayalım! 🎶`;
    }
    
    // Genel bilgi
    getGeneralInfo() {
        return `ℹ️ **Uygulama Hakkında**\n\n` +
               `Bu uygulama yapay zeka destekli bir müzik eğitim platformudur.\n\n` +
               `**Özellikler:**\n` +
               `🎵 4 farklı mod (Tek Ses, İki Ses, Üç Ses, Dört Ses)\n` +
               `🤖 AI destekli nota tanıma ve performans analizi\n` +
               `📊 Gerçek zamanlı geri bildirim\n` +
               `🎯 Adaptif öğrenme sistemi\n` +
               `📈 İlerleme takibi\n\n` +
               `**Nasıl Çalışır:**\n` +
               `1. Uygulama bir nota çalar\n` +
               `2. Siz o notayı söylersiniz\n` +
               `3. AI sesinizi analiz eder\n` +
               `4. Size anlık geri bildirim verir\n` +
               `5. Performansınızı kaydeder ve size özel tavsiyelerde bulunur\n\n` +
               `Sorularınız için bana yazabilirsiniz! 😊`;
    }
    
    // Motivasyon mesajı
    getMotivation() {
        const motivations = [
            `💪 **Vazgeçmeyin!**\n\nMüzik öğrenmek bir maraton, sprint değil. Her büyük müzisyen bir zamanlar tam olarak sizin bulunduğunuz noktadaydı. Fark yaratan şey, devam etmekti.\n\n"Yetenek önemlidir, ama çalışkanlık daha da önemlidir." - Ludwig van Beethoven`,
            
            `🌟 **İnanın Kendinize!**\n\nZorluklar sadece büyüme fırsatlarıdır. Bugün zorlandığınız her nota, yarın ustalaşacağınız bir beceridir.\n\n"Müzik ruhun gıdasıdır." - Platon\n\nDevam edin, harikasınız! 🎵`,
            
            `🚀 **Her Gün Bir Adım!**\n\nBugün dün olduğunuz yerden biraz daha iyisiniz. Yarın bugünden daha iyi olacaksınız. İlerleme her zaman görünür olmayabilir, ama orada.\n\n"Pratik mükemmeli yapmaz, pratik kalıcı yapar." - Vince Lombardi`,
            
            `🎯 **Hedeflerinize Odaklanın!**\n\nNeden başladığınızı hatırlayın. O ilk heyecanı, o tutkuyu. Hala orada, içinizde. Sadece biraz daha ilerleyin.\n\n"Müzik yaşama anlam katar." - Anonymous\n\nBundan vazgeçmeyin! 💪`,
            
            `✨ **Kendinizle Rekabet Edin!**\n\nBaşkalarıyla değil, dünkü kendinizle yarışın. Her küçük ilerleme bir zaferdir.\n\n"Başarının sırrı başlamaktır." - Mark Twain\n\nSiz zaten başladınız! Şimdi devam edin! 🌈`
        ];
        
        return motivations[Math.floor(Math.random() * motivations.length)];
    }
    
    // Sohbet geçmişine ekle
    addToHistory(role, message) {
        this.conversationHistory.push({
            role: role, // 'user' or 'assistant'
            message: message,
            timestamp: Date.now()
        });
        
        // Son 20 mesajı tut
        if (this.conversationHistory.length > 20) {
            this.conversationHistory.shift();
        }
    }
    
    // Akıllı yanıt oluştur
    generateSmartResponse(userInput) {
        this.addToHistory('user', userInput);
        
        const response = this.answerQuestion(userInput);
        
        this.addToHistory('assistant', response);
        
        return {
            message: response,
            timestamp: Date.now(),
            type: 'text'
        };
    }
    
    // Otomatik bildirim oluştur (performans bazlı)
    generateAutoNotification(eventType, data) {
        let message = '';
        
        switch(eventType) {
            case 'achievement':
                message = `🏆 **Başarı Kilidi Açıldı!**\n\n${data.message}`;
                break;
                
            case 'milestone':
                message = `🎯 **Dönüm Noktası!**\n\n${data.count} deneme tamamladınız! ${data.encouragement}`;
                break;
                
            case 'improvement':
                message = `📈 **İlerleme Kaydedildi!**\n\n${data.stat} performansınız %${data.improvement} arttı!`;
                break;
                
            case 'suggestion':
                message = `💡 **Öneri**\n\n${data.tip}`;
                break;
                
            default:
                message = data.message || this.getEncouragementMessage(true);
        }
        
        this.addToHistory('assistant', message);
        
        return {
            message: message,
            timestamp: Date.now(),
            type: eventType
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicAssistant;
}
