const apiKey = "a1d9f501a4b5f56ca95bb545d62e04fe";
const defaultapiURL =
  "api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
const apiURL = "https://api.openweathermap.org/data/2.5/weather";

//////////////////////////////////////
const form = document.querySelector("#form");
const searchBody = document.querySelector(".search-main");
const maindiv = document.querySelector("main");
const nav = document.querySelector("nav");
const loader = document.querySelector(".socket");
const refreshButton = document.querySelector("#refreshsvg");
const navform = document.querySelector("#nav-form");
const mainSearchBar = document.querySelector("#main-searchbar");
const topSearchbar = document.querySelector("#nav-searchbar");

//////////////////////////////////////weather elements
const locationHead = document.querySelector("#location-head");
const dateHead = document.querySelector("#datehead");
const crrcondtions = document.querySelector("#crrconditions");
const minTempInfo = document.querySelector("#inf1");
const maxTempInfo = document.querySelector("#inf2");
const feelslikeinfo = document.querySelector("#feelslike");
const cloudsInfo = document.querySelector("#clouds");
const humidity = document.querySelector("#inf3");
const pressure = document.querySelector("#inf4");
const sunrise = document.querySelector("#inf5");
const sunset = document.querySelector("#inf6");
const windSpeed = document.querySelector("#inf7");
const gust = document.querySelector("#inf8");
const windDirection = document.querySelector("#inf9");
const weatherImage = document.querySelector("#weather-img");

////
let searchValue = undefined;
let searchpoped = false;
let cameFromMainSearch = true;
let isLoading = false;
////
const placeHolderText = [
  "T",
  "y",
  "p",
  "e",
  " ",
  "c",
  "i",
  "t",
  "y",
  " ",
  "h",
  "e",
  "r",
  "e",
];
/////////////////////////////////////////////////weather data
const coord = {
  lon: undefined,
  lat: undefined,
};
const weather = {
  status: undefined,
};
const sys = {
  name: undefined,
  country: undefined,
  timezone: undefined,
};
const main = {
  crrtemp: undefined,
  maxtemp: undefined,
  mintemp: undefined,
  feelslike: undefined,
  humidity: undefined,
  pressure: undefined,
  sunrise: undefined,
  sunset: undefined,
  clouds: undefined,
};
const wind = {
  deg: undefined,
  gust: undefined,
  speed: undefined,
};
//////////////////////
function normalTime(timestamp) {
  let min = undefined,
    hours = undefined;
  let date = new Date(timestamp * 1000);
  let datevalues = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  min = datevalues[4];
  hours = datevalues[3];
  if (hours < 12) {
    return `${hours}:${min} AM`;
  } else {
    return `${24 - hours}:${min} PM`;
  }
}
//////////////////////////
function getCurrentDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  return today;
}
//////////////////////////
function saveWeatherData(data) {
  coord.lon = data.coord.lon;
  coord.lat = data.coord.lat;
  ////
  weather.status = data.weather[0].main;
  ////
  sys.name = data.name;
  sys.country = data.sys.country;
  sys.timezone = data.timezone;
  ////
  main.crrtemp = Math.floor(data.main.temp - 273) + "°C";
  main.maxtemp = Math.floor(data.main.temp_max - 273) + "°C";
  main.mintemp = Math.floor(data.main.temp_min - 273) + "°C";
  main.feelslike = Math.floor(data.main.feels_like - 273) + "°C";
  main.humidity = data.main.humidity + "%";
  main.pressure = data.main.pressure + " hPa";
  main.sunrise = normalTime(data.sys.sunrise);
  main.sunset = normalTime(data.sys.sunset);
  main.clouds = data.clouds.all;
  ////
  wind.deg = data.wind.deg;
  wind.gust = data.wind.gust;
  wind.speed = data.wind.speed;
}
////////////////////////////

function setweatherdata() {
  locationHead.innerText = `${sys.name}, ${sys.country}`;
  dateHead.innerText = `${getCurrentDate()}`;
  crrcondtions.innerText = `${main.crrtemp} ${weather.status}`;
  minTempInfo.innerHTML = `<img src="assets/thermometer.png" class="icon" alt="img">Min Temp: ${main.mintemp}`;
  maxTempInfo.innerHTML = `<img src="assets/thermometer.png" class="icon" alt="img">Max Temp: ${main.maxtemp}`;
  feelslikeinfo.innerHTML = `<img src="assets/feelslike.png" class="icon" alt="img">Feels like: ${main.feelslike}`;
  cloudsInfo.innerHTML = `<img src="assets/clouds.png" class="icon" alt="img">Clouds: 5%`;
  humidity.innerHTML = `<img src="assets/humidity.png" class="icon" alt="img">Humidity: ${main.humidity}`;
  pressure.innerHTML = `<img src="assets/gauge.png" class="icon" alt="img">Pressure: ${main.pressure}`;
  sunrise.innerHTML = `<img src="assets/sunrise.png" class="icon" alt="img">Sunrise: ${main.sunrise}`;
  sunset.innerHTML = `<img src="assets/sunset.png" class="icon" alt="img">Sunset: ${main.sunset} (IST)`;
  windSpeed.innerHTML = `<img src="assets/wind.png" class="icon" alt="img">Wind: ${wind.speed} m/s`;
  if (wind.gust) {
    gust.innerHTML = `<img src="assets/windy.png" class="icon" alt="img">Gust: ${wind.gust} m/s`;
  } else {
    gust.innerHTML = `<img src="assets/windy.png" class="icon" alt="img">Gust:Unknown`;
  }
  windDirection.innerHTML = `<img src="assets/directions.png" class="icon" alt="img">Wind Direction: ${wind.deg}`;
  //setting weather images
  if (weather.status.toLowerCase() == "clear") {
    weatherImage.src = "assets/status/sunny.png";
  }
  if (weather.status.toLowerCase() == "clouds") {
    weatherImage.src = "assets/status/partly-cloudy.png";
  }
  if (weather.status.toLowerCase() == "smoke") {
    weatherImage.src = "assets/status/fog.png";
  }
  if (weather.status.toLowerCase() == "haze") {
    weatherImage.src = "assets/status/fog.png";
  }
  if (weather.status.toLowerCase() == "snow") {
    weatherImage.src = "assets/status/snow.png";
  }
  if (weather.status.toLowerCase() == "rain") {
    weatherImage.src = "assets/status/rain.png";
  }
}
//////////////////////////////////////

