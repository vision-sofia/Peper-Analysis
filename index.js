
const express = require('express') 
const app = require('express')()
const port = 3000
const parse = require('csv-parse')
const fs = require('fs')
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html');
})
io.on('connection', function(client) {  
    console.log("client connected");
    client.on('heatmap-change', function(data) {
        console.log("zdr")
        io.emit('setData', [data]);
    })
});
http.listen(port, function(){
    console.log('listening on *:3000');
});