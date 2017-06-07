var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs')

var userSchema = new Schema({
    username: { 
        type: String, 
        lowercase: true, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        requried: true, 
        lowercase: true, 
        unique: true 
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
    .methods
    .comparePassword = function(password) {
        return bcrypt
            .compareSync(password, this.password);
    };


module.exports = mongoose.model('user', userSchema);


