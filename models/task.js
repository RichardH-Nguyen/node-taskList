var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

//define schema
var taskSchema = new Schema({
    local: {
        username: String,
        password: String
    },
    tasks: {
        text: String,
        completed: Boolean,
        dateCreated: Date,
        dateCompleted: Date
    }
});

taskSchema.methods.generateHash = function (password) {
    //Generate salted Hash of plaintext password
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

taskSchema.methods.validPassword = function(password){

    //Create hash of password entered, compare, to stored hash.
    return bcrypt.compareSync(password, this.local.password);
};

//compile taskSchema description into a mongoose model
//with the name 'Task'
var Task = mongoose.model('Task', taskSchema);

//export the Task model
module.exports = Task;