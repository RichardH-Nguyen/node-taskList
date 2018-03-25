var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//define schema
var taskSchema = new Schema({
    text: String,
    completed: Boolean
});

//compile taskSchema description into a mongoose model
//with the name 'Task'
var Task = mongoose.model('Task', taskSchema);

//export the Task model
module.exports = Task;