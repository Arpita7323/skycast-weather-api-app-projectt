function getWeather() {
    const apiKey = 'f6088eb8c17f646698ff4002f7c58429';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
            displayDailyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); 
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); 

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); 
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); 
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function displayDailyForecast(forecastData) {
    const dailyForecastDiv = document.getElementById('daily-forecast');
    dailyForecastDiv.innerHTML = ''; 

    
    const nextDaysData = forecastData.filter(item => {
        const dateTime = new Date(item.dt * 1000); 
        const currentDay = new Date().getDate();
        return dateTime.getDate() !== currentDay; 
    });

    
    const groupedData = {};
    nextDaysData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();
        if (!groupedData[day]) {
            groupedData[day] = [];
        }
        groupedData[day].push(item);
    });

    
    for (const day in groupedData) {
        const dayData = groupedData[day];
        const date = new Date(dayData[0].dt * 1000);
        const dayName = getDayName(date.getDay());
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const temperature = Math.round(dayData[0].main.temp - 273.15); 
        const iconCode = dayData[0].weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const dailyForecastHtml = `
            <div class="daily-forecast-item">
                <p>${dayName}, ${formattedDate}</p>
                <img src="${iconUrl}" alt="Daily Weather Icon">
                <p>${temperature}°C</p>
            </div>
        `;

        dailyForecastDiv.innerHTML += dailyForecastHtml;
    }


    const previousDayData = forecastData.find(item => {
        const dateTime = new Date(item.dt * 1000); 
        const currentDay = new Date().getDate();
        const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).getDate(); 
        return dateTime.getDate() === previousDay; 
    });

    if (previousDayData) {
        const previousDate = new Date(previousDayData.dt * 1000);
        const previousDayName = getDayName(previousDate.getDay());
        const previousFormattedDate = previousDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const previousTemperature = Math.round(previousDayData.main.temp - 273.15);
        const previousIconCode = previousDayData.weather[0].icon;
        const previousIconUrl = `https://openweathermap.org/img/wn/${previousIconCode}.png`;

        const previousDayForecastHtml = `
            <div class="daily-forecast-item">
                <p>${previousDayName}, ${previousFormattedDate}</p>
                <img src="${previousIconUrl}" alt="Previous Day Weather Icon">
                <p>${previousTemperature}°C</p>
            </div>
        `;

        dailyForecastDiv.innerHTML += previousDayForecastHtml;
    }
}

function getDayName(dayIndex) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; //
}
