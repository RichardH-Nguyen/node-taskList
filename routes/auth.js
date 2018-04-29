var express = require('express');
var passport = require('passport');

var router = express.Router();

/* GET authentication page. */
router.get('/', function (req, res, next){
    res.render('authentication')
});

/* POST login page. */
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
}));

/* POST signup page. */
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
}));

/* GET logout page. */
router.get('/logout', function (req, res, next){
    req.logout();
    res.redirect('/')
});

module.exports = router;