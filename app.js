// Müzik Yetenek Sınavı Uygulaması
// Piano note generator and pitch detection

class MusicAptitudeTest {
    constructor() {
        // Audio context
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.scriptProcessor = null;
        
        // Current test state
        this.targetNote = null;
        this.targetFrequency = null;
        this.isListening = false;
        this.hasAnswered = false;
        this.stableDetectionCount = 0;
        this.lastStableFrequency = 0;
        this.smoothedFrequency = 0;
        this.lastUpdateTime = 0;
        
        // Score tracking
        this.correctCount = 0;
        this.wrongCount = 0;
        this.totalCount = 0;
        
        // Interval mode tracking
        this.intervalCorrectCount = 0;
        this.intervalWrongCount = 0;
        this.intervalTotalCount = 0;
        this.targetNote1 = null;
        this.targetNote2 = null;
        this.targetFreq1 = null;
        this.targetFreq2 = null;
        this.detectedNotes = new Set();
        this.intervalListening = false;
        
        // Pitch detection
        this.detectedFrequency = 0;
        this.detectedNote = null;
        
        // AI-Enhanced Stability System
        this.frequencyHistory = [];
        this.maxHistoryLength = 10;
        this.kalmanEstimate = 0;
        this.kalmanErrorEstimate = 1;
        this.kalmanQ = 0.001; // Process noise
        this.kalmanR = 0.1;   // Measurement noise
        
        // Canvas for pitch meter
        this.canvas = document.getElementById('pitchCanvas');
        this.canvasContext = this.canvas.getContext('2d');
        
        // Interval canvas
        this.intervalCanvas = document.getElementById('intervalPitchCanvas');
        this.intervalCanvasContext = this.intervalCanvas.getContext('2d');
        
        // Triad mode tracking
        this.triadCorrectCount = 0;
        this.triadWrongCount = 0;
        this.triadTotalCount = 0;
        this.targetNote3 = null;
        this.targetFreq3 = null;
        this.triadListening = false;
        
        // Triad canvas
        this.triadCanvas = document.getElementById('triadPitchCanvas');
        this.triadCanvasContext = this.triadCanvas.getContext('2d');
        
        // Quad mode tracking
        this.quadCorrectCount = 0;
        this.quadWrongCount = 0;
        this.quadTotalCount = 0;
        this.targetNote4 = null;
        this.targetFreq4 = null;
        this.quadListening = false;
        
        // Quad canvas
        this.quadCanvas = document.getElementById('quadPitchCanvas');
        this.quadCanvasContext = this.quadCanvas.getContext('2d');
        
        // Echo mode tracking (removed - empty tab)
        this.echoCorrectCount = 0;
        this.echoWrongCount = 0;
        this.echoTotalCount = 0;
        this.echoListening = false;
        this.echoPlayedNote = null;
        this.echoPlayedFreq = null;
        this.echoWaitingForResponse = false;
        
        // Piano notes (A3 to E5)
        this.notes = [
            { name: 'A3', frequency: 220.00 },
            { name: 'A#3', frequency: 233.08 },
            { name: 'B3', frequency: 246.94 },
            { name: 'C4', frequency: 261.63 },
            { name: 'C#4', frequency: 277.18 },
            { name: 'D4', frequency: 293.66 },
            { name: 'D#4', frequency: 311.13 },
            { name: 'E4', frequency: 329.63 },
            { name: 'F4', frequency: 349.23 },
            { name: 'F#4', frequency: 369.99 },
            { name: 'G4', frequency: 392.00 },
            { name: 'G#4', frequency: 415.30 },
            { name: 'A4', frequency: 440.00 },
            { name: 'A#4', frequency: 466.16 },
            { name: 'B4', frequency: 493.88 },
            { name: 'C5', frequency: 523.25 },
            { name: 'C#5', frequency: 554.37 },
            { name: 'D5', frequency: 587.33 },
            { name: 'D#5', frequency: 622.25 },
            { name: 'E5', frequency: 659.25 }
        ];
        
        // AI Module - Yapay Zeka Entegrasyonu
        this.ai = new MusicAI();
        this.attemptStartTime = 0;
        this.currentConfidence = 0;
        
        this.initializeUI();
        
        // Debug: Check if elements exist
        console.log('Canvas elements:');
        console.log('pitchCanvas:', document.getElementById('pitchCanvas'));
        console.log('intervalPitchCanvas:', document.getElementById('intervalPitchCanvas'));
        console.log('triadPitchCanvas:', document.getElementById('triadPitchCanvas'));
        console.log('quadPitchCanvas:', document.getElementById('quadPitchCanvas'));
        
        // Check if canvas contexts are created
        console.log('Canvas contexts:');
        console.log('canvasContext:', this.canvasContext);
        console.log('intervalCanvasContext:', this.intervalCanvasContext);
        console.log('triadCanvasContext:', this.triadCanvasContext);
        console.log('quadCanvasContext:', this.quadCanvasContext);
    }
    
    initializeUI() {
        // High-DPI Canvas Setup - Retina Display Support
        this.setupHighResCanvas(this.canvas);
        this.setupHighResCanvas(this.intervalCanvas);
        this.setupHighResCanvas(this.triadCanvas);
        this.setupHighResCanvas(this.quadCanvas);
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Single note tab buttons
        document.getElementById('playBtn').addEventListener('click', () => this.playRandomNote());
        document.getElementById('replayBtn').addEventListener('click', () => this.replayNote());
        document.getElementById('startListenBtn').addEventListener('click', () => this.startListening());
        document.getElementById('stopListenBtn').addEventListener('click', () => this.stopListening());
        
        // Interval tab buttons
        const playIntervalBtn = document.getElementById('playIntervalBtn');
        if (playIntervalBtn) {
            playIntervalBtn.addEventListener('click', () => {
                this.playRandomInterval();
            });
        }
        
        document.getElementById('replayIntervalBtn').addEventListener('click', () => this.replayInterval());
        document.getElementById('playSequentialBtn').addEventListener('click', () => this.playSequential());
        document.getElementById('startIntervalListenBtn').addEventListener('click', () => this.startIntervalListening());
        document.getElementById('stopIntervalListenBtn').addEventListener('click', () => this.stopIntervalListening());
        
        // Triad tab buttons
        document.getElementById('playTriadBtn').addEventListener('click', () => this.playRandomTriad());
        document.getElementById('replayTriadBtn').addEventListener('click', () => this.replayTriad());
        document.getElementById('playTriadSequentialBtn').addEventListener('click', () => this.playTriadSequential());
        document.getElementById('startTriadListenBtn').addEventListener('click', () => this.startTriadListening());
        document.getElementById('stopTriadListenBtn').addEventListener('click', () => this.stopTriadListening());
        
        // Quad tab buttons
        document.getElementById('playQuadBtn').addEventListener('click', () => this.playRandomQuad());
        document.getElementById('replayQuadBtn').addEventListener('click', () => this.replayQuad());
        document.getElementById('playQuadSequentialBtn').addEventListener('click', () => this.playQuadSequential());
        document.getElementById('startQuadListenBtn').addEventListener('click', () => this.startQuadListening());
        document.getElementById('stopQuadListenBtn').addEventListener('click', () => this.stopQuadListening());
        
        // Echo tab buttons (removed - empty tab)
        
        // Initialize canvas
        this.drawPitchMeter();
        this.drawIntervalPitchMeter();
        this.drawTriadPitchMeter();
        this.drawQuadPitchMeter();
        
        // Start continuous tuner updates
        this.startTunerLoop();
    }
    
    setupHighResCanvas(canvas) {
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        // Get device pixel ratio (1 for normal, 2 for retina, etc.)
        const dpr = window.devicePixelRatio || 1;
        
        // Get CSS size - wait for layout
        const rect = canvas.getBoundingClientRect();
        
        // Standard size for all tuners - consistent ratio (compact)
        let width = 700;  // Max width
        let height = 240; // Compact height
        
        // If container is smaller, scale down proportionally
        if (rect.width > 0 && rect.width < width) {
            const scale = rect.width / width;
            width = rect.width;
            height = Math.round(240 * scale);
        }
        
        // Set actual size in memory (scaled for high-DPI)
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        // Ensure canvas CSS size is set
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        // Get context and scale it
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        console.log(`Canvas ${canvas.id} resolution: ${canvas.width}x${canvas.height} (${width}x${height} CSS, DPR: ${dpr})`);
    }
    
    startTunerLoop() {
        console.log('Starting tuner loop...');
        
        const updateTuners = () => {
            console.log('Tuner loop update - isListening:', this.isListening, 'targetFreq:', this.targetFrequency);
            
            // Always update tuners when not listening (listening has its own loop)
            if (!this.isListening) {
                console.log('Updating pitch meter...');
                this.drawPitchMeter();
            }
            if (!this.intervalListening) {
                this.drawIntervalPitchMeter();
            }
            if (!this.triadListening) {
                this.drawTriadPitchMeter();
            }
            if (!this.quadListening) {
                this.drawQuadPitchMeter();
            }
            
            requestAnimationFrame(updateTuners);
        };
        
        updateTuners();
    }
    
