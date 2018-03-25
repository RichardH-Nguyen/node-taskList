var express = require('express');
var router = express.Router();
var Task = require('../models/task');

/* GET home page. */
router.get('/', function(req, res, next) {
    //Homepage
    //listing all uncompleted tasks
  Task.find({completed: false})
      .then((docs) => {
    res.render('index', {title: 'Incomplete tasks', tasks: docs})
      })
      .catch((err) => {next(err)});
});

router.post('/add', function(req, res, next){
    //creates a new task when the add button is pushed on the homepage.
  if (req.body.text) {
      var t = new Task({text: req.body.text, completed: false});

      t.save().then((newTask) => {
          console.log('The new task created is ', newTask);
          res.redirect('/');
      }).catch(() => {
          next(err);
      });
  }
  else{
      res.redirect('/');
  }
});

router.post('/done', function(req, res, next){
    //updates individual task completed to true when done button is pushed

  Task.findByIdAndUpdate( req.body._id, {completed: true})
      .then( (originalTask) => {
        if(originalTask){
          res.redirect('/');
        }
        else{
          var err= new Error('Not Found');
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => {next(err);
      });
});

router.post('/delete', function(req, res, next){
    //deletes an individual task on the homepage
  Task.findByIdAndRemove(req.body._id)
       .then((deletedTask) => {
     if(deletedTask){
       res.redirect('/');
     }
     else{
         var err= new Error('Not Found');
         err.status = 404;
         next(err);
     }
   })
       .catch((err) => {next(err);
       });
});

router.post('/alldone', function(req, res, next){
    //updates all tasks on the home page completed key to true.
    Task.updateMany({completed: false}, {completed: true})
        .then(()=>{
      res.redirect('/')
        })
        .catch((err) => {next(err);
        });
});

router.post('/deleteDone', function(req, res, next){
    //deletes all completed tasks
    Task.deleteMany({completed: true})
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {next(err);
        });
});

router.get('/completed', function(req, res, next){
    //finds and renders all completed tasks onto the completed_task view
  Task.find({completed:true})
      .then((docs) => {
    res.render('completed_tasks', {tasks: docs });
      }).catch((err) => {next(err);
  });
});

router.get('/task/:_id', function(req, res, next){
    //creates an individual task page when clicked
  Task.findById(req.params._id)
      .then((doc) => {
    if(doc){
      res.render('task', {task: doc});
    }
    else{
      next();
    }
      })
      .catch((err) => {
    next(err);
      });
});

module.exports = router;
