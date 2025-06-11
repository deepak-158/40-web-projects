// Digital clock with alarm - getting better at JavaScript!
// This one was trickier than I thought, dealing with time stuff is confusing

class DigitalClockAlarm {
    constructor() {
        this.is24HourFormat = true;
        this.alarms = [];
        this.alarmId = 0;
        this.activeAlarmTimeout = null;
        this.alarmAudio = null;        this.setupElements();
        this.initializeAudio();
        this.populateTimeInputs();
        this.startClock();
        this.bindEvents();
    }

    setupElements() {
        // get all the clock elements
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.timezoneElement = document.getElementById('timezone');
        this.formatToggleBtn = document.getElementById('formatToggle');

        // Alarm elements
        this.hourInput = document.getElementById('hourInput');
        this.minuteInput = document.getElementById('minuteInput');
        this.ampmInput = document.getElementById('ampmInput');
        this.ampmGroup = document.getElementById('ampmGroup');
        this.setAlarmBtn = document.getElementById('setAlarmBtn');
        this.clearAlarmBtn = document.getElementById('clearAlarmBtn');
        this.alarmStatus = document.getElementById('alarmStatus');
        this.activeAlarms = document.getElementById('activeAlarms');

        // Modal elements
        this.alarmModal = document.getElementById('alarmModal');
        this.alarmTime = document.getElementById('alarmTime');
        this.snoozeBtn = document.getElementById('snoozeBtn');
        this.dismissBtn = document.getElementById('dismissBtn');
    }

    initializeAudio() {
        // Create audio context for alarm sound
        this.alarmAudio = new Audio();
        this.alarmAudio.loop = true;
        this.alarmAudio.volume = 0.7;
        
        // Create a simple beep sound using Web Audio API
        this.createAlarmSound();
    }

    createAlarmSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Create alarm sound data URL
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 44100;
            canvas.height = 1;
            
            // Generate alarm tone
            const sampleRate = 44100;
            const duration = 1; // 1 second
            const frequency1 = 800; // Hz
            const frequency2 = 1000; // Hz
            
