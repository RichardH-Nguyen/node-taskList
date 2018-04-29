var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    local: {
        username: String,
        password: String
    }
});

userSchema.methods.generateHash = function (password) {
    //Generate salted Hash of plaintext password
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password){

    //Create hash of password entered, compare, to stored hash.
    return bcrypt.compareSync(password, this.local.password);
};

//compile taskSchema description into a mongoose model
//with the name 'Task'
var User = mongoose.model('User', userSchema);

module.exports = User;