const submitBtn = document.querySelector("#submitBtn");
const refreshBtn = document.querySelector("#refreshBtn");
const addBtn = document.querySelector(".addBtn");
const removeBtn = document.querySelector("#removeBtn");
let locationData = document.querySelector("#location")
const form = document.getElementById("form");
const apiKey = "b8629ff3a21c2ecfad8ae59fab192415";
const url = `http://api.openweathermap.org/geo/1.0/direct`;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather`


class SavedArea {
    constructor(id, location, temp, humidity, description, time){
        this.id = id;
        this.location = location;
        this.temp = temp;
        this.humidity = humidity;
        this.description = description;
        this.time = time;
    }
}

class SelectedAreas {
    constructor(){
        this.list = [];
        this.nextId = 0;
        
    }
    add(location, temp, humidity, description, time){
        let save = new SavedArea(++this.nextId, location, temp, humidity, description, time);
        this.list.push(save);
    }
    remove(saveId) {
        this.list = this.list.filter(({id}) => id != saveId);
    }
}



let selectedAreas = new SelectedAreas();
const cityName = document.getElementById("city");
const stateCode = document.getElementById("state");
const countryCode = document.querySelector("#country");

form.addEventListener("submit", (event) => {
    locationData.textContent = `${cityName.value}, ${stateCode.value}, ${countryCode.value}`;
    fetchArea(event, cityName, stateCode, countryCode);
});

function addThing(){
    let temp = document.getElementById("temp");
    let humidity = document.getElementById("humidity");
    let description = document.getElementById("description");
    let location = document.getElementById("location");
    let time = document.getElementById("time");
    selectedAreas.add(temp.value, humidity.value, description.value, description.value, location.value, time.value);
    console.log(selectedAreas);
};

addBtn.addEventListener("click", (event) => 
    addThing()
);

refreshBtn.addEventListener("click", (event) => {
    console.log(locationData.value);
    fetchArea(event, cityName, stateCode, countryCode);
});


function fetchArea(event, cityName, stateCode, countryCode) {
    console.log(cityName.value);
    event.preventDefault();
    fetch(`${url}?q=${cityName.value},${stateCode.value},${countryCode.value}&limit=1&appid=${apiKey}`)
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((result) =>{
        console.log(result);
        let lat = result[0]["lat"];
        let lon = result[0]["lon"];
        console.log(lat, lon);
        fetchWeather(lat, lon);
        cityName.value = "";
        stateCode.value = "";
        countryCode.value = "";
    })
    .catch((err) =>{
        console.error(err);
    })
};

function fetchWeather(lat, lon){
    fetch(`${weatherUrl}?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((result) =>{
        console.log(result);
        console.log(result.main, result.weather[0]);
        parseWeatherData(result);
    })
    .catch((err) =>{
        console.error(err);
    })
}

function parseWeatherData(weatherData){
    let dataTemp = weatherData.main.temp;
    let dataHumidity = weatherData.main.humidity;
    let dataDescription = weatherData.weather[0].description;
    let tempP = document.getElementById("temp");
    tempP.textContent = dataTemp;
    let humidityP = document.getElementById("humidity");
    humidityP.textContent = dataHumidity;
    let descriptionP = document.getElementById("description");
    descriptionP.textContent = dataDescription;
}

