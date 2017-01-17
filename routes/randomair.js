/**
 * Created by Khoa on 1/8/2017.
 */

"use strict;"

const fs = require('fs');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cities = require('all-the-cities');
const cc = require('country-code');
const imageDownloader = require('image-downloader');
const path = require('path');

// router.get('/get_airports', (req, res, next) => {
//     fs.readFile('./src/randomair/airports.json', (error, data) => {
//         if(error)
//             res.sendStatus(500);
//
//         let airports;
//         try {
//             airports = JSON.parse(data).filter(a => a.status === 1 && a.size ==='large' && a.type === 'airport');
//         } catch (exc) {
//             next();
//         }
//
//         res.json(airports);
//     });
// });

// router.get('/get_random_airport', (req, res, next) => {
//     fs.readFile('./src/randomair/airports.json', (error, data) => {
//         if(error)
//             res.sendStatus(500);
//
//         let airports;
//         try {
//             airports = JSON.parse(data).filter(a => a.status === 1 && a.size ==='large' && a.type === 'airport');
//         } catch (exc) {
//             console.log(exc);
//             next();
//         }
//
//         const length = airports.length;
//         const randNum = Math.floor(Math.random() * length + 1);
//         let airport = airports[randNum];
//
//         let googleMapsApi = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';
//         googleMapsApi += airport.lat + ',';
//         googleMapsApi += airport.lon + '&sensor=true';
//
//         axios.get(googleMapsApi).then(resp => {
//             let formattedCity;
//             const results = resp.data.results;
//             const addressComponent = results[results.length - 2 < 0 ? results.length - 1 : results.length - 2];
//             formattedCity = addressComponent.formatted_address;
//
//             airport.city = formattedCity;
//             res.json(airport);
//         }).catch(error => {
//             console.log(error);
//             next();
//         });
//     });
// });

const makeId = () => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

router.get('/get_random_city', (req, res, next) => {
    var metroCities = cities.filter(city => {
        return city.population >= 3000000
    });
    var randomIndex = Math.floor(Math.random() * metroCities.length);
    var randomCity = metroCities[randomIndex];
    var country = cc.find({alpha2: randomCity.country});
    res.send({
        name: randomCity.name,
        country: country.name,
        lat: randomCity.lat,
        lon: randomCity.lon
    });
});

router.get('/get_photo_from_city/:city', (req, res, next) => {
   //url: https://www.googleapis.com/customsearch/v1?q=paris&cx=002819391618178855590%3Awo3clxseqa4&fileType=jpg&imgSize=huge&imgType=photo&searchType=image&key=AIzaSyDOifOrADrJ_AjlvZtRuyjdZMGhow584Os

    //step 1, get city from req parameter
    const city = req.params.city;

    //step 2, query google image search
    let url = "https://www.googleapis.com/customsearch/v1?q=";
    url += city + ' landmark'; //the city parameter
    url += "&cx=002819391618178855590%3Awo3clxseqa4&fileType=jpg&imgSize=xxlarge&imgType=photo&searchType=image&key=AIzaSyDOifOrADrJ_AjlvZtRuyjdZMGhow584Os";

    //step 3, get images object from query result
    axios.get(url).then(response => {
        if(response.data.items) {
            let fileName = makeId();

            for(let i = 0; i < response.data.items.length; i++) {
                let image = response.data.items[i];
                fileName += image.link.substr(image.link.length - 4);

                if(image.image.width >= 1200) {
                    imageDownloader({
                        url: image.link,
                        dest: path.join(__dirname, '../public/img/' + fileName),
                        done: (err, file, img) => {
                            res.send(fileName);
                        }
                    });
                    break;
                }
            }
        }
    }).catch(error => {
        console.log(error);
        next(error);
    });

    // const url2 = 'https://i.ytimg.com/vi/rti8NlhcKSY/maxresdefault.jpg';
    // imageDownloader({
    //     url: url2,
    //     dest: path.join(__dirname, '../public/img/' + makeId() + url2.substr(url2.length - 4)),
    //     done: (err, filename, image) => {
    //         console.log(err);
    //         console.log(filename);
    //         console.log(image);
    //         res.send(filename);
    //     }
    // });
});

module.exports = router;