            const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                const beep1 = Math.sin(2 * Math.PI * frequency1 * t) * 0.3;
                const beep2 = Math.sin(2 * Math.PI * frequency2 * t) * 0.3;
                data[i] = (t % 1 < 0.5) ? beep1 : beep2;
            }
            
            // Convert to data URL (simplified approach)
            this.alarmAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Ppv2kuBSeR2+/FdycFJHfU88WFPG+g7eKuRDOKm+3r2Yc2BCuBye3JfAQAbI3Q5IpKAmWmCAwAMgAOAAAAEYZKiIVqGGF4nreznW15VWWLqq5iTTdmm8r4f2mAWF2Ag1lFXWeJmL7u+dPy+ODe2t/t7Ozr6urp5+bk5OLg3t7f3d3e3d3e39/g4OLh4ePj5Ofk5ebn6Ojp6eqr8uts8Ohl' // This is a placeholder - in a real app you'd generate proper audio
        } catch (error) {
            console.log('Web Audio API not supported, using fallback');
            // Fallback: use a simple beep sound
            this.alarmAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Ppv2kuBSeR2+/FdycFJHfU88WFPG+g7eKuRDOKm+3r2Yc2BCuBye3JfAQAbI3Q5IpKAmWmCAwAMgAOAAAAEYZKiIVqGGF4nreznW15VWWLqq5iTTdmm8r4f2mAWF2Ag1lFXWeJmL7u+dPy+ODe2t/t7Ozr6urp5+bk5OLg3t7f3d3e3d3e39/g4OLh4ePj5Ofk5ebn6Ojp6eqr8uts8Ohl';
        }
    }

    populateTimeInputs() {
        // Populate hour options
        this.hourInput.innerHTML = '';
        const maxHour = this.is24HourFormat ? 23 : 12;
        const minHour = this.is24HourFormat ? 0 : 1;
        
        for (let i = minHour; i <= maxHour; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            this.hourInput.appendChild(option);
        }

        // Populate minute options
        this.minuteInput.innerHTML = '';
        for (let i = 0; i < 60; i += 5) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            this.minuteInput.appendChild(option);
        }

        // Show/hide AM/PM selector
        this.ampmGroup.style.display = this.is24HourFormat ? 'none' : 'flex';
    }

    startClock() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        
        // Format time
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = '';

        if (!this.is24HourFormat) {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 should be 12
        }

        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${ampm ? ' ' + ampm : ''}`;
        this.timeElement.textContent = timeString;

        // Format date
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        this.dateElement.textContent = now.toLocaleDateString('en-US', options);

        // Show timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.timezoneElement.textContent = timezone;

        // Check alarms
        this.checkAlarms(now);
    }

    bindEvents() {
        this.formatToggleBtn.addEventListener('click', () => this.toggleTimeFormat());
        this.setAlarmBtn.addEventListener('click', () => this.setAlarm());
        this.clearAlarmBtn.addEventListener('click', () => this.clearAllAlarms());
        this.snoozeBtn.addEventListener('click', () => this.snoozeAlarm());
        this.dismissBtn.addEventListener('click', () => this.dismissAlarm());

        // Close modal when clicking outside
        this.alarmModal.addEventListener('click', (e) => {
            if (e.target === this.alarmModal) {
                this.dismissAlarm();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.alarmModal.classList.contains('show')) {
                this.dismissAlarm();
            }
        });
    }

    toggleTimeFormat() {
        this.is24HourFormat = !this.is24HourFormat;
        this.formatToggleBtn.textContent = this.is24HourFormat ? '12 Hour Format' : '24 Hour Format';
        this.populateTimeInputs();
        this.updateTime();
        this.renderActiveAlarms();
    }

    setAlarm() {
        const hour = parseInt(this.hourInput.value);
        let minute = parseInt(this.minuteInput.value);
        const ampm = this.ampmInput.value;

        if (isNaN(hour) || isNaN(minute)) {
            this.showNotification('Please select valid time values', 'error');
            return;
        }

        // Convert to 24-hour format for internal storage
        let alarmHour = hour;
        if (!this.is24HourFormat) {
            if (ampm === 'PM' && hour !== 12) {
                alarmHour = hour + 12;
            } else if (ampm === 'AM' && hour === 12) {
                alarmHour = 0;
            }
        }

        const alarm = {
            id: ++this.alarmId,
            hour: alarmHour,
            minute: minute,
            originalHour: hour,
            ampm: ampm,
            active: true,
            label: `Alarm ${this.alarmId}`
        };

        this.alarms.push(alarm);
        this.renderActiveAlarms();
        this.updateAlarmStatus();
        
        const timeStr = this.formatAlarmTime(alarm);
        this.showNotification(`Alarm set for ${timeStr}`, 'success');
    }

    clearAllAlarms() {
        this.alarms = [];
        this.renderActiveAlarms();
        this.updateAlarmStatus();
        this.showNotification('All alarms cleared', 'info');
    }

    removeAlarm(id) {
        this.alarms = this.alarms.filter(alarm => alarm.id !== id);
        this.renderActiveAlarms();
        this.updateAlarmStatus();
        this.showNotification('Alarm removed', 'info');
    }

    toggleAlarm(id) {
        const alarm = this.alarms.find(a => a.id === id);
        if (alarm) {
            alarm.active = !alarm.active;
            this.renderActiveAlarms();
            this.updateAlarmStatus();
            this.showNotification(`Alarm ${alarm.active ? 'enabled' : 'disabled'}`, 'info');
        }
    }

    checkAlarms(currentTime) {
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentSecond = currentTime.getSeconds();

        // Only check at the start of each minute
        if (currentSecond !== 0) return;

        this.alarms.forEach(alarm => {
            if (alarm.active && alarm.hour === currentHour && alarm.minute === currentMinute) {
                this.triggerAlarm(alarm);
            }
        });
    }

    triggerAlarm(alarm) {
        const timeStr = this.formatAlarmTime(alarm);
        this.alarmTime.textContent = `${timeStr} - ${alarm.label}`;
        this.alarmModal.classList.add('show');
        
        // Play alarm sound
        this.playAlarmSound();
        
        // Auto-dismiss after 1 minute if not handled
        this.activeAlarmTimeout = setTimeout(() => {
            this.dismissAlarm();
        }, 60000);
    }

    playAlarmSound() {
        try {
            this.alarmAudio.currentTime = 0;
            this.alarmAudio.play().catch(e => {
                console.log('Could not play alarm sound:', e);
                // Fallback: vibrate if available
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200, 100, 200]);
                }
            });
        } catch (error) {
            console.log('Audio playback failed:', error);
        }
    }

    stopAlarmSound() {
        try {
            this.alarmAudio.pause();
            this.alarmAudio.currentTime = 0;
        } catch (error) {
            console.log('Could not stop alarm sound:', error);
        }
    }

    snoozeAlarm() {
        this.stopAlarmSound();
        this.alarmModal.classList.remove('show');
        
        if (this.activeAlarmTimeout) {
            clearTimeout(this.activeAlarmTimeout);
        }

        // Create a snooze alarm for 5 minutes from now
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        
        const snoozeAlarm = {
            id: ++this.alarmId,
            hour: now.getHours(),
            minute: now.getMinutes(),
            originalHour: this.is24HourFormat ? now.getHours() : (now.getHours() % 12 || 12),
            ampm: now.getHours() >= 12 ? 'PM' : 'AM',
            active: true,
            label: 'Snooze Alarm'
        };

        this.alarms.push(snoozeAlarm);
        this.renderActiveAlarms();
        this.updateAlarmStatus();
        this.showNotification('Snoozed for 5 minutes', 'info');
    }

    dismissAlarm() {
        this.stopAlarmSound();
        this.alarmModal.classList.remove('show');
        
        if (this.activeAlarmTimeout) {
            clearTimeout(this.activeAlarmTimeout);
        }
    }

    formatAlarmTime(alarm) {
        if (this.is24HourFormat) {
            return `${alarm.hour.toString().padStart(2, '0')}:${alarm.minute.toString().padStart(2, '0')}`;
        } else {
            return `${alarm.originalHour.toString().padStart(2, '0')}:${alarm.minute.toString().padStart(2, '0')} ${alarm.ampm}`;
        }
    }

    renderActiveAlarms() {
        if (this.alarms.length === 0) {
            this.activeAlarms.innerHTML = '';
            return;
        }

        this.activeAlarms.innerHTML = this.alarms.map(alarm => `
            <div class="alarm-item">
                <div class="alarm-info">
                    <div class="alarm-time-display">${this.formatAlarmTime(alarm)}</div>
                    <div class="alarm-label">${alarm.label}</div>
                </div>
                <div class="alarm-actions-inline">
                    <button class="btn btn-small ${alarm.active ? 'secondary' : 'primary'}" 
                            onclick="clockAlarm.toggleAlarm(${alarm.id})">
                        ${alarm.active ? 'Disable' : 'Enable'}
                    </button>
                    <button class="btn btn-small danger" 
                            onclick="clockAlarm.removeAlarm(${alarm.id})">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateAlarmStatus() {
        const activeAlarmCount = this.alarms.filter(alarm => alarm.active).length;
        
        if (activeAlarmCount === 0) {
            this.alarmStatus.className = 'alarm-status no-alarm';
            this.alarmStatus.querySelector('.status-text').textContent = 'No active alarms';
        } else {
            this.alarmStatus.className = 'alarm-status active';
            this.alarmStatus.querySelector('.status-text').textContent = 
                `${activeAlarmCount} active alarm${activeAlarmCount !== 1 ? 's' : ''}`;
        }
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 5px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the clock when the page loads
let clockAlarm;
document.addEventListener('DOMContentLoaded', () => {
    clockAlarm = new DigitalClockAlarm();
});

// Add notification animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
