var express = require('express');
var router  = express.Router();
var user    = require('../models/user');
var jwt     = require('jsonwebtoken');
var secret  = 'overwatch';

router
    // http://localhost:8080/api/users
    .post('/users', createUser)
    // http://localhost:8080/api/authenticate
    .post('/authenticate', authenticate)
    // http://localhost:8080/api/currentuser
    .use(decryptToken)
    .post('/currentuser', currentUser)


///////

function createUser(req, res) {
    var u = new user ();
    u.username = req.body.username;
    u.password = req.body.password;
    u.email = req.body.email;
    u.name = req.body.name;
    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == '') {
        res.json({ success: false, message: 'make sure username, email and password are provided' });
    } else {
        u.save(function(err) {
            if (err) {
                // check for validation
                if (err.errors != null) {
                    if (err.errors.name) {
                        res.json({ success: false, message: err.errors.name.message });
                    } else if (err.errors.email) {
                        res.json({ success: false, message: err.errors.email.message });
                    } else if (err.errors.username) {
                        res.json({ success: false, message: err.errors.username.message });
                    } else if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message });
                    } else {
                        res.json({ success: false, message: err});
                    }
                // if not validation error
                // check for duplication
                } else if (err) {
                    if (err.code == 11000) {
                        if (err.errmsg[61] == "u") {
                            res.json({ success: false, message: 'that username already exists' });
                        } else if (err.errmsg[61] == "e") {
                            res.json({success: false, message: 'that email already exists'});
                        }
                    } else {
                        res.json({ success: false, message: err });
                    }
                }
            } else {
                res.json({ success: true, message: 'user created' });
            }
        });
    }
};

function authenticate(req, res) {
    user
        .findOne({ username: req.body.username })
        .select('email username password')
        .exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'could not authenticate user' });
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({ success: false, message: 'no password provided' })
                }
                if (!validPassword) {
                    res.json({ success: false, message: 'could not authenticate password' });
                } else {
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn: '24h' });
                    res.json({ success: true, message: 'user authenticated', token: token });
                }
            }
        });
};

function decryptToken(req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if (token) {
        // verify token
        jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'token invalid'})
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
    } else {
        res.json({ success: false, message: 'no token provided' })
    }
};

function currentUser(req, res) {
    res.send(req.decoded);
};


module.exports = router;