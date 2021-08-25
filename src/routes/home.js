const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const {checkAuth} =require('../middleware/checkAuth');


router.get('/' ,async(req,res)=>{
    res.redirect('/register')
})

router.get('/register', async(req, res) => {
    try{
        res.render('register');
    }
    catch (err) {
        req.flash("error", "Unable to get register page");
        res.redirect("/register");
        console.log(err);
    }
});
router.post('/register' , async(req,res,next)=>{
    try{
    const { email, username, password  , gender ,age} = req.body;
    const user = new User({ email, username  , gender , age});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash('success',"Successfully Registered");
    res.redirect('login'); 
   
    }
    catch(err){
        console.log(err);
    if (err.message == "A user with the given username is already registered") {
            req.flash("error", "Name is already in use");
    }
    else if (err.keyValue.email) {
      req.flash("error", "Email is already in use");
    } else if (err.keyValue.username) {
      req.flash("error", "Name is already in use");
    } else {
      req.flash("error", "Sorry! Unable to register");
    }
    res.redirect("/register");
  }   
})




router.get('/login', async(req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {failureFlash : true, failureRedirect: '/login'}), async (req, res) => { 
    n = req.user.username;
    res.redirect('/home');
});

router.get('/home' , checkAuth ,async(req,res)=>{
    res.send("hi");
})



router.get('/logout',async(req,res)=>{
    req.logout();
    req.flash('success',"Successfully Logged Out");
    res.redirect('login');
})
module.exports = router;