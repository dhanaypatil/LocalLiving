if(process.env.NODE_ENV != "production"){
    require("dotenv").config(); 
}
//this is such that we only access env in dev mode and not in production mode, cz that will lead us to loose our credentials to the public
// console.log(process.env); // process.env is to access env

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const mongoURL = "mongodb://127.0.0.1:27017/wanderlust";
const DB_URL = process.env.ATLASDB_URL;

async function main(){
    mongoose.connect(DB_URL);
};
main()
    .then(()=>{
    console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("__method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET,    
    },
    touchAfter: 24*3600
});

store.on("error", ()=>{
    console.log(`ERROR due to MONGO SERVER ${err}`);
});

const sessionOptions = {
    store,
    secret: "oursupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    },
};

// app.get("/", (req,res)=>{
//     res.send("Hi, I'm root");
// });

app.use(session(sessionOptions));
app.use(flash()); //use it before the routes or else won't work

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // it is to use static method of model in LocalStrategy

passport.serializeUser(User.serializeUser()); //to serialize(store) user in our session
passport.deserializeUser(User.deserializeUser()); //to deserialize(unstore/remove) user in our session
//above used to be a long written code  from scratch to authenticate user sign-in this passport package helps us to save the work of writing those line of code

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
});

// app.get("/demo", async(req,res)=>{
//     let fakeUser = new User({
//         email:"dhny@gmail.com",
//         username: "dhny"
//     });
//     let registeredUSER =await User.register(fakeUser, "hello");
//     res.send(registeredUSER);
// });

//listings route
app.use("/listings", listingsRouter);

//Reviews
app.use("/listings/:id/reviews", reviewsRouter);

//Users
app.use("/", userRouter);


// app.get("/testlisting", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "sample Villa",
//         description: "cerca la playa",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("test succesful");
// });

app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
    let {status=500, message} = err;
    res.status(status).render("listings/error.ejs", {message});
});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});