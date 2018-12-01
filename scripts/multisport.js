const parse = require('csv-parse')
const fs = require('fs')

fs.readFile('./Multisport - Places.csv', "utf8", (err,data)=>{
    parse(data,{cast: true}, (err,records)=>{
        let result = []
        records.map((row)=>{result.push({'lat':row[4].split(',')[0],'lng': row[4].split(',')[1],'weight':1})});
        console.log(JSON.stringify(result))
    })
})