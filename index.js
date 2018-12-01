
const express = require('express') 
const app = require('express')()
const port = 3000
const parse = require('csv-parse')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs')


app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html');
})
io.on('connection', function(socket) {  
    console.log("client connected");
    socket.on('heatmap-change', function(id) {
        socket.emit('setData', JSON.parse(fs.readFileSync(`./parsed_data/${id}.json`,'utf-8')))
    })
    socket.on('polygon-change', function(id) {
        console.log("zdr");
        socket.emit('setGsonData', JSON.parse(fs.readFileSync(`./parsed_data/text3.geojson`, 'utf-8')))
    })
});
http.listen(port, function(){
    console.log('listening on *:3000');
});