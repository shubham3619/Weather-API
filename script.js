const introPage = document.getElementById("intro-page");
const fetchBtn = document.getElementById("fetch-btn");
const weatherInfo = document.getElementById("weather-info");
const letLong = document.getElementById("let-long");
const weatherData = document.getElementById("weather-data")

fetchBtn.addEventListener("click", getLocation);
weatherInfo.style.display = 'none';
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeather, showError);
    introPage.style.display = 'none';
    weatherInfo.style.display = 'flex';
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showWeather(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  showLetLong(latitude, longitude);
  showMap(latitude, longitude);
  fetchWeather(latitude, longitude);
}
function showLetLong(lat, long) {
    var latData = document.createElement('div');
    latData.innerHTML += `lat: ${lat}`;
    letLong.appendChild(latData);
    var longData = document.createElement('div');
    longData.innerHTML += `Long: ${long}`;
    letLong.appendChild(longData);
}

function showMap (lat, long) {
  const mapIFrame = document.getElementById('iframe');
  mapIFrame.src = `https:maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed`
}

function showError(error) {
  let message = "";

  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      message = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      message = "An unknown error occurred.";
      break;
  }

  alert(message);
}

async function fetchWeather(latitude, longitude) {
    const apiKey = "659a2c3f482421ceb3922a5e0ba96c24";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    try {
        const responce = await fetch(apiUrl);
        const data = await responce.json();
        console.log(data);
        //showWeather(data);
        fetchItem(data);
    }
    catch (error) {
        console.log(error);
    }

}


function fetchItem(data) {
    const timeGmt = timeInGMT(`${data.timezone}`);

    document.getElementById('name').innerText=`Location: ${data.name}`;
    document.getElementById('humidity').innerText=`Humidity: ${data.main.humidity}`;
    document.getElementById('time-zone').innerText=`Time Zone: ${timeGmt}`;
    document.getElementById('pressure').innerText=`Pressure: ${data.main.pressure}`;
    document.getElementById('sky').innerText=`Sky: ${data.weather[0].main}`;
    document.getElementById('temp').innerText=`Temp: ${data.main.temp}'C`;
    document.getElementById('feels-like').innerText=`Feels Like: ${data.main.feels_like}`;
    document.getElementById('windspeed').innerText=`Wind Speed: ${data.wind.speed}`;
}


function timeInGMT(worldTime) {
    const timezoneOffsetInSeconds = worldTime;

    // Convert seconds to hours and minutes
    const hours = Math.floor(Math.abs(timezoneOffsetInSeconds) / 3600);
    const minutes = Math.floor((Math.abs(timezoneOffsetInSeconds) % 3600) / 60);

    // Determine the sign of the offset (+ or -)
    const sign = timezoneOffsetInSeconds >= 0 ? '+' : '-';

    // Format the hours and minutes in the GMT+hh:mm format
    const formattedOffset = `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedOffset;
}