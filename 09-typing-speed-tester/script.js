// Typing Speed Tester - my most complex project yet!
// Had to figure out real-time text comparison and timing stuff

class TypingSpeedTester {
    constructor() {
        this.testDuration = 60; // seconds
        this.difficulty = 'easy';
        this.currentText = '';
        this.currentPosition = 0;
        this.startTime = null;
        this.endTime = null;
        this.timer = null;
        this.timeLeft = 0;
        this.errors = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.isTestActive = false;
        this.testTexts = this.loadTestTexts();
        
        this.initializeElements();
        this.bindEvents();
        this.displayRandomText();
    }

    initializeElements() {
        // Settings elements
        this.settingsPanel = document.getElementById('settingsPanel');
        this.testDurationSelect = document.getElementById('testDuration');
        this.textDifficultySelect = document.getElementById('textDifficulty');
        this.startTestBtn = document.getElementById('startTestBtn');

        // Test area elements
        this.testArea = document.getElementById('testArea');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.wpmDisplay = document.getElementById('wpmDisplay');
        this.accuracyDisplay = document.getElementById('accuracyDisplay');
        this.errorsDisplay = document.getElementById('errorsDisplay');
        this.textContent = document.getElementById('textContent');
        this.typingInput = document.getElementById('typingInput');
        this.resetBtn = document.getElementById('resetBtn');
        this.newTextBtn = document.getElementById('newTextBtn');

        // Results elements
        this.resultsScreen = document.getElementById('resultsScreen');
        this.finalWPM = document.getElementById('finalWPM');
        this.finalAccuracy = document.getElementById('finalAccuracy');
        this.finalErrors = document.getElementById('finalErrors');
        this.finalCPM = document.getElementById('finalCPM');
        this.performanceMessage = document.getElementById('performanceMessage');
        this.tryAgainBtn = document.getElementById('tryAgainBtn');
        this.shareResultsBtn = document.getElementById('shareResultsBtn');

        // Toast notification
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        this.startTestBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.newTextBtn.addEventListener('click', () => this.generateNewText());
        this.tryAgainBtn.addEventListener('click', () => this.resetTest());
        this.shareResultsBtn.addEventListener('click', () => this.shareResults());

        // Settings change events
        this.testDurationSelect.addEventListener('change', (e) => {
            this.testDuration = parseInt(e.target.value);
            this.timeDisplay.textContent = this.testDuration;
        });

        this.textDifficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.displayRandomText();
        });

        // Typing input events
        this.typingInput.addEventListener('input', (e) => this.handleTyping(e));
        this.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.typingInput.addEventListener('paste', (e) => this.handlePaste(e));
        
        // Focus management
        this.typingInput.addEventListener('focus', () => {
            if (this.isTestActive) {
                this.typingInput.style.borderColor = '#28a745';
            }
        });

        this.typingInput.addEventListener('blur', () => {
            if (this.isTestActive) {
                this.showToast('Keep typing! Click here to continue.', 'warning');
                setTimeout(() => this.typingInput.focus(), 100);
            }
        });
    }

    loadTestTexts() {
        // Different difficulty levels with various texts
        return {
            easy: [
                "The quick brown fox jumps over the lazy dog. This is a simple sentence that contains all letters of the alphabet. It is commonly used for typing practice.",
                "Programming is fun and exciting. You can create amazing things with code. Practice makes perfect when learning to type quickly and accurately.",
                "The sun shines bright in the clear blue sky. Birds are singing their beautiful songs. It is a wonderful day to be outside enjoying nature.",
                "Computers have changed our lives in many ways. We use them for work, entertainment, and communication. Technology continues to evolve rapidly."
            ],
            medium: [
                "JavaScript is a versatile programming language that runs in web browsers. It enables interactive web pages and is an essential part of web applications. Developers use JavaScript to create dynamic user interfaces.",
                "Artificial intelligence and machine learning are transforming industries. These technologies can analyze vast amounts of data and make predictions. The future holds exciting possibilities for AI applications.",
                "Climate change is one of the most pressing issues of our time. Scientists study weather patterns and environmental data to understand global warming. Sustainable solutions are needed to protect our planet.",
                "Cybersecurity is crucial in today's digital world. Organizations must protect their data from hackers and cyber threats. Strong passwords and encryption help maintain security online."
            ],
            hard: [
                "Quantum computing represents a paradigm shift in computational capabilities, leveraging quantum mechanical phenomena such as superposition and entanglement to process information in fundamentally different ways than classical computers.",
                "Neuroplasticity, the brain's remarkable ability to reorganize itself by forming new neural connections throughout life, challenges previous assumptions about the immutability of adult brain structure and function.",
                "Bioengineering encompasses the application of engineering principles to biological systems, including the development of prosthetics, tissue engineering, and genetic modification techniques for medical applications.",
                "Cryptography involves mathematical algorithms and protocols designed to secure communication and protect sensitive information from unauthorized access, ensuring confidentiality, integrity, and authenticity in digital transactions."
            ]
        };
    }

    displayRandomText() {
        const texts = this.testTexts[this.difficulty];
        this.currentText = texts[Math.floor(Math.random() * texts.length)];
        this.renderText();
        this.currentPosition = 0;
    }

    renderText() {
        // Split text into individual characters for highlighting
        this.textContent.innerHTML = this.currentText
            .split('')
            .map((char, index) => `<span class="char" data-index="${index}">${char}</span>`)
            .join('');
    }    startTest() {
        this.isTestActive = true;
        this.startTime = Date.now();
        this.timeLeft = this.testDuration;
        this.currentPosition = 0;
        this.errors = 0;
        this.correctChars = 0;
        this.totalChars = 0;

        // Hide settings and show test area
        this.settingsPanel.style.display = 'none';
        this.testArea.style.display = 'block';
        this.resultsScreen.style.display = 'none';

        // Enable input and focus it
        this.typingInput.disabled = false;
        this.typingInput.value = '';
        this.typingInput.focus();

        // Reset all displays
        this.timeDisplay.textContent = this.timeLeft;
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '100%';
        this.errorsDisplay.textContent = '0';
        
        // Reset text highlighting
        this.clearHighlighting();
        this.highlightCurrentChar();

        // Start countdown timer
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timeDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);

        this.showToast('Test started! Start typing now.', 'success');
    }handleTyping(e) {
        if (!this.isTestActive) return;

        const typedText = e.target.value;
        this.totalChars = typedText.length;

        // Reset highlighting
        this.clearHighlighting();

        // Reset counters
        this.correctChars = 0;
        this.errors = 0;

        // Check each character and count correct/incorrect
        for (let i = 0; i < Math.min(typedText.length, this.currentText.length); i++) {
            const char = document.querySelector(`.char[data-index="${i}"]`);
            if (!char) continue;

            if (typedText[i] === this.currentText[i]) {
                char.classList.add('correct');
                this.correctChars++;
            } else {
                char.classList.add('incorrect');
                this.errors++;
            }
        }

        // Count extra characters as errors if user typed too much
        if (typedText.length > this.currentText.length) {
            this.errors += typedText.length - this.currentText.length;
        }

        // Highlight next character to type
        this.currentPosition = typedText.length;
        this.highlightCurrentChar();

        // Update stats in real-time
        this.updateStats();

        // Check if test is completed
        if (typedText.length >= this.currentText.length) {
            this.endTest();
        }
    }

    handleKeyDown(e) {
        if (!this.isTestActive) return;

        // Prevent certain shortcuts during test
        if (e.ctrlKey && (e.key === 'a' || e.key === 'v' || e.key === 'c')) {
            e.preventDefault();
            this.showToast('Copy/paste is not allowed during the test!', 'error');
        }
    }

    handlePaste(e) {
        e.preventDefault();
        this.showToast('Pasting is not allowed! Type the text manually.', 'error');
    }

    clearHighlighting() {
        document.querySelectorAll('.char').forEach(char => {
            char.classList.remove('correct', 'incorrect', 'current');
        });
    }

    highlightCurrentChar() {
        if (this.currentPosition < this.currentText.length) {
            const currentChar = document.querySelector(`.char[data-index="${this.currentPosition}"]`);
            if (currentChar) {
                currentChar.classList.add('current');
            }
        }
    }    updateStats() {
        // Calculate WPM (Words Per Minute)
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        const wordsTyped = this.correctChars / 5; // standard: 1 word = 5 characters
        const wpm = timeElapsed > 0.01 ? Math.round(wordsTyped / timeElapsed) : 0; // Avoid division by very small numbers

        // Calculate accuracy (correct characters / total characters typed)
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;

        // Update displays with bounds checking
        this.wpmDisplay.textContent = Math.max(0, Math.min(999, wpm)); // Cap at 999 WPM
        this.accuracyDisplay.textContent = Math.max(0, Math.min(100, accuracy)) + '%'; // Keep between 0-100%
        this.errorsDisplay.textContent = this.errors;
    }endTest() {
        this.isTestActive = false;
        this.endTime = Date.now();
        
        // Stop timer
        if (this.timer) {
            clearInterval(this.timer);
        }

        // Disable input
        this.typingInput.disabled = true;

        // Calculate final stats
        const testDurationMinutes = this.testDuration / 60;
        const finalWPM = Math.round((this.correctChars / 5) / testDurationMinutes);
        const finalAccuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        const finalCPM = Math.round(this.correctChars / testDurationMinutes);

        // Ensure values are within reasonable bounds
        const boundedWPM = Math.max(0, finalWPM);
        const boundedAccuracy = Math.max(0, Math.min(100, finalAccuracy));
        const boundedCPM = Math.max(0, finalCPM);

        // Show results
        this.showResults(boundedWPM, boundedAccuracy, this.errors, boundedCPM);
    }

    showResults(wpm, accuracy, errors, cpm) {
        // Hide test area and show results
        this.testArea.style.display = 'none';
        this.resultsScreen.style.display = 'block';

        // Update final stats
        this.finalWPM.textContent = wpm;
        this.finalAccuracy.textContent = accuracy + '%';
        this.finalErrors.textContent = errors;
        this.finalCPM.textContent = cpm;

        // Generate performance message
        let message = this.getPerformanceMessage(wpm, accuracy);
        this.performanceMessage.textContent = message;

        this.showToast('Test completed! Check your results below.', 'success');
    }

    getPerformanceMessage(wpm, accuracy) {
        if (wpm >= 80 && accuracy >= 95) {
            return "🚀 Exceptional! You're a typing master! Your speed and accuracy are outstanding.";
        } else if (wpm >= 60 && accuracy >= 90) {
            return "⭐ Excellent work! Your typing skills are well above average. Keep it up!";
        } else if (wpm >= 40 && accuracy >= 85) {
            return "👍 Good job! You have solid typing skills with room for improvement.";
        } else if (wpm >= 25 && accuracy >= 80) {
            return "📈 Not bad! With more practice, you'll definitely improve your speed and accuracy.";
        } else {
            return "💪 Keep practicing! Everyone starts somewhere. Focus on accuracy first, then speed will follow.";
        }
    }

    resetTest() {
        // Reset all states
        this.isTestActive = false;
        this.currentPosition = 0;
        this.errors = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.startTime = null;
        this.endTime = null;

        if (this.timer) {
            clearInterval(this.timer);
        }

        // Reset UI
        this.settingsPanel.style.display = 'block';
        this.testArea.style.display = 'none';
        this.resultsScreen.style.display = 'none';
        
        this.typingInput.value = '';
        this.typingInput.disabled = true;
        this.timeDisplay.textContent = this.testDuration;
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '100%';
        this.errorsDisplay.textContent = '0';

        this.clearHighlighting();
        this.displayRandomText();

        this.showToast('Test reset. Choose your settings and start again!', 'success');
    }

    generateNewText() {
        this.displayRandomText();
        if (!this.isTestActive) {
            this.showToast('New text loaded!', 'success');
        }
    }

    shareResults() {
        const wpm = this.finalWPM.textContent;
        const accuracy = this.finalAccuracy.textContent;
        const shareText = `I just completed a typing speed test! 🎯\n\nResults:\n⚡ Speed: ${wpm} WPM\n🎯 Accuracy: ${accuracy}\n\nTry it yourself!`;

        if (navigator.share) {
            navigator.share({
                title: 'My Typing Speed Test Results',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Results copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Unable to share results.', 'error');
            });
        }
    }

    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type} show`;

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the typing speed tester when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingSpeedTester();
});

// Add some keyboard shortcuts for better UX
document.addEventListener('keydown', (e) => {
    // Escape key to reset/stop test
    if (e.key === 'Escape') {
        const tester = window.typingTester;
        if (tester && tester.isTestActive) {
            if (confirm('Are you sure you want to stop the current test?')) {
                tester.resetTest();
            }
        }
    }
});

// Store reference globally for keyboard shortcuts
document.addEventListener('DOMContentLoaded', () => {
    window.typingTester = new TypingSpeedTester();
});
