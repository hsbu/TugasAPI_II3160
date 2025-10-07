// Weather API configuration
const API_KEY = '717b64c259b63d6656a8032709d0a797';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

let banner = [
  `<div id="banner-section" class="banner">
 Welcome to Zephyr Weather Terminal! — Type <span class="command">help</span> for a list of supported commands.
  </div>`,
];

let aboutme = [
  `<div id="aboutme-section">`,
  `<span class='underline'>Hey, I'm Hasbu! 👋</span>`,
  `  <li>💻 I'm a Fullstack Engineer passionate about building intelligent and data-driven applications.</li>`,
  `  <li>⚙️ Skilled in both frontend and backend development, with a focus on performance and scalability.</li>`,
  `  <li>🧠 Experienced in Data Science and Machine Learning — from model development to production deployment.</li>`,
  `  <li>📊 Love turning raw data into actionable insights and predictive solutions.</li>`,
  `  <li>🚀 Always exploring new technologies to bridge AI with practical web solutions.</li>`,
  `  <li>🤝 Open to collaborating on fullstack, AI, or data-driven innovation projects.</li>`,
  `  <li>📫 Contact: <a href="mailto:hasbullah4869@gmail.com">hasbullah4869@gmail.com</a></li>`,
  "</div>",
];

// Fetch weather data
async function fetchWeatherForCity(city) {
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return { error: `City "${city}" not found. Please check the spelling and try again.` };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { error: 'Failed to fetch weather data. Please try again later.' };
  }
}

// Update profile info section with weather data
function updateProfileWeatherInfo(data) {
  if (data.error) return;
  
  // Update temperature
  const tempDisplay = document.getElementById('temp-display');
  if (tempDisplay) {
    tempDisplay.innerHTML = `→ &nbsp;${Math.round(data.main.temp)}°C`;
  }
  
  // Update pressure
  const pressureDisplay = document.getElementById('pressure-display');
  if (pressureDisplay) {
    pressureDisplay.innerHTML = `→ &nbsp;${data.main.pressure} hPa`;
  }
  
  // Update humidity
  const humidityDisplay = document.getElementById('humidity-display');
  if (humidityDisplay) {
    humidityDisplay.innerHTML = `→ &nbsp;${data.main.humidity}%`;
  }
  
  // Update wind
  const windDisplay = document.getElementById('wind-display');
  if (windDisplay) {
    windDisplay.innerHTML = `→ &nbsp;${data.wind.speed} m/s`;
  }
  
  // Update city
  const cityDisplay = document.getElementById('city-display');
  if (cityDisplay) {
    cityDisplay.innerHTML = `→ &nbsp;${data.name}, ${data.sys.country}`;
  }
}

// Update only profile info without terminal output (for direct weather commands)
function updateWeatherInfoOnly(data) {
  if (data.error) {
    console.log('Weather error:', data.error);
    return;
  }
  
  // Update profile info section only
  updateProfileWeatherInfo(data);
}

// Load default weather for Bandung on page load
function loadDefaultWeather() {
  fetchWeatherForCity('Bandung').then(data => {
    updateWeatherInfoOnly(data);
  }).catch(error => {
    console.log('Failed to load default weather:', error);
  });
}

let help = [
  `<div id="help-section"><pre class="whitespace-pre-wrap">
<span class="command">aboutme</span>
↳ Displays who I am?
<span class="command">weather &lt;city&gt;</span>
↳ Get weather information for any city (e.g., weather Jakarta)
<span class="command">email</span>
↳ To send me an email.
<span class="command">history</span>
↳ View command history.
<span class="command">help</span>
↳ Displays this help message.
<span class="command">sudo</span>
↳ Try it out for yourself.
<span class="command">snake</span>
↳ Run Snake Game.
<span class="command">clear</span>
↳ Clear the terminal.
</pre></div>`,
];