function addLoadingScreen() {
  isLoading = true;
  loader.style.display = "unset";
  if (!loader.classList.contains("loadercome")) {
    loader.classList.add("loadercome");
    if (loader.classList.contains("loadergo")) {
      loader.classList.remove("loadergo");
    }
  }
}
function removeLoadingScreen() {
  isLoading = false;
  if (!loader.classList.contains("loadergo")) {
    loader.classList.add("loadergo");
    if (loader.classList.contains("loadercome")) {
      loader.classList.remove("loadercome");
    }
    setTimeout(() => {
      loader.style.display = "none";
    }, 300);
  }
}
//////////////////////////////////////

function animateMainSearch(direction) {
  if (direction == "out") {
    if (searchBody.classList.contains("search-fadein")) {
      searchBody.classList.remove("search-fadein");
    }
    if (mainSearchBar.classList.contains("searcherror")) {
      mainSearchBar.classList.remove("searcherror");
    }
    searchBody.classList.add("search-fadeof");
  }
  ////////
  if (direction == "in") {
    if (searchBody.classList.contains("search-fadeof")) {
      searchBody.classList.remove("search-fadeof");
    }
    if (isLoading) {
      removeLoadingScreen();
    }
    searchBody.classList.add("search-fadein");
    mainSearchBar.classList.add("searcherror");
  }
}
//////////////////////////////////////

function displayweather() {
  maindiv.style.display = "unset";
  if (!maindiv.classList.contains("mainfadein")) {
    setweatherdata();
    if (isLoading) {
      removeLoadingScreen();
    }
    maindiv.classList.add("mainfadein");
    weatherImage.classList.add("imagein");
    if (maindiv.classList.contains("mainfadeout")) {
      maindiv.classList.remove("mainfadeout");
    }
    if (!searchpoped) {
      setTimeout(() => {
        navform.classList.toggle("searchpop");
        searchpoped = true;
      }, 1000);
    } //search bar poper
    searchBody.style.display = "none";
  }
}
////////////////////////////////////// Request Funtion ------------

async function makeWeatherRequest(cityName) {
  const config = {
    params: {
      q: cityName,
      appid: apiKey,
    },
  };
  ////
  try {
    const result = await axios.get(apiURL, config); //result
    saveWeatherData(result.data);
    displayweather();
    cameFromMainSearch = false;
  } catch (e) {
    if (cameFromMainSearch) {
      animateMainSearch("in");
      if (isLoading) {
        removeLoadingScreen();
      }
    } else {
      displayweather();
      if (isLoading) {
        removeLoadingScreen();
      }
      if (!topSearchbar.classList.contains("searcherror")) {
        topSearchbar.classList.add("searcherror");
        setTimeout(() => {
          topSearchbar.classList.remove("searcherror");
        }, 1000);
      }
    }
  }
}
//////////////////////////////////////Main Form

form.addEventListener("submit", function (event) {
  event.preventDefault();
  searchValue = form.elements.query.value;
  if (searchValue) {
    animateMainSearch("out");
    ////Loading Screen here---------
    addLoadingScreen();
    makeWeatherRequest(searchValue);
  }
  form.elements.query.value = "";
});

//////////////////////////////////////Nav Form

navform.addEventListener("submit", function (e) {
  e.preventDefault();
  if (navform.elements.squery.value) {
    searchValue = navform.elements.squery.value;
    makeWeatherRequest(searchValue);
    ////Loading Screen here---------
    addLoadingScreen();

    maindiv.classList.remove("mainfadein");
    weatherImage.classList.remove("imagein");
  }
  navform.elements.squery.value = "";
});

////////////////////////////////////// Place Holder

setTimeout(() => {
  let placeString = "";
  let placeCounter = 0;
  let placeholderInterval = setInterval(() => {
    placeString = "";
    for (let j = 0; j <= placeCounter; j++) {
      placeString += placeHolderText[j];
    }
    mainSearchBar.placeholder = placeString;
    placeCounter++;
    if (placeCounter === placeHolderText.length) {
      clearInterval(placeholderInterval);
    }
  }, 200);
}, 200);

////////////////////////////////////// Refresh Button

refreshButton.addEventListener("click", function () {
  maindiv.classList.remove("mainfadein");
  maindiv.classList.add("mainfadeout");
  weatherImage.classList.remove("imagein");
  makeWeatherRequest(searchValue);
});
