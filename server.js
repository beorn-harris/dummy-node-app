var express = require("express");
const fs = require('fs')
var app = express();

// Set the Server Port
var PORT = process.env.PORT || 8080

var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', 'localhost', port);
});

//create a function that takes a file path
function readFile(filePath) {
    return new Promise(function (resolve, reject) {
        //perform the readFile function in the fs node module
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                //reject any errors found
                reject(err)
            } else {
                //parse the file output into JSON
                data = JSON.parse(data)
                //send the data back as promise
                resolve(data)
            }
        })
    })
}

// GET STATUS ENDPOINT
app.get('/help', function (req, res) {
    res.send('Try localhost:8080/customer?fname=Elaine&lname=Rushmore')
})

app.get('/customer', function (req, res) {
    let fname = req.query.fname
    let lname = req.query.lname
    let name = fname + " " + lname
    let output = 'none'

    //read the json file for customer
    readFile('customers.json').then(function (data) {
        //loop through all the customers
        for (const customer of data) {
            //check if the customer name in the record  matches the name in the query
            if (customer.name == name) {
                //if they match, set output to be the customer data
                output = customer
            }
        }
        if (output != 'none') {
            //send the output to the client if a customer was  found
            res.send(JSON.stringify(output))
        } else {
            //send a response to the client if no customer data found
            res.send('no customer data for: ' + name)
        }
    })
})

// GET Date ENDPOINT
app.get('/date', function (req, res) {
    var utcDate = new Date()

    var day = utcDate.getDate()
    var month = utcDate.getMonth() + 1
    var year = utcDate.getFullYear()

    //Date in month-day-year format
    var todaysDate = `${month}-${day}-${year}`

    res.send(todaysDate)
})

// catch-all
app.get('/*', function (req, res) {
    res.redirect(302, '/help');
})

