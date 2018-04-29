var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


//define schema
var taskSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
    dateCreated: Date,
    dateCompleted: Date,

    _creator: {type : ObjectId, ref : 'User'}

});

var Task = mongoose.model('Task', taskSchema);

//export the Task model
module.exports = Task;