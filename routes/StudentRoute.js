const express = require("express");
const Student = require("../models/Student");
const fetch = require("node-fetch");
const logger = require("pino")({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
const studentRoute = express.Router();

const neededKeys = ["arrival_dist", "arrival_duration", "arrival_perc",
    "charge_cost", "charge_duration", "charge_energy", "charge_profile", "charger",
    "lat", "lon", "name", "rezervationStatus"];

studentRoute.route('/').get(async (req, res, next) =>{

    const response = await fetch("https://api.iternio.com/1/plan", {
        "headers": {
            "accept": "application/json, text/plain, /",
            "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            "authorization": "APIKEY f4128c06-5e39-4852-95f9-3286712a9f3a",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://abetterrouteplanner.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{\"find_alts\":true,\"destinations\":[{\"is_my_pos\":false,\"address\":\"Kayseri, Turkey\",\"lat\":38.7209,\"lon\":35.48352,\"type\":0}," +
            "{\"is_my_pos\":false,\"address\":\"Istanbul, Turkey\",\"lat\":41.06201,\"lon\":28.98877,\"type\":0}],\"car_model\":\"nissan:leaf:19:62:eplus\"," +
            "\"amenity_offset\":0,\"vehicle_id\":null,\"vehicle_config\":null,\"ref_consumption\":184,\"fast_chargers\":[\"chademo\"],\"find_amenity_alts\":false," +
            "\"charge_cards\":[],\"currency\":\"TRY\",\"initial_soc_perc\":90,\"charger_soc_perc\":10,\"charger_max_soc_perc\":100,\"arrival_soc_perc\":10," +
            "\"charge_overhead\":300,\"adjust_speed\":true,\"realtime_traffic\":false,\"speed_factor_perc\":100,\"max_speed\":130,\"allow_ferry\":true," +
            "\"allow_motorway\":true,\"allow_toll\":true,\"allow_border\":true,\"wind_speed\":0,\"wind_dir\":\"head\",\"road_condition\":\"normal\",\"extra_weight" +
            "\":0,\"outside_temp\":20,\"initial_vehicle_temp\":20,\"battery_degradation_perc\":5,\"network_preferences\":{},\"realtime_weather\":false,\"realtime_chargers" +
            "\":false,\"client\":\"abrp-web\",\"session_id\":\"1e7fd56f0ebbd8af69e7aa7eac67b9d1c0b5dfc9c9609ec\",\"charge_stops\":\"optimal\"," +
            "\"preferred_minimum_charger_stalls\":1,\"units\":\"metric\"}",
        "method": "POST"
    });

    const data = await response.json();

    const steps = data.result.routes[0]['steps'];

    const returnJson = [];

    steps.forEach(step => {
        returnJson.push(Object.fromEntries(Object.entries(step).filter(
            ([key]) => neededKeys.includes(key))));
    });

    return res.status(200).json(returnJson);
})

module.exports = studentRoute;