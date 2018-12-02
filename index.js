const express = require('express') 
const app = require('express')()
const port = 3000
const parse = require('csv-parse')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs')
const python_shell = require('python-shell').PythonShell

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html');
})
io.on('connection', function(socket) {  
    console.log("client connected");
    socket.on('map-loaded', function() {
        socket.emit('intiPolygon', JSON.parse(fs.readFileSync(`./parsed_data/text5.geojson`, 'utf-8')))
    })
    socket.on('polygon-change', function(id) {
        socket.emit('setGsonData', JSON.parse(fs.readFileSync(`./parsed_data/${id}.json`,'utf-8')))
        console.log("zdr");
    })
    socket.on('request_analysis', (string)=>{
        python_shell.run('./data-analysis/search.py', {args: [string]}, function (err,res) {
            if (err) throw err;
            console.log(res);
        });
    })
});
http.listen(port, function(){
    console.log('listening on *:3000');
});