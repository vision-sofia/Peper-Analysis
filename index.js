const express = require('express') 
const app = require('express')()
const port = 3000
const parse = require('csv-parse')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs')
const spawn = require("child_process").spawn;
const path = require('path');


app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html');
})
io.on('connection', function(socket) {  
    console.log("client connected");
    socket.emit('intiPolygon', JSON.parse(fs.readFileSync(`./parsed_data/text5.geojson`, 'utf-8')))
    socket.on('heatmap-change', function(id) {
        socket.emit('setData', JSON.parse(fs.readFileSync(`./parsed_data/${id}.json`,'utf-8')))
    })
    socket.on('polygon-change', function(id) {
        socket.emit('setGsonData', JSON.parse(fs.readFileSync(`./parsed_data/${id}.json`,'utf-8')))
        console.log("zdr");
    })
    socket.on('request_analysis', (string)=>{
        // console.log("in");

        var process = spawn('/Users/victor/.local/share/virtualenvs/Peper-Analysis-eBzTI8A5/bin/python',
        [path.join(__dirname, "./data-analysis/search.py"), string])

        process.stdout.on('data', function (data) {
            console.log(data.toString())
        });
    })
});
http.listen(port, function(){
    console.log('listening on *:3000');
});