const fs = require('fs')
const transformation = require('transform-coordinates')
 
const transform = transformation('EPSG:32634', 'EPSG:4326') // WGS 84 to Soldner Berlin
 
fs.readFile('../data/kvartalite.json', "utf8", (err,data)=>{
     let obj = JSON.parse(data)
     let people = 0
     obj.features.map((feature)=>{
        
        let transformed = transform.forward({x: feature.properties.X, y: feature.properties.Y})
        console.log(`{location: new google.maps.LatLng(${transformed.y},${transformed.x}), weight: ${feature.properties.Broi_Lica / feature.properties.Area_m2}},`)
     })
    
 })
