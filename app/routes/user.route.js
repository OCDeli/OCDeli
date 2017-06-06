var express = require('express');
var router = express.Router();
var user = require('../models/user');

router
    .post('/', createUser);


///////

function createUser (req, res) {
    var u = new user ();
    u.username = req.body.username;
    u.password = req.body.password;
    u.email = req.body.email;
    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
        res.send('Make sure username, email and password are provided');
    } else {
        u.save(function(err) {
            if (err) {
                res.send('username or email already exists');
            } else {
                res.send('user created');
            }
        });
    }
}


module.exports = router;