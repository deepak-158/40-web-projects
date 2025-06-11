// Weather App - my first API project!
// This was way more complicated than I expected but I learned a ton

class WeatherApp {
    constructor() {
        // Replace with your OpenWeatherMap API key - don't forget this!
        this.API_KEY = '5a48e98cf8cc4f4e02bdfd114e77839f';
        this.API_URL = 'https://api.openweathermap.org/data/2.5/weather';
        
        this.currentUnit = 'celsius'; // most people use celsius right?
        this.currentWeatherData = null;
        this.recentSearches = this.loadRecentSearches();
        
        this.initializeElements();
        this.attachEventListeners();
        this.renderRecentSearches();
        
        // remind people about the API key - learned this the hard way
        if (this.API_KEY === 'YOUR_API_KEY_HERE') {
            this.showError('Please add your OpenWeatherMap API key in script.js');
        }
    }    initializeElements() {
        // grab all the DOM elements - there are a lot of them!
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.weatherContainer = document.getElementById('weatherContainer');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.recentSearchesContainer = document.getElementById('recentSearches');
        this.recentList = document.getElementById('recentList');
        this.clearRecentBtn = document.getElementById('clearRecentBtn');
        
        // Weather display elements
        this.cityName = document.getElementById('cityName');
        this.weatherDate = document.getElementById('weatherDate');
        this.temperature = document.getElementById('temperature');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        
        // Unit toggle buttons
        this.unitButtons = document.querySelectorAll('.unit-btn');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
        
        this.unitButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentUnit = e.target.dataset.unit;
                this.updateUnitButtons();
                if (this.currentWeatherData) {
                    this.displayWeather(this.currentWeatherData);
                }
            });
        });
        
        this.clearRecentBtn.addEventListener('click', () => this.clearRecentSearches());
    }    async searchWeather() {
        const city = this.cityInput.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        if (this.API_KEY === 'YOUR_API_KEY_HERE') {
            this.showError('Please add your OpenWeatherMap API key in script.js');
            return;
        }

        this.showLoading();
        
        try {
            const url = `${this.API_URL}?q=${city}&appid=${this.API_KEY}&units=metric`;
            console.log('Fetching weather data from:', url);
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error response:', errorData);
                
                if (response.status === 404) {
                    throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests. Please try again later.');
                } else {
                    throw new Error(`Error ${response.status}: ${errorData.message || 'Failed to fetch weather data'}`);
                }
            }
            
            const data = await response.json();
            console.log('Weather data received:', data);
            
            this.currentWeatherData = data;
            this.displayWeather(data);
            this.addToRecentSearches(city);
            this.cityInput.value = '';
            
        } catch (error) {
            console.error('Weather search error:', error);
            this.showError(error.message);
        }
    }

    displayWeather(data) {
        this.hideAll();
        
        // Update weather information
        this.cityName.textContent = `${data.name}, ${data.sys.country}`;
        this.weatherDate.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Temperature
        const temp = this.convertTemperature(data.main.temp);
        const feelsLikeTemp = this.convertTemperature(data.main.feels_like);
        const unit = this.currentUnit === 'celsius' ? '°C' : '°F';
        
        this.temperature.textContent = `${Math.round(temp)}${unit}`;
        this.feelsLike.textContent = `${Math.round(feelsLikeTemp)}${unit}`;
        
        // Weather icon and description
        const iconCode = data.weather[0].icon;
        this.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        this.weatherIcon.alt = data.weather[0].description;
        this.weatherDescription.textContent = data.weather[0].description;
        
        // Other details
        this.humidity.textContent = `${data.main.humidity}%`;
        this.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        this.pressure.textContent = `${data.main.pressure} hPa`;
        
        this.weatherContainer.style.display = 'block';
        this.renderRecentSearches();
    }

    convertTemperature(celsius) {
        if (this.currentUnit === 'fahrenheit') {
            return (celsius * 9/5) + 32;
        }
        return celsius;
    }

    updateUnitButtons() {
        this.unitButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.unit === this.currentUnit);
        });
    }

    addToRecentSearches(city) {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(item => 
            item.toLowerCase() !== city.toLowerCase()
        );
        
        // Add to beginning
        this.recentSearches.unshift(city);
        
        // Keep only last 5 searches
        if (this.recentSearches.length > 5) {
            this.recentSearches = this.recentSearches.slice(0, 5);
        }
        
        this.saveRecentSearches();
    }

    renderRecentSearches() {
        if (this.recentSearches.length === 0) {
            this.recentSearchesContainer.style.display = 'none';
            return;
        }
        
        this.recentList.innerHTML = '';
        
        this.recentSearches.forEach(city => {
            const button = document.createElement('button');
            button.className = 'recent-item';
            button.textContent = city;
            button.addEventListener('click', () => {
                this.cityInput.value = city;
                this.searchWeather();
            });
            
            this.recentList.appendChild(button);
        });
        
        this.recentSearchesContainer.style.display = 'block';
    }

    clearRecentSearches() {
        this.recentSearches = [];
        this.saveRecentSearches();
        this.recentSearchesContainer.style.display = 'none';
    }

    loadRecentSearches() {
        const saved = localStorage.getItem('weatherRecentSearches');
        return saved ? JSON.parse(saved) : [];
    }

    saveRecentSearches() {
        localStorage.setItem('weatherRecentSearches', JSON.stringify(this.recentSearches));
    }

    showLoading() {
        this.hideAll();
        this.loading.style.display = 'block';
    }    showError(message) {
        this.hideAll();
        this.error.style.display = 'block';
        
        const errorTitle = document.getElementById('errorTitle');
        const errorMessage = document.getElementById('errorMessage');
        
        if (message.includes('not found')) {
            errorTitle.textContent = 'City Not Found';
        } else if (message.includes('API key')) {
            errorTitle.textContent = 'API Key Error';
        } else if (message.includes('requests')) {
            errorTitle.textContent = 'Rate Limit Exceeded';
        } else {
            errorTitle.textContent = 'Error';
        }
        
        errorMessage.textContent = message;
    }

    hideAll() {
        this.weatherContainer.style.display = 'none';
        this.loading.style.display = 'none';
        this.error.style.display = 'none';
    }
}

// Initialize the app
const weatherApp = new WeatherApp();

// Add some sample functionality for demo purposes
document.addEventListener('DOMContentLoaded', () => {
    // Focus on input when page loads
    weatherApp.cityInput.focus();
    
    // Add demo city suggestions if no API key
    if (weatherApp.API_KEY === 'YOUR_API_KEY_HERE') {
        const demoContainer = document.createElement('div');
        demoContainer.style.cssText = `
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
            color: white;
        `;
        
        demoContainer.innerHTML = `
            <h3>🔑 API Key Required</h3>
            <p>To use this weather app, you need to:</p>
            <ol style="text-align: left; margin: 15px 0; padding-left: 20px;">
                <li>Get a free API key from <a href="https://openweathermap.org/api" target="_blank" style="color: #74b9ff;">OpenWeatherMap</a></li>
                <li>Replace "YOUR_API_KEY_HERE" in script.js with your actual API key</li>
                <li>Refresh the page and start searching for weather!</li>
            </ol>
            <p style="font-size: 0.9rem; opacity: 0.8;">The API key is free and takes just a few minutes to set up.</p>
        `;
        
        document.querySelector('.container').appendChild(demoContainer);
    }
});
