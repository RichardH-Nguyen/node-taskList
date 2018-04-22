var express = require('express');
var router = express.Router();
var Task = require('../models/task');

/* GET home page. */
router.get('/', function(req, res, next) {
    //Homepage
    //listing all uncompleted tasks
  Task.tasks.find({completed: false})
      .then((docs) => {
    res.render('index', {title: 'Incomplete tasks', tasks: docs})
      })
      .catch((err) => {next(err)});
});

/* GET login page. */
router.get('/login', function (res, req, next) {
    res.redirect('login');
});

/* GET signup page. */
router.get('/signup', function (res, req, next) {
    res.redirect('signup');
});

/* POST login page. */
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/secret',
    failureRedirect: '/login',
    failureFlash: true
}));

/* POST signup page. */
router.post('/signup', passport.authenticate('local-login', {
    successRedirect: '/secret',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/add', function(req, res, next){
    //creates a new task when the add button is pushed on the homepage.
  if (req.body.text) {
      var t = new Task({text: req.body.text, completed: false, dateCreated:new Date()});

      t.save().then((newTask) => {
          console.log('The new task created is ', newTask);
          res.redirect('/');
      }).catch(() => {
          next(err);
      });
  }
  else{
      req.flash('error', 'Please enter a task.');
      res.redirect('/');
  }
});

router.post('/done', function(req, res, next){
    //updates individual task completed to true when done button is pushed

  Task.findByIdAndUpdate( req.body._id, {completed: true, dateCompleted:new Date()})
      .then( (originalTask) => {
        if(originalTask){
            req.flash('info', originalTask.text + ' marked as done!');
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
         req.flash('info','Task deleted');
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
        req.flash('info', 'All tasks are done!');
      res.redirect('/')
        })
        .catch((err) => {next(err);
        });
});

router.post('/deleteDone', function(req, res, next){
    //deletes all completed tasks
    Task.deleteMany({completed: true})
        .then(() => {
            req.flash('info', 'All completed tasks deleted');
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

/* GET secret page*/
router.get('/secret', isLoggedIn, function (req,res,next){

    var user = req.task.local;

    res.render('secret', {
        username : user.username
    });

});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/login');
    }
}

module.exports = router;
