// Echo (Ses Tekrarı) Mode Functions
// Kullanıcı çalınan sesi tekrar eder

// Add these functions to MusicAptitudeTest class

async startEcho() {
    try {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 4096;
        this.analyser.smoothingTimeConstant = 0.98;
        
        this.microphone.connect(this.analyser);
        
        this.echoListening = true;
        
        document.getElementById('startEchoBtn').disabled = true;
        document.getElementById('stopEchoBtn').disabled = false;
        
        // Start the echo game
        this.playNextEchoNote();
        
    } catch (error) {
        console.error('Error starting echo:', error);
        alert('Mikrofon erişimi reddedildi veya bir hata oluştu.');
    }
}

stopEcho() {
    if (this.microphone) {
        this.microphone.disconnect();
        this.microphone = null;
    }
    
    if (this.analyser) {
        this.analyser.disconnect();
        this.analyser = null;
    }
    
    this.echoListening = false;
    this.echoWaitingForResponse = false;
    
    document.getElementById('startEchoBtn').disabled = false;
    document.getElementById('stopEchoBtn').disabled = true;
}

async playNextEchoNote() {
    if (!this.echoListening) return;
    
    // Select random note
    const randomIndex = Math.floor(Math.random() * this.notes.length);
    const note = this.notes[randomIndex];
    
    this.echoPlayedNote = note.name;
    this.echoPlayedFreq = note.frequency;
    this.echoWaitingForResponse = false;
    
    // Update UI
    document.getElementById('echoPlayedNote').textContent = note.name;
    document.getElementById('echoPlayedFreq').textContent = note.frequency.toFixed(2) + ' Hz';
    document.getElementById('echoDetectedNote').textContent = '-';
    document.getElementById('echoDetectedFreq').textContent = '-';
    document.getElementById('echoAccuracy').textContent = '-';
    
    // Play the note
    this.playTone(note.frequency, 1.5);
    
    // Wait 2 seconds, then start listening
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (this.echoListening) {
        this.echoWaitingForResponse = true;
        this.smoothedFrequency = 0;
        this.stableDetectionCount = 0;
        this.detectEchoPitch();
    }
}

detectEchoPitch() {
    if (!this.echoListening || !this.echoWaitingForResponse) return;
    
    const bufferLength = this.analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(buffer);
    
    const frequency = this.autoCorrelate(buffer, this.audioContext.sampleRate);
    
    if (frequency > 0 && frequency >= 60 && frequency <= 1100) {
        // ULTRA AGGRESSIVE SMOOTHING
        if (this.smoothedFrequency === 0) {
            this.smoothedFrequency = frequency;
        } else {
            this.smoothedFrequency = this.smoothedFrequency * 0.998 + frequency * 0.002;
        }
        
        const detectedNote = this.frequencyToNote(this.smoothedFrequency);
        
        // Update UI
        document.getElementById('echoDetectedNote').textContent = detectedNote;
        document.getElementById('echoDetectedFreq').textContent = this.smoothedFrequency.toFixed(2) + ' Hz';
        
        // Check octaves
        const octaves = [
            this.echoPlayedFreq / 4,
            this.echoPlayedFreq / 2,
            this.echoPlayedFreq
        ];
        
        let minDiff = Infinity;
        for (let octave of octaves) {
            const diff = Math.abs(this.smoothedFrequency - octave);
            if (diff < minDiff) minDiff = diff;
        }
        
        document.getElementById('echoAccuracy').textContent = minDiff.toFixed(2) + ' Hz';
        
        // Check if stable
        const freqDiff = Math.abs(this.smoothedFrequency - this.lastStableFrequency);
        
        if (freqDiff < 25) {
            this.stableDetectionCount++;
        } else {
            this.stableDetectionCount = 1;
        }
        
        this.lastStableFrequency = this.smoothedFrequency;
        
        // If stable for 30 frames (~1 second)
        if (this.stableDetectionCount >= 30) {
            // Check if correct
            if (minDiff < 25) {
                this.echoCorrectCount++;
                this.echoTotalCount++;
                this.showEchoResult(true);
            } else {
                this.echoWrongCount++;
                this.echoTotalCount++;
                this.showEchoResult(false);
            }
        }
        
        this.drawEchoPitchMeter(this.smoothedFrequency, detectedNote);
    } else {
        this.drawEchoPitchMeter();
    }
    
    requestAnimationFrame(() => this.detectEchoPitch());
}

showEchoResult(correct) {
    this.echoWaitingForResponse = false;
    
    // Update score
    document.getElementById('echoScore').textContent = 
        `${this.echoCorrectCount} / ${this.echoTotalCount}`;
    
    if (correct) {
        alert('✅ Doğru! Sesi başarıyla tekrar ettiniz!');
    } else {
        alert('❌ Yanlış! Tekrar deneyin.');
    }
    
    // Play next note after 1 second
    setTimeout(() => {
        if (this.echoListening) {
            this.playNextEchoNote();
        }
    }, 1000);
}

drawEchoPitchMeter(currentFreq = null, currentNote = null) {
    const ctx = this.echoCanvasContext;
    const width = this.echoCanvas.getBoundingClientRect().width;
    const height = this.echoCanvas.getBoundingClientRect().height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.clearRect(0, 0, width, height);
    
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#667eea');
    bgGradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    if (!this.echoPlayedNote) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎵 Başla butonuna tıklayın', centerX, 60);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '18px Arial';
        ctx.fillText('Tuner hazır', centerX, height - 30);
        return;
    }
    
    // Draw played note at top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`🎹 ${this.echoPlayedNote}`, centerX, 60);
    
    // Draw horizontal bar indicator
    const barWidth = width * 0.7;
    const barHeight = 40;
    const barX = (width - barWidth) / 2;
    const barY = centerY;
    
    // Bar background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, 20);
    ctx.fill();
    
    // Center line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(centerX - 2, barY - 10, 4, barHeight + 20);
    
    // Show current position
    if (currentFreq && currentFreq > 0) {
        const octaves = [
            this.echoPlayedFreq / 4,
            this.echoPlayedFreq / 2,
            this.echoPlayedFreq
        ];
        
        let minDiff = Infinity;
        let closestOctave = this.echoPlayedFreq;
        for (let octave of octaves) {
            const diff = Math.abs(currentFreq - octave);
            if (diff < Math.abs(minDiff)) {
                minDiff = currentFreq - octave;
                closestOctave = octave;
            }
        }
        
        const clampedDiff = Math.max(-50, Math.min(50, minDiff));
        const position = centerX + (clampedDiff / 50) * (barWidth / 2);
        
        const accuracy = Math.abs(minDiff);
        let indicatorColor;
        if (accuracy < 10) indicatorColor = '#11998e';
        else if (accuracy < 25) indicatorColor = '#fbbf24';
        else indicatorColor = '#f87171';
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = indicatorColor;
        ctx.fillStyle = indicatorColor;
        ctx.beginPath();
        ctx.arc(position, barY + barHeight / 2, 18, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(position, barY + barHeight / 2, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Show detected note
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`🎤 ${currentNote}`, centerX, centerY + 70);
        
        ctx.font = '18px Arial';
        ctx.fillStyle = indicatorColor;
        const diffText = minDiff > 0 ? `+${minDiff.toFixed(1)} Hz` : `${minDiff.toFixed(1)} Hz`;
        ctx.fillText(diffText, centerX, centerY + 95);
    } else if (this.echoWaitingForResponse) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎤 Sesi tekrar edin...', centerX, centerY + 70);
    }
}
