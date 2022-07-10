const express = require("express");
const Student = require("../models/Student");
const fetch = require("node-fetch");
const { json } = require("express");
const logger = require("pino")({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

const open_charge_map_Route = express.Router();

const AddressKeys = ["ID", "Title", "AddressLine1", "Latitude", "Longitude"];
// Başka işe yarayabilecek datalar: Distance


open_charge_map_Route.route('/').get(async (req, res, next) =>{

    const latitude = req.query.lat
    const longitude = req.query.lon
    const range = req.query.range

    if(latitude === undefined || longitude === undefined || range === undefined){
        return res.status(404).send("lokasyonu yanlis verdin bamcik");
    }

    url = `https://api.openchargemap.io/v3/poi?key=acac6e76-5a70-40f4-9182-593a25802fb2&latitude=${latitude}&longitude=${longitude}&distance=${range}&distanceunit=km`

    const returnJson = [];
    const response = await fetch(url,{"method": "GET"})
    .then( res => res.json())
    .then( json => {
        json.forEach(station => {
        const address_info = station.AddressInfo;
        const result_station = Object.fromEntries(Object.entries(address_info).filter(([key]) => AddressKeys.includes(key)));
        const connection_type = {"connection_type" : station.Connections[0].ConnectionType.Title}
        const is_fast_charge = {"is_fast_charge" :station.Connections[0].Level.IsFastChargeCapable}
        returnJson.push(Object.assign(result_station, connection_type, is_fast_charge));
        });
    }); 

    return res.status(200).json(returnJson);
    
});

module.exports = open_charge_map_Route;