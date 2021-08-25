const passport = require('passport');
const Member = require('../models/user');

module.exports.checkAuth = async(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
        req.flash("error", "Please Sign-in to view the page");
        res.redirect('/login');
}
