const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const Color = require("../models/color");
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
    res.render('home' ,{n:req.user});
})


// router.post('/save' , checkAuth, async(req,res)=>{
//     const { v1,v2,v3,v4,v5,v6,v7} = req.body;
//     const color = new Color({ v1,v2,v3,v4,v5 ,v6,v7, owner:req.user});
//     await color.save();
//     console.log(color);
//     console.log(req.body);
//     res.redirect('/home');
// })
router.get('/dashboard' , checkAuth , async(req,res)=>{
    colors = await Color.find({ owner : req.user}).populate('owner')
    res.render('dashboard' , {colors});
})
router.get('/show/:id',checkAuth,async(req,res)=>{
    const eachcolor = await Color.findById(req.params.id)
    res.render('each' , { eachcolor })
})
router.get('/delete/:id',checkAuth,async(req,res)=>{
    await Color.findByIdAndDelete(req.params.id)
    res.redirect('/home');
    //res.render('each' , { eachcolor })
})
router.get('/edit/:id',checkAuth,async(req,res)=>{
    const eachcolor = await Color.findById(req.params.id)
    res.render('edit' , { eachcolor ,n:req.user })
    
})
router.get('/makeOwn' , checkAuth , async(req,res)=>{
    res.render('mine', {n:req.user});
})
router.get('/logout',async(req,res)=>{
    req.logout();
    req.flash('success',"Successfully Logged Out");
    res.redirect('login');
})
module.exports = router;