// packages
var express     = require("express");
var app         = express();
var port        = process.env.PORT || 8080;
var morgan      = require("morgan");
var mongoose    = require("mongoose");
var bodyParser  = require('body-parser');
var userRoute   = require("./app/routes/user.route");
var path        = require('path');

// middleware

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

// routes

app.use('/users', userRoute);

// server port

app.listen(port, function() {
    console.log('Running the server on port ' + port);
});