const apiKey = '4d8fb5b93d4af21d66a2948710284366';
const searchInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

let timeoutId;

function init() {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    searchBtn.addEventListener('click', handleSearch);
    
    // Default to user's location (India based on timezone)
    searchInput.value = 'Mumbai';
    handleSearch();
}

async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) return;
    
    showLoading();
    await fetchWeather(city);
}

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found. Please try another city.');
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    // Hide error
    errorMessage.classList.add('hidden');
    
    // Show weather card
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    document.getElementById('description').textContent = capitalize(data.weather[0].description);
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    
    // Weather icon
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="${data.weather[0].description}" />`;
    
    // Show card with animation
    weatherCard.classList.remove('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherCard.classList.add('hidden');
}

function showLoading() {
    searchBtn.innerHTML = '<div class="loading"></div>';
    searchBtn.style.cursor = 'not-allowed';
}

function hideLoading() {
    searchBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
    `;
    searchBtn.style.cursor = 'pointer';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Auto-search after typing stops
searchInput.addEventListener('input', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        if (searchInput.value.trim()) {
            handleSearch();
        }
    }, 800);
});

init();