    switchTab(tabName) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }
    
    playRandomNote() {
        // Select random note
        const randomIndex = Math.floor(Math.random() * this.notes.length);
        const note = this.notes[randomIndex];
        
        this.targetNote = note.name;
        this.targetFrequency = note.frequency;
        
        // Reset answer state
        this.hasAnswered = false;
        this.stableDetectionCount = 0;
        this.lastStableFrequency = 0;
        this.smoothedFrequency = 0;
        this.wrongNoteStableCount = 0;  // Track stable wrong notes
        
        // AI: Start performance timing
        this.attemptStartTime = Date.now();
        this.currentConfidence = 0;
        
        // Update UI
        document.getElementById('targetNote').textContent = note.name;
        document.getElementById('targetFreq').textContent = note.frequency.toFixed(2) + ' Hz';
        document.getElementById('detectedNote').textContent = '-';
        document.getElementById('detectedFreq').textContent = '-';
        document.getElementById('difference').textContent = '-';
        
        // Enable replay button
        document.getElementById('replayBtn').disabled = false;
        
        // Update tuner
        this.drawPitchMeter();
        
        // Play the note
        this.playTone(note.frequency, 3.0);
    }
    
    async playPianoTones() {
        // Tüm piyano notalarını sırayla çal (A3'ten E5'e)
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            
            // UI'yi güncelle
            document.getElementById('targetNote').textContent = note.name;
            document.getElementById('targetFreq').textContent = note.frequency.toFixed(2) + ' Hz';
            
            // Notayı çal (kısa süre - 0.8 saniye)
            this.playTone(note.frequency, 0.8);
            
            // Sonraki notadan önce bekle (1 saniye)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    replayNote() {
        if (!this.targetFrequency) {
            alert('Önce bir nota çalın');
            return;
        }
        
        // Reset answer state
        this.hasAnswered = false;
        this.stableDetectionCount = 0;
        this.lastStableFrequency = 0;
        this.smoothedFrequency = 0;
        this.wrongNoteStableCount = 0;
        
        // Reset detected values
        document.getElementById('detectedNote').textContent = '-';
        document.getElementById('detectedFreq').textContent = '-';
        document.getElementById('difference').textContent = '-';
        
        // Update tuner
        this.drawPitchMeter();
        
        // Play the same note again
        this.playTone(this.targetFrequency, 3.0);
    }
    
    async playTone(frequency, duration) {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            const now = this.audioContext.currentTime;
            
            // Simple, clean harmonics (like two-tone mode)
            const harmonics = [
                { mult: 1.0, gain: 1.0 },
                { mult: 2.0, gain: 0.5 },
                { mult: 3.0, gain: 0.3 },
                { mult: 4.0, gain: 0.2 }
            ];
            
            const masterGain = this.audioContext.createGain();
            masterGain.connect(this.audioContext.destination);
            
            // Simple, clean ADSR envelope
            masterGain.gain.setValueAtTime(0, now);
            masterGain.gain.linearRampToValueAtTime(0.3, now + 0.005);
            masterGain.gain.exponentialRampToValueAtTime(0.22, now + 0.08);
            masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            // Create harmonics
            harmonics.forEach(h => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                const stretch = 1 + Math.pow(h.mult, 2) * 0.0002 * (frequency / 440);
                osc.frequency.value = frequency * h.mult * stretch;
                osc.type = 'sine';
                gain.gain.value = h.gain;
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + duration + 0.1);
            });
            
        } catch (error) {
            console.error('Error in playTone:', error);
            alert('Ses çalma hatası: ' + error.message);
        }
    }
    
    async startListening() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 4096; // Optimized FFT size for performance
            this.analyser.smoothingTimeConstant = 0.98; // MAXIMUM smoothing
            
            this.microphone.connect(this.analyser);
            
            this.isListening = true;
            
            // Update UI
            document.getElementById('startListenBtn').disabled = true;
            document.getElementById('stopListenBtn').disabled = false;
            
            // Start pitch detection
            this.detectPitch();
            
        } catch (error) {
            alert('Mikrofon erişimi reddedildi veya hata oluştu: ' + error.message);
            console.error('Microphone error:', error);
        }
    }
    
    stopListening() {
        this.isListening = false;
        
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone.mediaStream.getTracks().forEach(track => track.stop());
        }
        
        if (this.analyser) {
            this.analyser.disconnect();
        }
        
        // Update UI
        document.getElementById('startListenBtn').disabled = false;
        document.getElementById('stopListenBtn').disabled = true;
        
        // Clear detection display
        document.getElementById('detectedNote').textContent = '-';
        document.getElementById('detectedFreq').textContent = '-';
        document.getElementById('difference').textContent = '-';
        
        this.drawPitchMeter();
    }
    
    detectPitch() {
        if (!this.isListening) return;
        
        const bufferLength = this.analyser.fftSize;
        const buffer = new Float32Array(bufferLength);
        this.analyser.getFloatTimeDomainData(buffer);
        
        // Optimized autocorrelation for best performance
        const frequency = this.autoCorrelate(buffer, this.audioContext.sampleRate);
        
        // Human voice range: 60 Hz (very low male bass) to 1100 Hz (female soprano)
        // Extended to 60 Hz to support 2 octaves down from B3 (B1 = 61.74 Hz)
        if (frequency > 0 && frequency >= 60 && frequency <= 1100) {
            // ULTRA AGGRESSIVE SMOOTHING - neredeyse hiç hareket etmez
            if (this.smoothedFrequency === 0) {
                this.smoothedFrequency = frequency;
            } else {
                // 99.8% eski, 0.2% yeni - EXTREME smoothing
                this.smoothedFrequency = this.smoothedFrequency * 0.998 + frequency * 0.002;
            }
            
            this.detectedFrequency = this.smoothedFrequency;
            this.detectedNote = this.frequencyToNote(this.smoothedFrequency);
            
            // Update UI (throttled to once every 2 seconds - ULTRA STABLE)
            const now = Date.now();
            if (now - this.lastUpdateTime > 2000) {
                document.getElementById('detectedNote').textContent = this.detectedNote;
                document.getElementById('detectedFreq').textContent = this.smoothedFrequency.toFixed(2) + ' Hz';
                this.lastUpdateTime = now;
            }
            
            if (this.targetFrequency && !this.hasAnswered) {
                // Check octaves: -2, -1, 0 (only lower octaves for male voices)
                const octaves = [
                    { freq: this.targetFrequency / 4, label: ' (2 oktav alt)' },
                    { freq: this.targetFrequency / 2, label: ' (1 oktav alt)' },
                    { freq: this.targetFrequency, label: '' }
                ];
                
                // Find the closest octave
                let minDiff = Infinity;
                let bestOctave = octaves[2];
                
                for (let octave of octaves) {
                    const diff = Math.abs(this.smoothedFrequency - octave.freq);
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestOctave = octave;
                    }
                }
                
                document.getElementById('difference').textContent = minDiff.toFixed(2) + ' Hz' + bestOctave.label;
                
                // Check if frequency is stable (similar to last reading - EXTREME lenient)
                const freqDiff = Math.abs(this.smoothedFrequency - this.lastStableFrequency);
                
                if (freqDiff < 25) {
                    // Frequency is stable, increment counter
                    this.stableDetectionCount++;
                } else {
                    // Frequency changed, reset counter
                    this.stableDetectionCount = 1;
                }
                
                this.lastStableFrequency = this.smoothedFrequency;
                
                // AI: Calculate confidence score
                this.currentConfidence = this.ai.calculateNoteConfidence(
                    this.smoothedFrequency,
                    this.detectedNote,
                    bestOctave.freq,
                    this.stableDetectionCount
                );
                
                // AI: Use adaptive thresholds
                const aiThreshold = this.ai.adaptiveThresholds.frequency;
                const aiConfidenceThreshold = this.ai.adaptiveThresholds.confidence;
                
                // Check if note is stable (detected 60 times in a row - about 2 seconds)
                if (this.stableDetectionCount >= 60 && !this.hasAnswered && this.currentConfidence >= aiConfidenceThreshold) {
                    // Check if frequency difference is within AI adaptive tolerance
                    console.log('AI Check - Confidence:', this.currentConfidence.toFixed(2), 'minDiff:', minDiff, 'Hz, Target:', this.targetNote, 'Detected:', this.detectedNote);
                    if (minDiff < aiThreshold) {
                        console.log('✓ Correct! AI Confidence:', this.currentConfidence.toFixed(2));
                        this.showResult(true, minDiff);
                    } else {
                        console.log('✗ Wrong! AI Confidence:', this.currentConfidence.toFixed(2));
                        this.showResult(false, minDiff);
                    }
                } else if (this.stableDetectionCount >= 60 && minDiff >= aiThreshold && !this.hasAnswered) {
                    // User is singing a stable wrong note
                    this.wrongNoteStableCount++;
                    if (this.wrongNoteStableCount >= 30) {  // About 1 more second of wrong note
                        console.log('✗ Wrong note held too long:', minDiff);
                        this.showResult(false, minDiff);
                    }
                } else {
                    this.wrongNoteStableCount = 0;
                }
            }
            
            // Draw pitch meter only when sound detected
            this.drawPitchMeter(this.smoothedFrequency);
        } else {
            // Reset counter and frequency if no valid sound detected
            // This makes tuner stop immediately when you stop singing
            this.stableDetectionCount = 0;
            this.lastStableFrequency = 0;
            this.smoothedFrequency = 0;
            
            // Clear display when no voice detected
            document.getElementById('detectedNote').textContent = '-';
            document.getElementById('detectedFreq').textContent = '-';
        }
        
        // Continue detection
        requestAnimationFrame(() => this.detectPitch());
    }
    
    // AI-Enhanced Frequency Processing
    aiProcessFrequency(rawFrequency) {
        // Step 1: Add to history
        this.frequencyHistory.push(rawFrequency);
        if (this.frequencyHistory.length > this.maxHistoryLength) {
            this.frequencyHistory.shift();
        }
        
        // Step 2: Outlier detection - remove anomalies
        if (this.frequencyHistory.length >= 3) {
            const median = this.getMedianFrequency();
            const deviation = Math.abs(rawFrequency - median);
            
            // If new measurement is too far from median, reject it
            if (deviation > 30 && this.frequencyHistory.length >= 5) {
                console.log('AI: Outlier rejected', rawFrequency, 'median:', median);
                return this.kalmanEstimate || median;
            }
        }
        
        // Step 3: Kalman Filter for optimal estimation
        const filteredFreq = this.kalmanFilter(rawFrequency);
        
        // Step 4: Additional smoothing with median
        if (this.frequencyHistory.length >= 5) {
            const median = this.getMedianFrequency();
            // Blend Kalman with median for ultra stability
            return filteredFreq * 0.7 + median * 0.3;
        }
        
        return filteredFreq;
    }
    
    // Kalman Filter - optimal recursive estimator
    kalmanFilter(measurement) {
        if (this.kalmanEstimate === 0) {
            this.kalmanEstimate = measurement;
            return measurement;
        }
        
        // Prediction
        const predictedEstimate = this.kalmanEstimate;
        const predictedError = this.kalmanErrorEstimate + this.kalmanQ;
        
        // Update
        const kalmanGain = predictedError / (predictedError + this.kalmanR);
        this.kalmanEstimate = predictedEstimate + kalmanGain * (measurement - predictedEstimate);
        this.kalmanErrorEstimate = (1 - kalmanGain) * predictedError;
        
        return this.kalmanEstimate;
    }
    
    // Get median frequency from history - robust against outliers
    getMedianFrequency() {
        if (this.frequencyHistory.length === 0) return 0;
        
        const sorted = [...this.frequencyHistory].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }
    
    // Reset AI filters
    resetAIFilters() {
        this.frequencyHistory = [];
        this.kalmanEstimate = 0;
        this.kalmanErrorEstimate = 1;
    }
    
    autoCorrelate(buffer, sampleRate) {
        // Improved autocorrelation algorithm with better accuracy
        let size = buffer.length;
        let rms = 0;
        
        // Calculate RMS for volume detection
        for (let i = 0; i < size; i++) {
            rms += buffer[i] * buffer[i];
        }
        rms = Math.sqrt(rms / size);
        
        // HIGH noise gate - only clear strong voice
        if (rms < 0.1) return -1;
        
        // Normalize the buffer
        let normalizedBuffer = new Float32Array(size);
        for (let i = 0; i < size; i++) {
            normalizedBuffer[i] = buffer[i] / rms;
        }
        
        // Calculate autocorrelation
        let maxSamples = Math.floor(size / 2);
        let minSamples = Math.floor(sampleRate / 1100); // Minimum for 1100 Hz
        let maxSamplesForFreq = Math.floor(sampleRate / 60); // Maximum for 60 Hz
        
        let bestOffset = -1;
        let bestCorrelation = 0;
        
        // Single pass: find best correlation (optimized for performance)
        for (let offset = minSamples; offset < Math.min(maxSamplesForFreq, maxSamples); offset++) {
            let correlation = 0;
            
            for (let i = 0; i < maxSamples; i++) {
                correlation += normalizedBuffer[i] * normalizedBuffer[i + offset];
            }
            
            correlation = correlation / maxSamples;
            
            if (correlation > bestCorrelation) {
                bestCorrelation = correlation;
                bestOffset = offset;
            }
        }
        
        // HIGH correlation threshold - only very clear signals
        if (bestCorrelation < 0.75 || bestOffset === -1) {
            return -1;
        }
        
        let refinedOffset = bestOffset;
        
        // Parabolic interpolation for sub-sample accuracy
        if (refinedOffset > 0 && refinedOffset < maxSamples - 1) {
            let y1 = 0, y2 = 0, y3 = 0;
            
            for (let i = 0; i < maxSamples; i++) {
                y1 += normalizedBuffer[i] * normalizedBuffer[i + refinedOffset - 1];
                y2 += normalizedBuffer[i] * normalizedBuffer[i + refinedOffset];
                y3 += normalizedBuffer[i] * normalizedBuffer[i + refinedOffset + 1];
            }
            
            y1 /= maxSamples;
            y2 /= maxSamples;
            y3 /= maxSamples;
            
            let a = (y1 + y3 - 2 * y2) / 2;
            let b = (y3 - y1) / 2;
            
            if (a !== 0) {
                let shift = -b / (2 * a);
                if (Math.abs(shift) < 1) {
                    refinedOffset += shift;
                }
            }
        }
        
        return sampleRate / refinedOffset;
    }
    
    // Advanced YIN Algorithm for superior pitch detection
    yinPitchDetection(buffer, sampleRate) {
        const bufferSize = buffer.length;
        const threshold = 0.1;
        const yinBuffer = new Float32Array(bufferSize / 2);
        
        // Step 1: Calculate difference function
        yinBuffer[0] = 1;
        for (let tau = 1; tau < bufferSize / 2; tau++) {
            let sum = 0;
            for (let i = 0; i < bufferSize / 2; i++) {
                const delta = buffer[i] - buffer[i + tau];
                sum += delta * delta;
            }
            yinBuffer[tau] = sum;
        }
        
        // Step 2: Cumulative mean normalized difference
        let runningSum = 0;
        yinBuffer[0] = 1;
        for (let tau = 1; tau < bufferSize / 2; tau++) {
            runningSum += yinBuffer[tau];
            yinBuffer[tau] *= tau / runningSum;
        }
        
        // Step 3: Absolute threshold
        let tau = -1;
        for (let i = 2; i < bufferSize / 2; i++) {
            if (yinBuffer[i] < threshold) {
                while (i + 1 < bufferSize / 2 && yinBuffer[i + 1] < yinBuffer[i]) {
                    i++;
                }
                tau = i;
                break;
            }
        }
        
        if (tau === -1) return -1;
        
        // Step 4: Parabolic interpolation
        let betterTau;
        if (tau < 1 || tau >= bufferSize / 2 - 1) {
            betterTau = tau;
        } else {
            const s0 = yinBuffer[tau - 1];
            const s1 = yinBuffer[tau];
            const s2 = yinBuffer[tau + 1];
            betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
        }
        
        return sampleRate / betterTau;
    }
    
    // Harmonic Product Spectrum for robust fundamental frequency detection
    harmonicProductSpectrum(buffer, sampleRate) {
        const bufferSize = buffer.length;
        const fftSize = Math.pow(2, Math.ceil(Math.log2(bufferSize)));
        
        // Simple FFT magnitude spectrum
        const spectrum = new Float32Array(fftSize / 2);
        
        // Calculate power spectrum
        for (let k = 0; k < fftSize / 2; k++) {
            let real = 0;
            let imag = 0;
            for (let n = 0; n < bufferSize; n++) {
                const angle = -2 * Math.PI * k * n / fftSize;
                real += buffer[n] * Math.cos(angle);
                imag += buffer[n] * Math.sin(angle);
            }
            spectrum[k] = Math.sqrt(real * real + imag * imag);
        }
        
        // Harmonic Product Spectrum
        const hps = new Float32Array(fftSize / 8);
        const numHarmonics = 5;
        
        for (let i = 0; i < hps.length; i++) {
            hps[i] = 1;
            for (let h = 1; h <= numHarmonics; h++) {
                const index = Math.floor(i * h);
                if (index < spectrum.length) {
                    hps[i] *= spectrum[index];
                }
            }
        }
        
        // Find peak in HPS
        let maxIndex = 0;
        let maxValue = 0;
        const minIndex = Math.floor(60 * fftSize / sampleRate);
        const maxIndexLimit = Math.floor(1100 * fftSize / sampleRate);
        
        for (let i = minIndex; i < Math.min(maxIndexLimit, hps.length); i++) {
            if (hps[i] > maxValue) {
                maxValue = hps[i];
                maxIndex = i;
            }
        }
        
        if (maxIndex === 0) return -1;
        
        const frequency = maxIndex * sampleRate / fftSize;
        return frequency;
    }
    
    // Advanced hybrid pitch detection combining multiple algorithms
    advancedPitchDetection(buffer, sampleRate) {
        // Use multiple algorithms for best accuracy
        const autocorrFreq = this.autoCorrelate(buffer, sampleRate);
        const yinFreq = this.yinPitchDetection(buffer, sampleRate);
        const hpsFreq = this.harmonicProductSpectrum(buffer, sampleRate);
        
        // Collect valid frequencies
        const validFreqs = [];
        if (autocorrFreq > 0 && autocorrFreq >= 60 && autocorrFreq <= 1100) {
            validFreqs.push({freq: autocorrFreq, weight: 1.0});
        }
        if (yinFreq > 0 && yinFreq >= 60 && yinFreq <= 1100) {
            validFreqs.push({freq: yinFreq, weight: 1.2}); // YIN is usually more accurate
        }
        if (hpsFreq > 0 && hpsFreq >= 60 && hpsFreq <= 1100) {
            validFreqs.push({freq: hpsFreq, weight: 0.8});
        }
        
        if (validFreqs.length === 0) return -1;
        
        // If all algorithms agree (within 5%), return average
        if (validFreqs.length >= 2) {
            const avgFreq = validFreqs.reduce((sum, f) => sum + f.freq, 0) / validFreqs.length;
            const allClose = validFreqs.every(f => Math.abs(f.freq - avgFreq) / avgFreq < 0.05);
            
            if (allClose) {
                // Weighted average
                const totalWeight = validFreqs.reduce((sum, f) => sum + f.weight, 0);
                const weightedSum = validFreqs.reduce((sum, f) => sum + f.freq * f.weight, 0);
                return weightedSum / totalWeight;
            }
        }
        
        // Return the most confident result (prefer YIN)
        return validFreqs.sort((a, b) => b.weight - a.weight)[0].freq;
    }
    
    frequencyToNote(frequency) {
        // Extended note list including octaves below (for male voices)
        const allNotes = [
            // Octave 2
            { name: 'A2', frequency: 110.00 },
            { name: 'A#2', frequency: 116.54 },
            { name: 'B2', frequency: 123.47 },
            // Octave 3
            { name: 'C3', frequency: 130.81 },
            { name: 'C#3', frequency: 138.59 },
            { name: 'D3', frequency: 146.83 },
            { name: 'D#3', frequency: 155.56 },
            { name: 'E3', frequency: 164.81 },
            { name: 'F3', frequency: 174.61 },
            { name: 'F#3', frequency: 185.00 },
            { name: 'G3', frequency: 196.00 },
            { name: 'G#3', frequency: 207.65 },
            { name: 'A3', frequency: 220.00 },
            { name: 'A#3', frequency: 233.08 },
            { name: 'B3', frequency: 246.94 },
            // Octave 4
            { name: 'C4', frequency: 261.63 },
            { name: 'C#4', frequency: 277.18 },
            { name: 'D4', frequency: 293.66 },
            { name: 'D#4', frequency: 311.13 },
            { name: 'E4', frequency: 329.63 },
            { name: 'F4', frequency: 349.23 },
            { name: 'F#4', frequency: 369.99 },
            { name: 'G4', frequency: 392.00 },
            { name: 'G#4', frequency: 415.30 },
            { name: 'A4', frequency: 440.00 },
            { name: 'A#4', frequency: 466.16 },
            { name: 'B4', frequency: 493.88 },
            // Octave 5
            { name: 'C5', frequency: 523.25 },
            { name: 'C#5', frequency: 554.37 },
            { name: 'D5', frequency: 587.33 },
            { name: 'D#5', frequency: 622.25 },
            { name: 'E5', frequency: 659.25 },
            { name: 'F5', frequency: 698.46 },
            { name: 'F#5', frequency: 739.99 },
            { name: 'G5', frequency: 783.99 }
        ];
        
        // Find closest note from extended list
        let closestNote = allNotes[0];
        let minDiff = Math.abs(frequency - closestNote.frequency);
        
        for (let note of allNotes) {
            const diff = Math.abs(frequency - note.frequency);
            if (diff < minDiff) {
                minDiff = diff;
                closestNote = note;
            }
        }
        
        return closestNote.name;
    }
    
    showResult(isCorrect, accuracy = 0) {
        console.log('showResult called:', isCorrect, 'Accuracy:', accuracy, 'Confidence:', this.currentConfidence);
        
        if (isCorrect) {
            this.correctCount++;
            console.log('Correct count:', this.correctCount);
        } else {
            this.wrongCount++;
            console.log('Wrong count:', this.wrongCount);
        }
        
        this.totalCount++;
        console.log('Total count:', this.totalCount);
        
        // AI: Track performance
        const timeTaken = (Date.now() - this.attemptStartTime) / 1000;
        this.ai.addPerformance(this.targetNote, isCorrect, accuracy, timeTaken);
        
        // AI: Generate intelligent feedback
        const feedback = this.ai.generateFeedback(this.currentConfidence, accuracy, this.targetNote);
        console.log('🤖 AI Feedback:', feedback.message, '-', feedback.suggestion);
        
        // AI: Adapt thresholds based on performance
        this.ai.adaptThresholds();
        
        // Reset target after showing result
        this.hasAnswered = true;
        this.stableDetectionCount = 0;
        this.lastStableFrequency = 0;
        this.smoothedFrequency = 0;
        
        setTimeout(() => {
            this.targetNote = null;
            this.totalCount = 0;
        }, 2000);
    }
    
    updateScoreDisplay() {
        // Score display removed as requested
    }
    
    updateIntervalScoreDisplay() {
        // Score display removed as requested
    }
    
    updateTriadScoreDisplay() {
        // Score display removed as requested
    }
    
    updateQuadScoreDisplay() {
        // Score display removed as requested
    }
    
    drawPitchMeter(currentFreq = null) {
        console.log('drawPitchMeter called with:', currentFreq, 'targetFreq:', this.targetFrequency, 'canvas:', this.canvas, 'ctx:', this.canvasContext);
        
        if (!this.canvas || !this.canvasContext) {
            console.error('Canvas or context not initialized!');
            return;
        }
        
        const ctx = this.canvasContext;
        // Use CSS dimensions for drawing (scaling is already applied)
        const width = this.canvas.getBoundingClientRect().width;
        const height = this.canvas.getBoundingClientRect().height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Modern gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#667eea');
        bgGradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        
        if (!this.targetFrequency) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎵 Bir nota çalın', centerX, 60);
            
            // Draw empty tuner bar
            const barWidth = width * 0.7;
            const barHeight = 40;
            const barX = (width - barWidth) / 2;
            const barY = centerY;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.roundRect(barX, barY, barWidth, barHeight, 20);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(centerX - 2, barY - 10, 4, barHeight + 20);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Tuner hazır', centerX, height - 30);
            console.log('Drew "Bir nota çalın" state');
            return;
        }
        
        // Calculate difference for octaves: -2, -1, 0 (only lower for male voices)
        let diff = 0;
        let octaveLabel = '';
        let hasValidFrequency = false;
        
        if (currentFreq && currentFreq > 0) {
            const octaves = [
                { freq: this.targetFrequency / 4, label: ' ↓↓', diff: currentFreq - this.targetFrequency / 4 },
                { freq: this.targetFrequency / 2, label: ' ↓', diff: currentFreq - this.targetFrequency / 2 },
                { freq: this.targetFrequency, label: '', diff: currentFreq - this.targetFrequency }
            ];
            
            // Find closest octave
            let minAbsDiff = Infinity;
            for (let octave of octaves) {
                const absDiff = Math.abs(octave.diff);
                if (absDiff < minAbsDiff) {
                    minAbsDiff = absDiff;
                    diff = octave.diff;
                    octaveLabel = octave.label;
                }
            }
            hasValidFrequency = true;
        }
        
        // Draw target note at top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.targetNote, centerX, 60);
        
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
        
        // Draw tick marks
        const numTicks = 11;
        for (let i = 0; i < numTicks; i++) {
            const x = barX + (barWidth / (numTicks - 1)) * i;
            const isCenterTick = i === Math.floor(numTicks / 2);
            
            ctx.fillStyle = isCenterTick ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(x - 1, barY - 5, 2, barHeight + 10);
        }
        
        // Center target line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(centerX - 2, barY - 10, 4, barHeight + 20);
        
        // Only show active feedback when sound is detected
        if (hasValidFrequency) {
            const clampedDiff = Math.max(-50, Math.min(50, diff));
            const position = centerX + (clampedDiff / 50) * (barWidth / 2);
            
            // Determine color based on accuracy
            const accuracy = Math.abs(diff);
            let indicatorColor;
            if (accuracy < 5) {
                indicatorColor = '#11998e'; // Green - Perfect
            } else if (accuracy < 10) {
                indicatorColor = '#27ae60'; // Darker green - Very good
            } else if (accuracy < 15) {
                indicatorColor = '#f39c12'; // Orange - Good
            } else {
                indicatorColor = '#eb3349'; // Red - Too far
            }
            
            // Draw glowing circle indicator
            ctx.shadowBlur = 20;
            ctx.shadowColor = indicatorColor;
            ctx.fillStyle = indicatorColor;
            ctx.beginPath();
            ctx.arc(position, barY + barHeight / 2, 18, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Inner white circle
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(position, barY + barHeight / 2, 12, 0, 2 * Math.PI);
            ctx.fill();
            
            // Detected note below
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.detectedNote + octaveLabel, centerX, centerY + 80);
            
            // Difference text
            ctx.font = '18px Arial';
            const diffText = diff > 0 ? `+${diff.toFixed(1)} Hz` : `${diff.toFixed(1)} Hz`;
            ctx.fillStyle = indicatorColor;
            ctx.fillText(diffText, centerX, centerY + 110);
            
            // Status text
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            let statusText = '';
            if (accuracy < 5) {
                statusText = '✓ Mükemmel!';
            } else if (accuracy < 10) {
                statusText = '✓ Çok İyi!';
            } else if (accuracy < 15) {
                statusText = '~ İyi';
            } else if (diff > 0) {
                statusText = '↑ Çok Yüksek';
            } else {
                statusText = '↓ Çok Alçak';
            }
            ctx.fillText(statusText, centerX, centerY + 135);
        } else if (this.isListening) {
            // No sound detected during listening - show minimal feedback
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎙️ Ses bekleniyor...', centerX, centerY + 80);
        }
        
        // Draw scale labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Alçak', barX, barY - 15);
        ctx.textAlign = 'right';
        ctx.fillText('Yüksek', barX + barWidth, barY - 15);
    }
    
    playRandomInterval() {
        
        // Select two random notes with max interval of 11 semitones (Major 7th)
        const index1 = Math.floor(Math.random() * this.notes.length);
        let index2 = Math.floor(Math.random() * this.notes.length);
        
        // Ensure second note is different, higher, and max 11 semitones apart
        while (index2 <= index1 || (index2 - index1) > 11) {
            index2 = Math.floor(Math.random() * this.notes.length);
        }
        
        const note1 = this.notes[index1];
        const note2 = this.notes[index2];
        
        // Store target notes
        this.targetNote1 = note1.name;
        this.targetNote2 = note2.name;
        this.targetFreq1 = note1.frequency;
        this.targetFreq2 = note2.frequency;
        this.detectedNotes.clear();
        
        // Calculate interval
        const semitones = index2 - index1;
        const intervalNames = {
            1: 'Küçük İkili',
            2: 'Büyük İkili',
            3: 'Küçük Üçlü',
            4: 'Büyük Üçlü',
            5: 'Dörtlü',
            6: 'Artık Dörtlü',
            7: 'Beşli',
            8: 'Küçük Altılı',
            9: 'Büyük Altılı',
            10: 'Küçük Yedili',
            11: 'Büyük Yedili'
        };
        
        const intervalName = intervalNames[semitones] || `${semitones} yarım ton`;
        
        // Update UI
        document.getElementById('intervalNote1').textContent = note1.name;
        document.getElementById('intervalNote2').textContent = note2.name;
        document.getElementById('intervalName').textContent = intervalName;
        
        // Enable replay button
        document.getElementById('replayIntervalBtn').disabled = false;
        
        // Update tuner
        this.drawIntervalPitchMeter();
        
        // Play both notes simultaneously
        this.playTwoTones(note1.frequency, note2.frequency, 3.0);
    }
    
    replayInterval() {
        if (!this.targetFreq1 || !this.targetFreq2) {
            alert('Önce iki ses çalın');
            return;
        }
        
        // Reset detected notes and stable tracking
        this.detectedNotes.clear();
        this.intervalStableNote = null;
        this.intervalStableCount = 0;
        
        // Update tuner
        this.drawIntervalPitchMeter();
        
        // Play the same two notes again
        this.playTwoTones(this.targetFreq1, this.targetFreq2, 3.0);
    }
    
    async playTwoTones(freq1, freq2, duration) {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            const now = this.audioContext.currentTime;
            
            // Premium harmonics for clarity
            const harmonics = [
                { mult: 1.0, gain: 1.0 },
                { mult: 2.0, gain: 0.5 },
                { mult: 3.0, gain: 0.3 },
                { mult: 4.0, gain: 0.2 }
            ];
            
            // Create stereo panners for separation
            const panner1 = this.audioContext.createStereoPanner();
            const panner2 = this.audioContext.createStereoPanner();
            panner1.pan.value = -0.5; // Sol kanal (alt nota)
            panner2.pan.value = 0.5;  // Sağ kanal (üst nota)
            
            // Master gains for each note
            const masterGain1 = this.audioContext.createGain();
            const masterGain2 = this.audioContext.createGain();
            
            // Connect: gain → panner → destination
            masterGain1.connect(panner1);
            masterGain2.connect(panner2);
            panner1.connect(this.audioContext.destination);
            panner2.connect(this.audioContext.destination);
            
            // ADSR envelope
            masterGain1.gain.setValueAtTime(0, now);
            masterGain1.gain.linearRampToValueAtTime(0.25, now + 0.005);
            masterGain1.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
            masterGain1.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            masterGain2.gain.setValueAtTime(0, now);
            masterGain2.gain.linearRampToValueAtTime(0.25, now + 0.005);
            masterGain2.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
            masterGain2.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            // Create harmonics for note 1
            harmonics.forEach(h => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                const stretch = 1 + Math.pow(h.mult, 2) * 0.0002 * (freq1 / 440);
                osc.frequency.value = freq1 * h.mult * stretch;
                osc.type = 'sine';
                gain.gain.value = h.gain;
                osc.connect(gain);
                gain.connect(masterGain1);
                osc.start(now);
                osc.stop(now + duration + 0.1);
            });
            
            // Create harmonics for note 2
            harmonics.forEach(h => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                const stretch = 1 + Math.pow(h.mult, 2) * 0.0002 * (freq2 / 440);
                osc.frequency.value = freq2 * h.mult * stretch;
                osc.type = 'sine';
                gain.gain.value = h.gain;
                osc.connect(gain);
                gain.connect(masterGain2);
                osc.start(now);
                osc.stop(now + duration + 0.1);
            });
            
        } catch (error) {
            console.error('Error in playTwoTones:', error);
        }
    }
    
    async playSequential() {
        if (!this.targetFreq1 || !this.targetFreq2) {
            alert('Önce "Rastgele İki Ses" butonuna basın');
            return;
        }
        
        // Play sequentially
        this.playTone(this.targetFreq1, 1);
        await new Promise(resolve => setTimeout(resolve, 1200));
        this.playTone(this.targetFreq2, 1);
    }
    
    async startIntervalListening() {
        if (!this.targetNote1 || !this.targetNote2) {
            alert('Önce "Rastgele İki Ses Çal" butonuna basın');
            return;
        }
        
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
            
            this.intervalListening = true;
            this.detectedNotes.clear();
            
            document.getElementById('startIntervalListenBtn').disabled = true;
            document.getElementById('stopIntervalListenBtn').disabled = false;
            
            this.detectIntervalPitch();
            
        } catch (error) {
            alert('Mikrofon erişimi reddedildi: ' + error.message);
        }
    }
    
    stopIntervalListening() {
        this.intervalListening = false;
        
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone.mediaStream.getTracks().forEach(track => track.stop());
        }
        
        if (this.analyser) {
            this.analyser.disconnect();
        }
        
        document.getElementById('startIntervalListenBtn').disabled = false;
        document.getElementById('stopIntervalListenBtn').disabled = true;
        
        this.detectedNotes.clear();
    }
    
    detectIntervalPitch() {
        if (!this.intervalListening) return;
        
        const bufferLength = this.analyser.fftSize;
        const buffer = new Float32Array(bufferLength);
        this.analyser.getFloatTimeDomainData(buffer);
        
        // Optimized autocorrelation for best performance
        const frequency = this.autoCorrelate(buffer, this.audioContext.sampleRate);
        
        if (frequency > 0 && frequency >= 60 && frequency <= 1100) {
            const detectedNote = this.frequencyToNote(frequency);
            
            this.drawIntervalPitchMeter(frequency, detectedNote);
            
            const octaves1 = [
                this.targetFreq1 / 4,
                this.targetFreq1 / 2,
                this.targetFreq1
            ];
            
            const octaves2 = [
                this.targetFreq2 / 4,
                this.targetFreq2 / 2,
                this.targetFreq2
            ];
            
            // Find minimum difference for each target note
            let minDiff1 = Infinity;
            for (let octave of octaves1) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff1) minDiff1 = diff;
            }
            
            let minDiff2 = Infinity;
            for (let octave of octaves2) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff2) minDiff2 = diff;
            }
            
            // Only add note if it's held stable for at least 30 frames (~1 second)
            if (!this.intervalStableNote) {
                this.intervalStableNote = null;
                this.intervalStableCount = 0;
            }
            
            // Determine which note is being sung
            let currentNote = null;
            if (minDiff1 < 25 && minDiff1 < minDiff2) {
                currentNote = this.targetNote1;
            } else if (minDiff2 < 25 && minDiff2 < minDiff1) {
                currentNote = this.targetNote2;
            }
            
            // Check if same note is being held
            if (currentNote && currentNote === this.intervalStableNote) {
                this.intervalStableCount++;
                if (this.intervalStableCount >= 30 && !this.detectedNotes.has(currentNote)) {
                    this.detectedNotes.add(currentNote);
                    this.intervalStableNote = null;
                    this.intervalStableCount = 0;
                }
            } else {
                this.intervalStableNote = currentNote;
                this.intervalStableCount = 1;
            }
            
            if (this.detectedNotes.size === 2 && 
                this.detectedNotes.has(this.targetNote1) && 
                this.detectedNotes.has(this.targetNote2)) {
                this.showIntervalResult(true);
            }
        } else {
            this.drawIntervalPitchMeter();
        }
        
        requestAnimationFrame(() => this.detectIntervalPitch());
    }
    
    showIntervalResult(isCorrect) {
        
        if (isCorrect) {
            this.intervalCorrectCount++;
        } else {
            this.intervalWrongCount++;
        }
        
        this.intervalTotalCount++;
        this.updateIntervalScoreDisplay();
        
        this.detectedNotes.clear();
        
        setTimeout(() => {
            this.targetNote1 = null;
            this.targetNote2 = null;
            this.targetFreq1 = null;
            this.targetFreq2 = null;
        }, 2000);
    }
    
    updateIntervalScoreDisplay() {
        const correctEl = document.getElementById('intervalCorrectCount');
        const wrongEl = document.getElementById('intervalWrongCount');
        const totalEl = document.getElementById('intervalTotalCount');
        
        if (correctEl) correctEl.textContent = this.intervalCorrectCount;
        if (wrongEl) wrongEl.textContent = this.intervalWrongCount;
        if (totalEl) totalEl.textContent = this.intervalTotalCount;
    }
    
    resetIntervalScore() {
        this.intervalCorrectCount = 0;
        this.intervalWrongCount = 0;
        this.intervalTotalCount = 0;
        this.updateIntervalScoreDisplay();
        
        // Score reset
    }
    
    drawIntervalPitchMeter(currentFreq = null, currentNote = null) {
        const ctx = this.intervalCanvasContext;
        // Use CSS dimensions for drawing (scaling is already applied)
        const width = this.intervalCanvas.getBoundingClientRect().width;
        const height = this.intervalCanvas.getBoundingClientRect().height;
        const centerX = width / 2;
        const centerY = height * 0.8; // Needle pivot point at bottom
        
        ctx.clearRect(0, 0, width, height);
        
        // Modern gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#667eea');
        bgGradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        
        if (!this.targetNote1 || !this.targetNote2) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎵 İki ses çalın', centerX, 60);
            
            // Draw empty indicators
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillText('○ ○', centerX, 120);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '18px Arial';
            ctx.fillText('Tuner hazır', centerX, height - 30);
            return;
        }
        
        // Determine which target to show based on current frequency
        let targetFreq = this.targetFreq1;
        let targetNote = this.targetNote1;
        
        if (currentFreq) {
            const targetFreqLower1 = this.targetFreq1 / 2;
            const targetFreqLower2 = this.targetFreq2 / 2;
            const diff1 = Math.min(Math.abs(currentFreq - this.targetFreq1), Math.abs(currentFreq - targetFreqLower1));
            const diff2 = Math.min(Math.abs(currentFreq - this.targetFreq2), Math.abs(currentFreq - targetFreqLower2));
            
            if (diff2 < diff1) {
                targetFreq = this.targetFreq2;
                targetNote = this.targetNote2;
            }
        }
        
        // Draw target notes at top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        
        const detected1 = this.detectedNotes.has(this.targetNote1);
        const detected2 = this.detectedNotes.has(this.targetNote2);
        const icon1 = detected1 ? '✓' : '○';
        const icon2 = detected2 ? '✓' : '○';
        
        ctx.fillStyle = detected1 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon1} ${this.targetNote1}`, centerX - 80, 40);
        
        ctx.fillStyle = detected2 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon2} ${this.targetNote2}`, centerX + 80, 40);
        
        // Draw current target being measured
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(targetNote, centerX, centerY - 30);
        
        // Draw horizontal bar indicator
        const barWidth = width * 0.7;
        const barHeight = 30;
        const barX = (width - barWidth) / 2;
        const barY = centerY + 10;
        
        // Bar background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 15);
        ctx.fill();
        
        // Center target line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(centerX - 2, barY - 5, 4, barHeight + 10);
        
        // Draw current position indicator
        if (currentFreq && currentFreq > 0) {
            const targetFreqLower = targetFreq / 2;
            const diffOriginal = currentFreq - targetFreq;
            const diffLower = currentFreq - targetFreqLower;
            const diff = Math.abs(diffOriginal) < Math.abs(diffLower) ? diffOriginal : diffLower;
            
            const clampedDiff = Math.max(-50, Math.min(50, diff));
            const position = centerX + (clampedDiff / 50) * (barWidth / 2);
            
            const accuracy = Math.abs(diff);
            let indicatorColor;
            if (accuracy < 10) {
                indicatorColor = '#11998e';
            } else if (accuracy < 25) {
                indicatorColor = '#f39c12';
            } else {
                indicatorColor = '#eb3349';
            }
            
            // Draw glowing circle
            ctx.shadowBlur = 15;
            ctx.shadowColor = indicatorColor;
            ctx.fillStyle = indicatorColor;
            ctx.beginPath();
            ctx.arc(position, barY + barHeight / 2, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(position, barY + barHeight / 2, 10, 0, 2 * Math.PI);
            ctx.fill();
            
            // Show detected note and frequency
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`🎤 ${currentNote}`, centerX, centerY + 70);
            
            ctx.font = '16px Arial';
            ctx.fillStyle = indicatorColor;
            const diffText = diff > 0 ? `+${diff.toFixed(1)} Hz` : `${diff.toFixed(1)} Hz`;
            ctx.fillText(`${currentFreq.toFixed(2)} Hz (${diffText})`, centerX, centerY + 95);
            
            // Status
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            let statusText = '';
            if (accuracy < 10) {
                statusText = '✓ Mükemmel!';
            } else if (accuracy < 25) {
                statusText = '~ Yakın';
            } else {
                statusText = '✗ Uzak';
            }
            ctx.fillText(statusText, centerX, centerY + 115);
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎤 Ses bekleniyor...', centerX, centerY + 80);
        }
        
        // Progress
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.detectedNotes.size} / 2 nota algılandı`, centerX, height - 15);
    }
    
    // ===== TRIAD (3 NOTES) FUNCTIONS =====
    
    playRandomTriad() {
        // Select three random notes to form a chord (Major or Minor triad)
        const index1 = Math.floor(Math.random() * (this.notes.length - 8)); // Leave room for triad
        const note1 = this.notes[index1];
        
        // Randomly choose Major (4+3 semitones) or Minor (3+4 semitones) triad
        const isMajor = Math.random() > 0.5;
        const interval2 = isMajor ? 4 : 3; // Major 3rd or Minor 3rd
        const interval3 = isMajor ? 7 : 7; // Perfect 5th
        
        const note2 = this.notes[index1 + interval2];
        const note3 = this.notes[index1 + interval3];
        
        this.targetNote1 = note1.name;
        this.targetNote2 = note2.name;
        this.targetNote3 = note3.name;
        this.targetFreq1 = note1.frequency;
        this.targetFreq2 = note2.frequency;
        this.targetFreq3 = note3.frequency;
        this.detectedNotes.clear();
        
        const chordName = isMajor ? `${note1.name} Majör` : `${note1.name} Minör`;
        
        document.getElementById('triadNote1').textContent = note1.name;
        document.getElementById('triadNote2').textContent = note2.name;
        document.getElementById('triadNote3').textContent = note3.name;
        document.getElementById('triadName').textContent = chordName;
        
        document.getElementById('replayTriadBtn').disabled = false;
        
        this.drawTriadPitchMeter();
        this.playThreeTones(note1.frequency, note2.frequency, note3.frequency, 3.0);
    }
    
    replayTriad() {
        if (!this.targetFreq1 || !this.targetFreq2 || !this.targetFreq3) {
            alert('Önce üç ses çalın');
            return;
        }
        
        // Reset detected notes and stable tracking
        this.detectedNotes.clear();
        this.triadStableNote = null;
        this.triadStableCount = 0;
        
        this.drawTriadPitchMeter();
        this.playThreeTones(this.targetFreq1, this.targetFreq2, this.targetFreq3, 3.0);
    }
    
    async playTriadSequential() {
        if (!this.targetFreq1 || !this.targetFreq2 || !this.targetFreq3) {
            alert('Önce "Rastgele Üç Ses" butonuna basın');
            return;
        }
        
        this.playTone(this.targetFreq1, 1);
        await new Promise(resolve => setTimeout(resolve, 1200));
        this.playTone(this.targetFreq2, 1);
        await new Promise(resolve => setTimeout(resolve, 1200));
        this.playTone(this.targetFreq3, 1);
    }
    
    async playThreeTones(freq1, freq2, freq3, duration) {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            const now = this.audioContext.currentTime;
            
            // Premium harmonics
            const harmonics = [
                { mult: 1.0, gain: 1.0 },
                { mult: 2.0, gain: 0.45 },
                { mult: 3.0, gain: 0.25 },
                { mult: 4.0, gain: 0.15 }
            ];
            
            // Stereo separation: Sol (-0.6), Orta (0), Sağ (+0.6)
            const panners = [
                this.audioContext.createStereoPanner(),
                this.audioContext.createStereoPanner(),
                this.audioContext.createStereoPanner()
            ];
            panners[0].pan.value = -0.6; // Sol (en alçak nota)
            panners[1].pan.value = 0;    // Orta
            panners[2].pan.value = 0.6;  // Sağ (en yüksek nota)
            
            const freqs = [freq1, freq2, freq3];
            
            freqs.forEach((freq, idx) => {
                const masterGain = this.audioContext.createGain();
                masterGain.connect(panners[idx]);
                panners[idx].connect(this.audioContext.destination);
                
                // ADSR envelope
                masterGain.gain.setValueAtTime(0, now);
                masterGain.gain.linearRampToValueAtTime(0.2, now + 0.005);
                masterGain.gain.exponentialRampToValueAtTime(0.15, now + 0.08);
                masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
                
                // Create harmonics
                harmonics.forEach(h => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    const stretch = 1 + Math.pow(h.mult, 2) * 0.0002 * (freq / 440);
                    osc.frequency.value = freq * h.mult * stretch;
                    osc.type = 'sine';
                    gain.gain.value = h.gain;
                    osc.connect(gain);
                    gain.connect(masterGain);
                    osc.start(now);
                    osc.stop(now + duration + 0.1);
                });
            });
            
        } catch (error) {
            console.error('Error playing three tones:', error);
        }
    }
    
    async startTriadListening() {
        if (!this.targetNote1 || !this.targetNote2 || !this.targetNote3) {
            alert('Önce "Rastgele Üç Ses" butonuna basın');
            return;
        }
        
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
            
            this.triadListening = true;
            this.detectedNotes.clear();
            
            document.getElementById('startTriadListenBtn').disabled = true;
            document.getElementById('stopTriadListenBtn').disabled = false;
            
            this.detectTriadPitch();
        } catch (error) {
            console.error('Microphone error:', error);
            alert('Mikrofon erişimi reddedildi!');
        }
    }
    
    stopTriadListening() {
        this.triadListening = false;
        
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        
        document.getElementById('startTriadListenBtn').disabled = false;
        document.getElementById('stopTriadListenBtn').disabled = true;
    }
    
    detectTriadPitch() {
        if (!this.triadListening) return;
        
        const bufferLength = this.analyser.fftSize;
        const buffer = new Float32Array(bufferLength);
        this.analyser.getFloatTimeDomainData(buffer);
        
        // Optimized autocorrelation for best performance
        const frequency = this.autoCorrelate(buffer, this.audioContext.sampleRate);
        
        if (frequency > 0 && frequency >= 60 && frequency <= 1100) {
            const detectedNote = this.frequencyToNote(frequency);
            
            this.drawTriadPitchMeter(frequency, detectedNote);
            
            // Check all three notes with octave tolerance
            const octaves1 = [this.targetFreq1 / 4, this.targetFreq1 / 2, this.targetFreq1];
            const octaves2 = [this.targetFreq2 / 4, this.targetFreq2 / 2, this.targetFreq2];
            const octaves3 = [this.targetFreq3 / 4, this.targetFreq3 / 2, this.targetFreq3];
            
            let minDiff1 = Infinity;
            for (let octave of octaves1) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff1) minDiff1 = diff;
            }
            
            let minDiff2 = Infinity;
            for (let octave of octaves2) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff2) minDiff2 = diff;
            }
            
            let minDiff3 = Infinity;
            for (let octave of octaves3) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff3) minDiff3 = diff;
            }
            
            // Only add note if it's held stable
            if (!this.triadStableNote) {
                this.triadStableNote = null;
                this.triadStableCount = 0;
            }
            
            // Determine which note is being sung (closest match)
            let currentNote = null;
            let minDiff = Math.min(minDiff1, minDiff2, minDiff3);
            if (minDiff < 25) {
                if (minDiff === minDiff1) currentNote = this.targetNote1;
                else if (minDiff === minDiff2) currentNote = this.targetNote2;
                else if (minDiff === minDiff3) currentNote = this.targetNote3;
            }
            
            // Check if same note is being held
            if (currentNote && currentNote === this.triadStableNote) {
                this.triadStableCount++;
                if (this.triadStableCount >= 30 && !this.detectedNotes.has(currentNote)) {
                    this.detectedNotes.add(currentNote);
                    this.triadStableNote = null;
                    this.triadStableCount = 0;
                }
            } else {
                this.triadStableNote = currentNote;
                this.triadStableCount = 1;
            }
            
            if (this.detectedNotes.size === 3 && 
                this.detectedNotes.has(this.targetNote1) && 
                this.detectedNotes.has(this.targetNote2) &&
                this.detectedNotes.has(this.targetNote3)) {
                this.showTriadResult(true);
            }
        } else {
            this.drawTriadPitchMeter();
        }
        
        requestAnimationFrame(() => this.detectTriadPitch());
    }
    
    showTriadResult(isCorrect) {
        
        if (isCorrect) {
            this.triadCorrectCount++;
        } else {
            this.triadWrongCount++;
        }
        
        this.triadTotalCount++;
        this.updateTriadScoreDisplay();
        this.detectedNotes.clear();
        
        setTimeout(() => {
            this.targetNote1 = null;
            this.targetNote2 = null;
            this.targetNote3 = null;
            this.targetFreq1 = null;
            this.targetFreq2 = null;
            this.targetFreq3 = null;
        }, 2000);
    }
    
    updateTriadScoreDisplay() {
        document.getElementById('triadCorrectCount').textContent = this.triadCorrectCount;
        document.getElementById('triadWrongCount').textContent = this.triadWrongCount;
        document.getElementById('triadTotalCount').textContent = this.triadTotalCount;
    }
    
    resetTriadScore() {
        this.triadCorrectCount = 0;
        this.triadWrongCount = 0;
        this.triadTotalCount = 0;
        this.updateTriadScoreDisplay();
        
        // Score reset
    }
    
    drawTriadPitchMeter(currentFreq = null, currentNote = null) {
        const ctx = this.triadCanvasContext;
        // Use CSS dimensions for drawing (scaling is already applied)
        const width = this.triadCanvas.getBoundingClientRect().width;
        const height = this.triadCanvas.getBoundingClientRect().height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.clearRect(0, 0, width, height);
        
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#667eea');
        bgGradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        
        if (!this.targetNote1 || !this.targetNote2 || !this.targetNote3) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎹 Üç ses çalın', centerX, 60);
            
            // Draw empty indicators
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillText('○ ○ ○', centerX, 120);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '18px Arial';
            ctx.fillText('Tuner hazır', centerX, height - 30);
            return;
        }
        
        // Draw target notes at top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        
        const detected1 = this.detectedNotes.has(this.targetNote1);
        const detected2 = this.detectedNotes.has(this.targetNote2);
        const detected3 = this.detectedNotes.has(this.targetNote3);
        const icon1 = detected1 ? '✓' : '○';
        const icon2 = detected2 ? '✓' : '○';
        const icon3 = detected3 ? '✓' : '○';
        
        ctx.fillStyle = detected1 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon1} ${this.targetNote1}`, centerX - 100, 40);
        
        ctx.fillStyle = detected2 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon2} ${this.targetNote2}`, centerX, 40);
        
        ctx.fillStyle = detected3 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon3} ${this.targetNote3}`, centerX + 100, 40);
        
        // Draw horizontal bar indicator
        const barWidth = width * 0.6;
        const barHeight = 30;
        const barX = (width - barWidth) / 2;
        const barY = centerY - 20;
        
        // Bar background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 15);
        ctx.fill();
        
        // Center line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(centerX - 2, barY - 5, 4, barHeight + 10);
        
        // Show current detected note and position
        if (currentFreq && currentFreq > 0) {
            // Find closest target note
            const targets = [
                {freq: this.targetFreq1, note: this.targetNote1},
                {freq: this.targetFreq2, note: this.targetNote2},
                {freq: this.targetFreq3, note: this.targetNote3}
            ];
            
            let closestTarget = targets[0];
            let minDiff = Math.abs(currentFreq - targets[0].freq);
            targets.forEach(t => {
                const diff = Math.abs(currentFreq - t.freq);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestTarget = t;
                }
            });
            
            const diff = currentFreq - closestTarget.freq;
            const clampedDiff = Math.max(-50, Math.min(50, diff));
            const position = centerX + (clampedDiff / 50) * (barWidth / 2);
            
            const accuracy = Math.abs(diff);
            let indicatorColor;
            if (accuracy < 5) indicatorColor = '#11998e';
            else if (accuracy < 15) indicatorColor = '#fbbf24';
            else indicatorColor = '#f87171';
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = indicatorColor;
            ctx.fillStyle = indicatorColor;
            ctx.beginPath();
            ctx.arc(position, barY + barHeight / 2, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(position, barY + barHeight / 2, 10, 0, 2 * Math.PI);
            ctx.fill();
            
            // Show detected note below
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`🎤 ${currentNote}`, centerX, centerY + 50);
            
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(`${currentFreq.toFixed(2)} Hz`, centerX, centerY + 70);
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎤 Ses bekleniyor...', centerX, centerY + 50);
        }
        
        // Progress
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.detectedNotes.size} / 3 nota algılandı`, centerX, height - 20);
    }
    
    // ===== QUAD (4 NOTES) FUNCTIONS =====
    
    playRandomQuad() {
        // Select four random notes to form a 7th chord
        const index1 = Math.floor(Math.random() * (this.notes.length - 10));
        const note1 = this.notes[index1];
        
        // Randomly choose Major 7th or Dominant 7th
        const isMajor7 = Math.random() > 0.5;
        const interval2 = 4;  // Major 3rd
        const interval3 = 7;  // Perfect 5th
        const interval4 = isMajor7 ? 11 : 10; // Major 7th or Minor 7th
        
        const note2 = this.notes[index1 + interval2];
        const note3 = this.notes[index1 + interval3];
        const note4 = this.notes[index1 + interval4];
        
        this.targetNote1 = note1.name;
        this.targetNote2 = note2.name;
        this.targetNote3 = note3.name;
        this.targetNote4 = note4.name;
        this.targetFreq1 = note1.frequency;
        this.targetFreq2 = note2.frequency;
        this.targetFreq3 = note3.frequency;
        this.targetFreq4 = note4.frequency;
        this.detectedNotes.clear();
        
        const chordName = isMajor7 ? `${note1.name} Majör 7` : `${note1.name} Dominant 7`;
        
        document.getElementById('quadNote1').textContent = note1.name;
        document.getElementById('quadNote2').textContent = note2.name;
        document.getElementById('quadNote3').textContent = note3.name;
        document.getElementById('quadNote4').textContent = note4.name;
        document.getElementById('quadName').textContent = chordName;
        
        document.getElementById('replayQuadBtn').disabled = false;
        
        this.drawQuadPitchMeter();
        this.playFourTones(note1.frequency, note2.frequency, note3.frequency, note4.frequency, 3.0);
    }
    
    replayQuad() {
        if (!this.targetFreq1 || !this.targetFreq2 || !this.targetFreq3 || !this.targetFreq4) {
            alert('Önce dört ses çalın');
            return;
        }
        
        // Reset detected notes and stable tracking
        this.detectedNotes.clear();
        this.quadStableNote = null;
        this.quadStableCount = 0;
        
        this.drawQuadPitchMeter();
        this.playFourTones(this.targetFreq1, this.targetFreq2, this.targetFreq3, this.targetFreq4, 3.0);
    }
    
    async playQuadSequential() {
        if (!this.targetFreq1 || !this.targetFreq2 || !this.targetFreq3 || !this.targetFreq4) {
            alert('Önce "Rastgele Dört Ses" butonuna basın');
            return;
        }
        
        this.playTone(this.targetFreq1, 1);
        await new Promise(resolve => setTimeout(resolve, 1200));
        this.playTone(this.targetFreq2, 1);
        await new Promise(resolve => setTimeout(resolve, 1200));
        this.playTone(this.targetFreq3, 1);
        await new Promise(resolve => setTimeout(resolve, 1200));
        this.playTone(this.targetFreq4, 1);
    }
    
    async playFourTones(freq1, freq2, freq3, freq4, duration) {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            const now = this.audioContext.currentTime;
            
            // Premium harmonics
            const harmonics = [
                { mult: 1.0, gain: 1.0 },
                { mult: 2.0, gain: 0.4 },
                { mult: 3.0, gain: 0.2 },
                { mult: 4.0, gain: 0.12 }
            ];
            
            // Stereo separation: 4 notayı farklı pozisyonlara yerleştir
            const panners = [
                this.audioContext.createStereoPanner(),
                this.audioContext.createStereoPanner(),
                this.audioContext.createStereoPanner(),
                this.audioContext.createStereoPanner()
            ];
            panners[0].pan.value = -0.7; // Sol (en alçak)
            panners[1].pan.value = -0.25; // Sol-orta
            panners[2].pan.value = 0.25;  // Sağ-orta
            panners[3].pan.value = 0.7;   // Sağ (en yüksek)
            
            const freqs = [freq1, freq2, freq3, freq4];
            
            freqs.forEach((freq, idx) => {
                const masterGain = this.audioContext.createGain();
                masterGain.connect(panners[idx]);
                panners[idx].connect(this.audioContext.destination);
                
                // ADSR envelope - daha kısa süre için daha düşük volume
                masterGain.gain.setValueAtTime(0, now);
                masterGain.gain.linearRampToValueAtTime(0.18, now + 0.005);
                masterGain.gain.exponentialRampToValueAtTime(0.13, now + 0.08);
                masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
                
                // Create harmonics
                harmonics.forEach(h => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    const stretch = 1 + Math.pow(h.mult, 2) * 0.0002 * (freq / 440);
                    osc.frequency.value = freq * h.mult * stretch;
                    osc.type = 'sine';
                    gain.gain.value = h.gain;
                    osc.connect(gain);
                    gain.connect(masterGain);
                    osc.start(now);
                    osc.stop(now + duration + 0.1);
                });
            });
            
        } catch (error) {
            console.error('Error playing four tones:', error);
        }
    }
    
    async startQuadListening() {
        if (!this.targetNote1 || !this.targetNote2 || !this.targetNote3 || !this.targetNote4) {
            alert('Önce "Rastgele Dört Ses" butonuna basın');
            return;
        }
        
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
            
            this.quadListening = true;
            this.detectedNotes.clear();
            
            document.getElementById('startQuadListenBtn').disabled = true;
            document.getElementById('stopQuadListenBtn').disabled = false;
            
            this.detectQuadPitch();
        } catch (error) {
            console.error('Microphone error:', error);
            alert('Mikrofon erişimi reddedildi!');
        }
    }
    
    stopQuadListening() {
        this.quadListening = false;
        
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        
        document.getElementById('startQuadListenBtn').disabled = false;
        document.getElementById('stopQuadListenBtn').disabled = true;
    }
    
    detectQuadPitch() {
        if (!this.quadListening) return;
        
        const bufferLength = this.analyser.fftSize;
        const buffer = new Float32Array(bufferLength);
        this.analyser.getFloatTimeDomainData(buffer);
        
        // Optimized autocorrelation for best performance
        const frequency = this.autoCorrelate(buffer, this.audioContext.sampleRate);
        
        if (frequency > 0 && frequency >= 60 && frequency <= 1100) {
            const detectedNote = this.frequencyToNote(frequency);
            
            this.drawQuadPitchMeter(frequency, detectedNote);
            
            // Check all four notes with octave tolerance
            const octaves1 = [this.targetFreq1 / 4, this.targetFreq1 / 2, this.targetFreq1];
            const octaves2 = [this.targetFreq2 / 4, this.targetFreq2 / 2, this.targetFreq2];
            const octaves3 = [this.targetFreq3 / 4, this.targetFreq3 / 2, this.targetFreq3];
            const octaves4 = [this.targetFreq4 / 4, this.targetFreq4 / 2, this.targetFreq4];
            
            let minDiff1 = Infinity;
            for (let octave of octaves1) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff1) minDiff1 = diff;
            }
            
            let minDiff2 = Infinity;
            for (let octave of octaves2) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff2) minDiff2 = diff;
            }
            
            let minDiff3 = Infinity;
            for (let octave of octaves3) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff3) minDiff3 = diff;
            }
            
            let minDiff4 = Infinity;
            for (let octave of octaves4) {
                const diff = Math.abs(frequency - octave);
                if (diff < minDiff4) minDiff4 = diff;
            }
            
            // Only add note if it's held stable
            if (!this.quadStableNote) {
                this.quadStableNote = null;
                this.quadStableCount = 0;
            }
            
            // Determine which note is being sung (closest match)
            let currentNote = null;
            let minDiff = Math.min(minDiff1, minDiff2, minDiff3, minDiff4);
            if (minDiff < 25) {
                if (minDiff === minDiff1) currentNote = this.targetNote1;
                else if (minDiff === minDiff2) currentNote = this.targetNote2;
                else if (minDiff === minDiff3) currentNote = this.targetNote3;
                else if (minDiff === minDiff4) currentNote = this.targetNote4;
            }
            
            // Check if same note is being held
            if (currentNote && currentNote === this.quadStableNote) {
                this.quadStableCount++;
                if (this.quadStableCount >= 30 && !this.detectedNotes.has(currentNote)) {
                    this.detectedNotes.add(currentNote);
                    this.quadStableNote = null;
                    this.quadStableCount = 0;
                }
            } else {
                this.quadStableNote = currentNote;
                this.quadStableCount = 1;
            }
            
            if (this.detectedNotes.size === 4 && 
                this.detectedNotes.has(this.targetNote1) && 
                this.detectedNotes.has(this.targetNote2) &&
                this.detectedNotes.has(this.targetNote3) &&
                this.detectedNotes.has(this.targetNote4)) {
                this.showQuadResult(true);
            }
        } else {
            this.drawQuadPitchMeter();
        }
        
        requestAnimationFrame(() => this.detectQuadPitch());
    }
    
    showQuadResult(isCorrect) {
        if (isCorrect) {
            this.quadCorrectCount++;
        } else {
            this.quadWrongCount++;
        }
        
        this.quadTotalCount++;
        this.detectedNotes.clear();
        
        setTimeout(() => {
            this.targetNote1 = null;
            this.targetNote2 = null;
            this.targetNote3 = null;
            this.targetNote4 = null;
            this.targetFreq1 = null;
            this.targetFreq2 = null;
            this.targetFreq3 = null;
            this.targetFreq4 = null;
        }, 2000);
    }
    
    drawQuadPitchMeter(currentFreq = null, currentNote = null) {
        const ctx = this.quadCanvasContext;
        // Use CSS dimensions for drawing (scaling is already applied)
        const width = this.quadCanvas.getBoundingClientRect().width;
        const height = this.quadCanvas.getBoundingClientRect().height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.clearRect(0, 0, width, height);
        
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#667eea');
        bgGradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        
        if (!this.targetNote1 || !this.targetNote2 || !this.targetNote3 || !this.targetNote4) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎹 Dört ses çalın', centerX, 60);
            
            // Draw empty indicators
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillText('○ ○ ○ ○', centerX, 120);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '18px Arial';
            ctx.fillText('Tuner hazır', centerX, height - 30);
            return;
        }
        
        // Draw target notes at top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        
        const detected1 = this.detectedNotes.has(this.targetNote1);
        const detected2 = this.detectedNotes.has(this.targetNote2);
        const detected3 = this.detectedNotes.has(this.targetNote3);
        const detected4 = this.detectedNotes.has(this.targetNote4);
        const icon1 = detected1 ? '✓' : '○';
        const icon2 = detected2 ? '✓' : '○';
        const icon3 = detected3 ? '✓' : '○';
        const icon4 = detected4 ? '✓' : '○';
        
        ctx.fillStyle = detected1 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon1} ${this.targetNote1}`, centerX - 120, 40);
        
        ctx.fillStyle = detected2 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon2} ${this.targetNote2}`, centerX - 40, 40);
        
        ctx.fillStyle = detected3 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon3} ${this.targetNote3}`, centerX + 40, 40);
        
        ctx.fillStyle = detected4 ? '#11998e' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${icon4} ${this.targetNote4}`, centerX + 120, 40);
        
        // Draw horizontal bar indicator
        const barWidth = width * 0.6;
        const barHeight = 30;
        const barX = (width - barWidth) / 2;
        const barY = centerY - 20;
        
        // Bar background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 15);
        ctx.fill();
        
        // Center line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(centerX - 2, barY - 5, 4, barHeight + 10);
        
        // Show current detected note and position
        if (currentFreq && currentFreq > 0) {
            // Find closest target note
            const targets = [
                {freq: this.targetFreq1, note: this.targetNote1},
                {freq: this.targetFreq2, note: this.targetNote2},
                {freq: this.targetFreq3, note: this.targetNote3},
                {freq: this.targetFreq4, note: this.targetNote4}
            ];
            
            let closestTarget = targets[0];
            let minDiff = Math.abs(currentFreq - targets[0].freq);
            targets.forEach(t => {
                const diff = Math.abs(currentFreq - t.freq);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestTarget = t;
                }
            });
            
            const diff = currentFreq - closestTarget.freq;
            const clampedDiff = Math.max(-50, Math.min(50, diff));
            const position = centerX + (clampedDiff / 50) * (barWidth / 2);
            
            const accuracy = Math.abs(diff);
            let indicatorColor;
            if (accuracy < 5) indicatorColor = '#11998e';
            else if (accuracy < 15) indicatorColor = '#fbbf24';
            else indicatorColor = '#f87171';
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = indicatorColor;
            ctx.fillStyle = indicatorColor;
            ctx.beginPath();
            ctx.arc(position, barY + barHeight / 2, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(position, barY + barHeight / 2, 10, 0, 2 * Math.PI);
            ctx.fill();
            
            // Show detected note below
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`🎤 ${currentNote}`, centerX, centerY + 50);
            
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(`${currentFreq.toFixed(2)} Hz`, centerX, centerY + 70);
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎤 Ses bekleniyor...', centerX, centerY + 50);
        }
        
        // Progress
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.detectedNotes.size} / 4 nota algılandı`, centerX, height - 20);
    }
    
    // Echo (Ses Tekrarı) Mode Functions
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
        
        const randomIndex = Math.floor(Math.random() * this.notes.length);
        const note = this.notes[randomIndex];
        
        this.echoPlayedNote = note.name;
        this.echoPlayedFreq = note.frequency;
        this.echoWaitingForResponse = false;
        
        document.getElementById('echoPlayedNote').textContent = note.name;
        document.getElementById('echoPlayedFreq').textContent = note.frequency.toFixed(2) + ' Hz';
        document.getElementById('echoDetectedNote').textContent = '-';
        document.getElementById('echoDetectedFreq').textContent = '-';
        document.getElementById('echoAccuracy').textContent = '-';
        
        this.playTone(note.frequency, 1.5);
        
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
            if (this.smoothedFrequency === 0) {
                this.smoothedFrequency = frequency;
            } else {
                this.smoothedFrequency = this.smoothedFrequency * 0.998 + frequency * 0.002;
            }
            
            const detectedNote = this.frequencyToNote(this.smoothedFrequency);
            
            document.getElementById('echoDetectedNote').textContent = detectedNote;
            document.getElementById('echoDetectedFreq').textContent = this.smoothedFrequency.toFixed(2) + ' Hz';
            
            const octaves = [this.echoPlayedFreq / 4, this.echoPlayedFreq / 2, this.echoPlayedFreq];
            
            let minDiff = Infinity;
            for (let octave of octaves) {
                const diff = Math.abs(this.smoothedFrequency - octave);
                if (diff < minDiff) minDiff = diff;
            }
            
            document.getElementById('echoAccuracy').textContent = minDiff.toFixed(2) + ' Hz';
            
            const freqDiff = Math.abs(this.smoothedFrequency - this.lastStableFrequency);
            
            if (freqDiff < 25) {
                this.stableDetectionCount++;
            } else {
                this.stableDetectionCount = 1;
            }
            
            this.lastStableFrequency = this.smoothedFrequency;
            
            if (this.stableDetectionCount >= 30) {
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
        
        document.getElementById('echoScore').textContent = `${this.echoCorrectCount} / ${this.echoTotalCount}`;
        
        if (correct) {
            alert('✅ Doğru! Sesi başarıyla tekrar ettiniz!');
        } else {
            alert('❌ Yanlış! Tekrar deneyin.');
        }
        
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
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`🎹 ${this.echoPlayedNote}`, centerX, 60);
        
        const barWidth = width * 0.7;
        const barHeight = 40;
        const barX = (width - barWidth) / 2;
        const barY = centerY;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 20);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(centerX - 2, barY - 10, 4, barHeight + 20);
        
        if (currentFreq && currentFreq > 0) {
            const octaves = [this.echoPlayedFreq / 4, this.echoPlayedFreq / 2, this.echoPlayedFreq];
            
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
}

// Initialize the application
const app = new MusicAptitudeTest();
