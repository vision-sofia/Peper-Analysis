const fs = require('fs')
const transformation = require('transform-coordinates')
 
const transform = transformation('EPSG:3857', 'EPSG:4326')
 
fs.readFile('../parsed_data/KVARTALITE.geojson', "utf8", (err,data)=>{
    let obj = JSON.parse(data)
    let result = []
    obj.features.map((feature)=>{
        //console.log(feature.properties.RegName)
        var res = feature.geometry.coordinates[0][0].map( e => transform.forward([e[0], e[1]]))
        feature.geometry.coordinates = [[res]]
        feature.properties.weight = "";
        //console.log(feature);
        //console.log(feature.geometry.coordinates[0][0])
    })
    console.log(JSON.stringify(obj)) 
})
