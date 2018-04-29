var express = require('express');
var router = express.Router();
var Task = require('../models/task.js');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        res.locals.username = req.user.local.username;
        next();
    }
    else {
        res.redirect('/auth')
    }
}

router.use(isLoggedIn);

/* GET home page. */
router.get('/', function(req, res, next) {
    //listing all uncompleted tasks
  Task.find({_creator : req.user, completed: false})
      .then((docs) => {
    res.render('index', {title: 'Incomplete tasks', tasks: docs})
      })
      .catch((err) => {next(err)});
});



router.post('/add', function(req, res, next){
    //creates a new task when the add button is pushed on the homepage.
  if (!req.body || !req.body.text){
      req.flash('error', 'Please enter a task.');
      res.redirect('/');
  }
  else {
      var t = new Task({ _creator: req.user, text: req.body.text, completed: false, dateCreated:new Date()});

      t.save().then((newTask) => {
          console.log('The new task created is ', newTask);
          res.redirect('/');
      }).catch(() => {
          next(err);
      });
  }
});

router.post('/done', function(req, res, next){
    //updates individual task completed to true when done button is pushed

  Task.findByIdAndUpdate( {_id: req.body._id, _creator: req.user.id}, {completed: true, dateCompleted:new Date()})
      .then( (originalTask) => {
        if(originalTask){
            res.status(403).send('This is not your task!')
        }
        else{
          req.flash('info', 'Task marked as done');
          res.redirect('/')
        }
      })
      .catch((err) => {next(err);
      });
});

router.post('/delete', function(req, res, next){
    //deletes an individual task on the homepage
  Task.findByIdAndRemove({_id: req.body._id, _creator: req.user.id})
       .then((deletedTask) => {
           if(deletedTask){
               res.status(403).send('This is not your task!')
           }
           else{
               req.flash('info', 'Task deleted');
               res.redirect('/')
           }
       })
      .catch((err) => {next(err);
      });
});

router.post('/alldone', function(req, res, next){
    //updates all tasks on the home page completed key to true.
    Task.updateMany({_creator: req.user, completed: false}, {completed: true}, {multi: true})
        .then(()=>{
        req.flash('info', 'All tasks are done!');
      res.redirect('/')
        })
        .catch((err) => {next(err);
        });
});

router.post('/deleteDone', function(req, res, next){
    //deletes all completed tasks
    Task.deleteMany({_creator: req.user, completed: true})
        .then(() => {
            req.flash('info', 'All completed tasks deleted');
            res.redirect('/')
        })
        .catch((err) => {next(err);
        });
});

router.get('/completed', function(req, res, next){
    //finds and renders all completed tasks onto the completed_task view
  Task.find({creator: req.user._id, completed:true})
      .then((docs) => {
    res.render('completed_tasks', {tasks: docs });
      }).catch((err) => {next(err);
  });
});

router.get('/task/:_id', function(req, res, next){
    //creates an individual task page when clicked
  Task.findById(req.params._id)
      .then((doc) => {
    if(!doc){
        res.status(404).send('Task not found.');
    }
    else if(!doc._creator.equals(req.user._id)){
        res.status(403).send('This is not your task!');
    }
    else{
        res.render('task', {task: doc});
    }

      })
      .catch((err) => {
    next(err);
      });
});


module.exports = router;
