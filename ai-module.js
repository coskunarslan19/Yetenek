// AI-Enhanced Pitch Detection Module
// Gelişmiş yapay zeka destekli nota tanıma ve performans analizi

class MusicAI {
    constructor() {
        // AI Model parametreleri
        this.learningRate = 0.1;
        this.confidenceThreshold = 0.75;
        
        // Kullanıcı performans geçmişi
        this.performanceHistory = [];
        this.userProfile = {
            averageAccuracy: 0,
            strongNotes: [],
            weakNotes: [],
            improvementRate: 0
        };
        
        // Adaptif eşik değerleri
        this.adaptiveThresholds = {
            frequency: 10,
            stability: 60,
            confidence: 0.7
        };
    }
    
    // AI destekli nota güvenilirlik hesaplama
    calculateNoteConfidence(frequency, detectedNote, targetFrequency, stableCount) {
        let confidence = 0;
        
        // 1. Frekans doğruluğu (0-1)
        const freqDiff = Math.abs(frequency - targetFrequency);
        const freqAccuracy = Math.max(0, 1 - (freqDiff / 50));
        confidence += freqAccuracy * 0.4;
        
        // 2. Stabilite skoru (0-1)
        const stabilityScore = Math.min(1, stableCount / 60);
        confidence += stabilityScore * 0.3;
        
        // 3. Harmonik uyum (0-1)
        const harmonicScore = this.analyzeHarmonics(frequency, targetFrequency);
        confidence += harmonicScore * 0.2;
        
        // 4. Geçmiş performans (0-1)
        const historyScore = this.getHistoricalScore(detectedNote);
        confidence += historyScore * 0.1;
        
        return Math.min(1, Math.max(0, confidence));
    }
    
    // Harmonik analiz
    analyzeHarmonics(frequency, targetFrequency) {
        const octaves = [
            targetFrequency / 4,  // -2 oktav
            targetFrequency / 2,  // -1 oktav
            targetFrequency,      // 0 oktav
            targetFrequency * 2,  // +1 oktav
            targetFrequency * 4   // +2 oktav
        ];
        
        let minDiff = Infinity;
        for (let octave of octaves) {
            const diff = Math.abs(frequency - octave);
            if (diff < minDiff) minDiff = diff;
        }
        
        return Math.max(0, 1 - (minDiff / 50));
    }
    
    // Geçmiş performans analizi
    getHistoricalScore(noteName) {
        if (this.performanceHistory.length === 0) return 0.5;
        
        const notePerformances = this.performanceHistory.filter(p => p.note === noteName);
        if (notePerformances.length === 0) return 0.5;
        
        const successRate = notePerformances.filter(p => p.success).length / notePerformances.length;
        return successRate;
    }
    
    // Performans kaydı ekleme
    addPerformance(noteName, success, accuracy, timeTaken) {
        this.performanceHistory.push({
            note: noteName,
            success: success,
            accuracy: accuracy,
            time: timeTaken,
            timestamp: Date.now()
        });
        
        // Son 100 performansı tut
        if (this.performanceHistory.length > 100) {
            this.performanceHistory.shift();
        }
        
        this.updateUserProfile();
    }
    
    // Kullanıcı profilini güncelle
    updateUserProfile() {
        if (this.performanceHistory.length === 0) return;
        
        // Ortalama doğruluk
        const totalAccuracy = this.performanceHistory.reduce((sum, p) => sum + (p.success ? 1 : 0), 0);
        this.userProfile.averageAccuracy = totalAccuracy / this.performanceHistory.length;
        
        // Güçlü ve zayıf notalar
        const noteStats = {};
        this.performanceHistory.forEach(p => {
            if (!noteStats[p.note]) {
                noteStats[p.note] = { success: 0, total: 0 };
            }
            noteStats[p.note].total++;
            if (p.success) noteStats[p.note].success++;
        });
        
        this.userProfile.strongNotes = Object.entries(noteStats)
            .filter(([note, stats]) => stats.total >= 3)
            .filter(([note, stats]) => stats.success / stats.total >= 0.8)
            .map(([note, stats]) => note);
            
        this.userProfile.weakNotes = Object.entries(noteStats)
            .filter(([note, stats]) => stats.total >= 3)
            .filter(([note, stats]) => stats.success / stats.total < 0.5)
            .map(([note, stats]) => note);
        
        // İyileşme oranı (son 10 vs önceki 10)
        if (this.performanceHistory.length >= 20) {
            const recent = this.performanceHistory.slice(-10);
            const older = this.performanceHistory.slice(-20, -10);
            
            const recentAccuracy = recent.filter(p => p.success).length / 10;
            const olderAccuracy = older.filter(p => p.success).length / 10;
            
            this.userProfile.improvementRate = recentAccuracy - olderAccuracy;
        }
    }
    
