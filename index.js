var express           = require("express"),
    app               = express(),
    ejs               = require("ejs"),
    passport          = require("passport"),
    plm               = require("passport-local-mongoose"),
    mongoose          = require("mongoose"),
    LocalStrategy     = require("passport-local"),
    bodyParser        = require("body-parser"),
    flash             = require("connect-flash");



app.use(bodyParser.urlencoded({ extended: false }));

var DB_URL= "mongodb://localhost/12thapp";

mongoose.connect(DB_URL, {
  useMongoClient: true,
});



app.set("view engine","ejs");
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());


//session COOKIES
app.use(function (req, res, next) {
if (req.method == 'POST' && req.url == '/login') {
    if (req.body.remember_me) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
}
next();
});

//express session
app.use(require("express-session")({
  secret:"Secret!!! Yarkittayum Solla Koodathuu",
  resave: false,
  saveUninitialized: false
}));


//connect flash
app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// user schema
var UserSchema = mongoose.Schema({
    username: {
       type: String,
       index: true

   },
    email: {
       type: String
   },
   phonenumber: {
       type: String
   },
     password: {
        type: String,
    },
});
UserSchema.plugin(plm);

var User = mongoose.model("User", UserSchema);

// SERIALIZE AND DESERIALIZE USER
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// get routes
app.get("/",function(req,res){
  res.render("index");
})

app.get("/register",function(req,res){
  res.render("register");
})

// // post routes
app.post("/register",function(req,res){

var  username = req.body.username,
     email    = req.body.email,
     number   = req.body.number,
     password = req.body.password;


   User.register(new User({
       username: username,
       email: email,
       phonenumber: number
      }),
      req.body.password,function(err,user){
        if(err){
          req.flash('error',err.message);
          res.redirect("/register");
          console.log(err);
        }else{
      passport.authenticate("local")(req,res,function(){
         console.log(user);
          req.flash('success','You are Registered and now can LogIn');
          res.redirect("/");

             });
          }
});
});



app.listen(8080,()=>{
  console.log("server started at port 8080")
})
