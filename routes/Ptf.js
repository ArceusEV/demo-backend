const express = require("express");
const Student = require("../models/Student");
const fetch = require("node-fetch");
const fs = require('fs');
const csv = require('csv-parser');
const logger = require("pino")({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
const ptf = express.Router();


ptf.route('/').get(async (req, res, next) =>{

    let ptfs = [];

    const cheapHours = [];

    const avgs = [];

    fs.createReadStream("ptf/PTF-19092022-25092022.csv")
        .pipe(csv()).on('data', function(data){
            ptfs.push(data);
        }).on('end', function(){

            let sum = 0;

            ptfs.forEach((data) =>{
                sum += parseFloat(data['PTF (TL/MWh)']);
                if(data['Saat'] === '23:00'){
                    avgs.push({
                        date: data['Tarih'],
                        avg: sum / 24
                    });
                    sum = 0;
                }
            });

            avgs.forEach((avg) =>{
                ptfs.forEach((ptf) => {
                    if(ptf['Tarih'] === avg['date'] && parseFloat(ptf['PTF (TL/MWh)']) <= avg['avg']){
                        cheapHours.push({
                            date: ptf['Tarih'],
                            hour: ptf['Saat']
                        });
                    }
                });
            });

            logger.info(avgs);
            logger.info(cheapHours);

            return res.status(200).json(cheapHours);
        })
});

module.exports = ptf;