const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const apiKey = "NiceTryHaHa";
    const units = "metric";
    const cityName = req.body.cityName.replace(/\s*/g,"");
    console.log(cityName);
    const geoURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;
    console.log(geoURL);
    https.get(geoURL, (geoRes) => {
        
        geoRes.on("data", (dataGeo) => {
            const geoData = JSON.parse(dataGeo);
            const lat = geoData[0].lat;
            const lon = geoData[0].lon;

            const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=" + units;

            https.get(url, (response) => {
                console.log(response.statusCode);

                response.on("data", (dataWeather) => {
                    const weatherData = JSON.parse(dataWeather);
                    const temp = weatherData.main.temp;
                    const weatherDescription = weatherData.weather[0].description;
                    const icon = weatherData.weather[0].icon;
                    const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                    res.write("<style>body{background-color: grey;}</style>");
                    
                    res.write("<h1>The weather description is " + weatherDescription + "</h1>");
                    
                    res.write("The temperature in " + cityName + " is " + temp + "&#8451");

                    res.write("<img src=" + imgURL + ">");

                    res.send();
                });
            });
        });
    });

    
}); 


    






app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
});
