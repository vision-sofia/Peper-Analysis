var inside = require('point-in-geopolygon');
const fs = require('fs')
let result = {}
let max = (n , m)  => {return n > m ? n : m}
let geoJson = JSON.parse(fs.readFileSync('../parsed_data/text5.geojson', 'utf-8'))
let points = JSON.parse(fs.readFileSync('../parsed_data/airbnb.json', 'utf-8'))
let c_max = -1 
for(let feature of geoJson.features){
    for(let point of points){
        if(feature.geometry){
            if(inside.polygon(feature.geometry.coordinates[0], [point.lng,point.lat])){
                if(result[feature.properties.RegName]){
                    result[feature.properties.RegName] = result[feature.properties.RegName]+point.weight
                }else{
                    result[feature.properties.RegName] = point.weight
                }
                c_max = max(result[feature.properties.RegName],c_max)
                //console.log([point.lng,point.lat] + " is in " + feature.properties.RegName)
            }
        }else{
            //console.log(feature)
        }
    }

}
for(let el in result) {
    result[el] /= c_max
}
console.log(JSON.stringify(result))