const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
var bodyParser = require('body-parser')
const {checkAuth} = require('./src/middleware/checkAuth');

const User = require("./src/models/user");
const Color = require("./src/models/color");

const home = require('./src/routes/home');



mongoose.connect('mongodb://localhost:27017/delta-onsite3', {
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



app.use(express.urlencoded({ extended: false }));
// app.use(methodOverride('_method'));
app.use(bodyParser.json())
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use(home);

app.post('/save' ,checkAuth,async(req,res)=>{
    const colors1 = new Color(req.body);
    await colors1.save();
    const user = await User.findById(req.body.owner);
    user.colorPalette = user.colorPalette.concat(colors1._id);
    await user.save({});
    res.end();
})

app.post('/edit',async(req,res)=>{
    const colorPal = await Color.findById(req.body.colorId);
    colorPal.colors = req.body.colors;
    await colorPal.save();
    console.log(colorPal)
    res.end();
})

app.listen(3030, () => {
    console.log('Listening on port 3030');
})
