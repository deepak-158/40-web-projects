# Weather App - My Weather Station 🌦️

This is my second project where I built a weather app! I was super excited to work with APIs for the first time. It shows the current weather for any city you type in.

## What it does

- You can search for any city and get the weather
- Shows temperature, humidity, and how it feels outside
- Has these cool weather icons that change based on the weather
- Works on mobile too (though I struggled with that part initially)
- Remembers your recent searches 
- You can switch between Celsius and Fahrenheit (added this after realizing Americans use Fahrenheit lol)

## What I used to build this

- **HTML** - The basic structure
- **CSS** - Making it look pretty (spent way too much time on animations)
- **JavaScript** - The fun part where everything comes together
- **OpenWeatherMap API** - This free API that gives weather data
- **LocalStorage** - To remember what cities you searched before

## How to run it

You'll need to get your own API key first:
1. Go to [OpenWeatherMap](https://openweathermap.org/api) and sign up (it's free!)
2. Copy your API key
3. Open `script.js` and replace `YOUR_API_KEY` with your actual key
4. Just open `index.html` in your browser and start searching!

## What I learned

This was my first time working with APIs and it was both exciting and frustrating:
- Learned how to make API calls with fetch()
- Figured out async/await (took me a while to get this)
- Got better at handling errors (the API doesn't work for made-up cities)
- Local storage is pretty cool for saving data
- CSS animations are addictive once you start

## Issues I ran into

- The API key setup was confusing at first
- Sometimes the weather icons wouldn't load
- Making it responsive was harder than I thought
- Had to handle cases where people type random stuff instead of city names

## 🎯 Learning Objectives

This project helps you learn:
- API integration and error handling
- Asynchronous JavaScript (async/await)
- DOM manipulation and event handling
- Local Storage for data persistence
- Responsive web design
- CSS animations and transitions

## 🔧 API Configuration

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
```

Replace `YOUR_API_KEY_HERE` with your actual OpenWeatherMap API key.

## 📄 License

This project is open source and available under the MIT License.
