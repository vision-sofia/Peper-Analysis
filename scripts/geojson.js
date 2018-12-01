const fs = require('fs')
const transformation = require('transform-coordinates')
 
const transform = transformation('EPSG:32634', 'EPSG:4326') // WGS 84 to Soldner Berlin
 
fs.readFile('../data/kvartalite.json', "utf8", (err,data)=>{
    let obj = JSON.parse(data)
    let result = []
    obj.features.map((feature)=>{
        let transformed = transform.forward({x: feature.properties.X, y: feature.properties.Y})
        let cutFeature = {}
        cutFeature.lat = transformed.y
        cutFeature.lng =  transformed.x
        cutFeature.weight = feature.properties.Broi_Lica / feature.properties.Area_m2
        result.push(cutFeature)
    })
    console.log(JSON.stringify(result)) 
})
