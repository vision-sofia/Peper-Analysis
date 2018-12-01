const parse = require('csv-parse')
const fs = require('fs')

fs.readFile('./Multisport - Places.csv', "utf8", (err,data)=>{
    parse(data,{cast: true}, (err,records)=>{
        records.map((row)=>{console.log('new google.maps.LatLng('+row[4]+'),')})
    })
})