    // Adaptif eşik değerleri ayarlama
    adaptThresholds() {
        const accuracy = this.userProfile.averageAccuracy;
        
        // Kullanıcı başarılıysa eşik değerlerini sıkılaştır
        if (accuracy > 0.8) {
            this.adaptiveThresholds.frequency = Math.max(5, this.adaptiveThresholds.frequency - 1);
            this.adaptiveThresholds.confidence = Math.min(0.85, this.adaptiveThresholds.confidence + 0.05);
        }
        // Kullanıcı zorlanıyorsa eşik değerlerini gevşet
        else if (accuracy < 0.4) {
            this.adaptiveThresholds.frequency = Math.min(15, this.adaptiveThresholds.frequency + 1);
            this.adaptiveThresholds.confidence = Math.max(0.6, this.adaptiveThresholds.confidence - 0.05);
        }
    }
    
    // Akıllı geri bildirim üret
    generateFeedback(confidence, accuracy, noteName) {
        let feedback = {
            message: '',
            color: '',
            suggestion: ''
        };
        
        if (confidence >= 0.9 && accuracy < 5) {
            feedback.message = '🎯 Mükemmel! Tam hedeftesiniz!';
            feedback.color = '#11998e';
            feedback.suggestion = 'Harika! Bu tempoda devam edin.';
        } else if (confidence >= 0.75 && accuracy < 10) {
            feedback.message = '✨ Çok İyi! Neredeyse mükemmel!';
            feedback.color = '#27ae60';
            feedback.suggestion = 'Biraz daha stabil tutmaya çalışın.';
        } else if (confidence >= 0.6 && accuracy < 15) {
            feedback.message = '👍 İyi! Doğru yoldasınız.';
            feedback.color = '#f39c12';
            feedback.suggestion = 'Notayı daha uzun süre tutmaya çalışın.';
        } else if (accuracy < 20) {
            feedback.message = '📊 Yaklaşıyorsunuz!';
            feedback.color = '#e67e22';
            feedback.suggestion = 'Hedef notayı tekrar dinleyin ve tonunuzu ayarlayın.';
        } else {
            feedback.message = '🎵 Tekrar deneyin!';
            feedback.color = '#eb3349';
            feedback.suggestion = 'Notayı yavaşça söylemeye çalışın ve nefes kontrolü yapın.';
        }
        
        // Zayıf notalarda özel öneriler
        if (this.userProfile.weakNotes.includes(noteName)) {
            feedback.suggestion += ` ${noteName} notası sizin için zorlu görünüyor. Pratik yapın!`;
        }
        
        return feedback;
    }
    
    // Performans raporu üret
    generatePerformanceReport() {
        if (this.performanceHistory.length === 0) {
            return {
                message: 'Henüz yeterli veri yok. Egzersizlere başlayın!',
                stats: null
            };
        }
        
        const totalAttempts = this.performanceHistory.length;
        const successCount = this.performanceHistory.filter(p => p.success).length;
        const successRate = ((successCount / totalAttempts) * 100).toFixed(1);
        
        let performanceLevel = '';
        if (this.userProfile.averageAccuracy >= 0.8) {
            performanceLevel = 'Uzman 🏆';
        } else if (this.userProfile.averageAccuracy >= 0.6) {
            performanceLevel = 'İleri 🌟';
        } else if (this.userProfile.averageAccuracy >= 0.4) {
            performanceLevel = 'Orta 📚';
        } else {
            performanceLevel = 'Başlangıç 🌱';
        }
        
        return {
            message: `Seviyeniz: ${performanceLevel}`,
            stats: {
                totalAttempts: totalAttempts,
                successRate: successRate,
                strongNotes: this.userProfile.strongNotes.slice(0, 3),
                weakNotes: this.userProfile.weakNotes.slice(0, 3),
                improvement: this.userProfile.improvementRate > 0 ? 'İlerliyor ↗️' : 
                           this.userProfile.improvementRate < 0 ? 'Durağan ↔️' : 'Yeni başladınız'
            }
        };
    }
    
    // Ses kalitesi analizi
    analyzeVoiceQuality(buffer) {
        let rms = 0;
        for (let i = 0; i < buffer.length; i++) {
            rms += buffer[i] * buffer[i];
        }
        rms = Math.sqrt(rms / buffer.length);
        
        // Spektral yoğunluk
        let spectralCentroid = 0;
        let totalEnergy = 0;
        
        for (let i = 0; i < buffer.length / 2; i++) {
            const magnitude = Math.abs(buffer[i]);
            spectralCentroid += i * magnitude;
            totalEnergy += magnitude;
        }
        
        spectralCentroid = totalEnergy > 0 ? spectralCentroid / totalEnergy : 0;
        
        return {
            volume: rms,
            clarity: spectralCentroid / (buffer.length / 2),
            quality: Math.min(1, rms * 10) * 0.5 + Math.min(1, spectralCentroid / 1000) * 0.5
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicAI;
}
