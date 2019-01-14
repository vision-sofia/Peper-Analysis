const express = require('express');
const app = require('express')();
const port = 3000;

const http = require('http').Server(app);
const io = require('socket.io')(http);

const fs = require('fs');
const inside = require('point-in-geopolygon');
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const spawn = require("child_process").spawn;
let pathToPython = '';


app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', function(socket) {  
    console.log("client connected");

    socket.on('map-loaded', function() {
        socket.emit('intiPolygon', JSON.parse(fs.readFileSync(`./parsed_data/text5.geojson`, 'utf-8')))
    });

    socket.on('polygon-change', function(id) {
        socket.emit('setGsonData', JSON.parse(fs.readFileSync(`./parsed_data/${id}.json`,'utf-8')))
        console.log("zdr");
    });

    socket.on('request_analysis', (string)=>{
        var process = spawn(pathToPython, [path.join(__dirname, "./data-analysis/search.py"), string]);
        let input = '';

        process.on('close', (code) => {
            let result = {}
            let counter = {}
            let max = (n , m)  => {return n > m ? n : m}
            let geoJson = JSON.parse(fs.readFileSync('./parsed_data/text5.geojson', 'utf-8'))
            let points = JSON.parse(input.toString())
            let c_max = -1 

            for(let feature of geoJson.features){
                for(let point of points){
                    if(feature.geometry){
                        if(inside.polygon(feature.geometry.coordinates[0], [point.lng,point.lat])){
                            
                            if(result[feature.properties.RegName]){
                                result[feature.properties.RegName] = result[feature.properties.RegName]+point.weight
                                counter[feature.properties.RegName]++
                            }else{
                                result[feature.properties.RegName] = point.weight
                                counter[feature.properties.RegName] = 0
                            }
                            //c_max = max(result[feature.properties.RegName],c_max)
                            //console.log([point.lng,point.lat] + " is in " + feature.properties.RegName)
                        }
                    }else{
                        //console.log(feature)
                    }
                }

            }

            for(let el in result) {
                c_max = max((counter[el] == 0 ? 0 : result[el] / counter[el]), c_max)
            }
            for(let el in result) {
                result[el] /= (c_max * counter[el])
            }
            socket.emit('setGsonData', result)
        });

        process.stdout.on('data', function (data) {
            input += data.toString()
        });

    });
});

http.listen(port, function(){
    pathToPython = process.argv[2];
    console.log("Path to python executable:", pathToPython);
    console.log('listening on *:3000');
});
