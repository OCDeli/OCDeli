var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var titlize  = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'name must be atleast 3 characters, max 20, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'is not valid e-mail'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'username must contain letters and numbers only'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'password needs to have atleast one lowercase, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var userSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        validate: nameValidator 
    },
    username: { 
        type: String, 
        lowercase: true, 
        required: true, 
        unique: true,
        validate: usernameValidator 
    },
    password: { 
        type: String, 
        required: true,
        validate: passwordValidator 
    },
    email: { 
        type: String, 
        requried: true, 
        unique: true,
        validate: emailValidator 
    }
});

userSchema
    .pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    })
});

userSchema
    .plugin(titlize, {
        paths: [ 'name' ]
    });

userSchema
    .methods
    .comparePassword = function(password) {
        return bcrypt
            .compareSync(password, this.password);
    };


module.exports = mongoose.model('user', userSchema);


