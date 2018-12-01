const express = require('express')
const app = express()
const port = 3000
const parse = require('csv-parse')
const fs = require('fs')

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html');
})
app.listen(port,()=>{
    console.log('App listening on port ' + port)
});