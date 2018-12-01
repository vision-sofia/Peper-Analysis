const fs = require('fs')
const transformation = require('transform-coordinates')
 
const transform = transformation('EPSG:3857', 'EPSG:4326')
const transform2 = transformation('EPSG:32634', 'EPSG:4326')
fs.readFile('../parsed_data/KVARTALITE.geojson', "utf8", (err,data)=>{
    let obj = JSON.parse(data)
    let result = []
    obj.features.map((feature)=>{
        //console.log(feature.properties.RegName)
        var res = feature.geometry.coordinates[0][0].map( e => transform.forward([e[0], e[1]]))
        let transformed = transform2.forward({x: feature.properties.X, y: feature.properties.Y})
        feature.geometry.coordinates = [[res]]
        feature.properties.weight = "";
        feature.properties.X = transformed.y;
        feature.properties.Y = transformed.x;
        //console.log(feature);
        //console.log(feature.geometry.coordinates[0][0])
    })
    console.log(JSON.stringify(obj)) 
})
