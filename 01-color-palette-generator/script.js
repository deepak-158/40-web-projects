// Color Palette Generator
// Made this for my web dev portfolio - pretty happy with how it turned out!

class ColorPaletteGenerator {
    constructor() {
        this.currentPalette = [];
        this.savedPalettes = this.loadSavedPalettes();
        this.currentFormat = 'hex'; // default to hex, most people use this
        
        this.setupElements();
        this.setupEventListeners();
        this.generatePalette(); // generate one on load
    }

    setupElements() {
        // grab all the DOM elements we need
        this.generateBtn = document.getElementById('generateBtn');
        this.savePaletteBtn = document.getElementById('savePaletteBtn');
        this.showHistoryBtn = document.getElementById('showHistoryBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.paletteContainer = document.getElementById('paletteContainer');
        this.colorFormatSelect = document.getElementById('colorFormat');
        this.historySection = document.getElementById('historySection');
        this.historyContainer = document.getElementById('historyContainer');
        this.toast = document.getElementById('toast');
    }

    setupEventListeners() {
        // button clicks
        this.generateBtn.addEventListener('click', () => this.generatePalette());
        this.savePaletteBtn.addEventListener('click', () => this.savePalette());
        this.showHistoryBtn.addEventListener('click', () => this.toggleHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.colorFormatSelect.addEventListener('change', (e) => this.changeFormat(e.target.value));
        
        // keyboard shortcuts - spacebar for generate, S for save
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.generatePalette();
            }
        });
    }    generateRandomColor() {
        // this took me forever to get right - had to research HSL values
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50; // 50-100% - keeps colors vibrant
        const lightness = Math.floor(Math.random() * 40) + 30; // 30-70% - not too dark or light
        
        return {
            hue,
            saturation,
            lightness,
            hex: this.hslToHex(hue, saturation, lightness),
            rgb: this.hslToRgb(hue, saturation, lightness),
            hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`
        };
    }

    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r, g, b;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `rgb(${r}, ${g}, ${b})`;
    }    generatePalette() {
        // clear the old palette
        this.currentPalette = [];
        
        // make 5 colors - tried 3 but it felt too empty, 7 was too much
        for (let i = 0; i < 5; i++) {
            this.currentPalette.push(this.generateRandomColor());
        }
        
        this.renderPalette();
    }    renderPalette() {
        this.paletteContainer.innerHTML = '';
        
        this.currentPalette.forEach((color, index) => {
            const colorCard = document.createElement('div');
            colorCard.className = 'color-card';
            
            // probably could've used a template but this works fine
            colorCard.innerHTML = `
                <div class="color-display" style="background-color: ${color.hex}"></div>
                <div class="color-info">
                    <div class="color-value">${this.getColorValue(color)}</div>
                    <div class="color-name">Color ${index + 1}</div>
                </div>
            `;
            
            // click to copy - this is pretty neat!
            colorCard.addEventListener('click', () => this.copyColor(color));
            this.paletteContainer.appendChild(colorCard);
        });
    }

    getColorValue(color) {
        switch (this.currentFormat) {
            case 'hex':
                return color.hex.toUpperCase();
            case 'rgb':
                return color.rgb;
            case 'hsl':
                return color.hsl;
            default:
                return color.hex.toUpperCase();
        }
    }

    changeFormat(format) {
        this.currentFormat = format;
        this.renderPalette();
        this.renderHistory();
    }

    async copyColor(color) {
        const colorValue = this.getColorValue(color);
        
        try {
            await navigator.clipboard.writeText(colorValue);
            this.showToast(`${colorValue} copied to clipboard!`);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = colorValue;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast(`${colorValue} copied to clipboard!`);
        }
    }

    savePalette() {
        const paletteData = {
            id: Date.now(),
            colors: this.currentPalette,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        this.savedPalettes.unshift(paletteData);
        
        // Keep only last 20 palettes
        if (this.savedPalettes.length > 20) {
            this.savedPalettes = this.savedPalettes.slice(0, 20);
        }
        
        this.savePalettesToStorage();
        this.showToast('Palette saved successfully!');
        
        if (this.historySection.style.display !== 'none') {
            this.renderHistory();
        }
    }

    loadSavedPalettes() {
        const saved = localStorage.getItem('colorPalettes');
        return saved ? JSON.parse(saved) : [];
    }

    savePalettesToStorage() {
        localStorage.setItem('colorPalettes', JSON.stringify(this.savedPalettes));
    }

    toggleHistory() {
        const isVisible = this.historySection.style.display !== 'none';
        
        if (isVisible) {
            this.historySection.style.display = 'none';
            this.showHistoryBtn.textContent = 'View History';
        } else {
            this.historySection.style.display = 'block';
            this.showHistoryBtn.textContent = 'Hide History';
            this.renderHistory();
        }
    }

    renderHistory() {
        if (this.savedPalettes.length === 0) {
            this.historyContainer.innerHTML = '<p style="text-align: center; color: white;">No saved palettes yet.</p>';
            return;
        }

        this.historyContainer.innerHTML = '';
        
        this.savedPalettes.forEach(palette => {
            const historyPalette = document.createElement('div');
            historyPalette.className = 'history-palette';
            
            const colorsHtml = palette.colors.map(color => 
                `<div class="history-color" style="background-color: ${color.hex}" 
                      title="${this.getColorValue(color)}"
                      onclick="navigator.clipboard.writeText('${this.getColorValue(color)}').then(() => colorGenerator.showToast('${this.getColorValue(color)} copied!'))"></div>`
            ).join('');
            
            historyPalette.innerHTML = `
                <div class="history-palette-colors">
                    ${colorsHtml}
                </div>
                <div class="history-palette-info">
                    <span class="history-palette-date">${palette.date} at ${palette.time}</span>
                    <button class="delete-palette" onclick="colorGenerator.deletePalette(${palette.id})">Delete</button>
                </div>
            `;
            
            this.historyContainer.appendChild(historyPalette);
        });
    }

    deletePalette(id) {
        this.savedPalettes = this.savedPalettes.filter(palette => palette.id !== id);
        this.savePalettesToStorage();
        this.renderHistory();
        this.showToast('Palette deleted');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all saved palettes?')) {
            this.savedPalettes = [];
            this.savePalettesToStorage();
            this.renderHistory();
            this.showToast('History cleared');
        }
    }

    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the app
const colorGenerator = new ColorPaletteGenerator();

// Add some helpful tips
document.addEventListener('DOMContentLoaded', () => {
    // Show tip about spacebar shortcut
    setTimeout(() => {
        if (localStorage.getItem('colorPaletteTipShown') !== 'true') {
            colorGenerator.showToast('Tip: Press SPACEBAR to generate new palette!');
            localStorage.setItem('colorPaletteTipShown', 'true');
        }
    }, 2000);
});
