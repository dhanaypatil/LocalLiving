const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup = async (req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUSER = await User.register(newUser, password);
        console.log(registeredUSER);
        req.login(registeredUSER, (err)=>{
            if(err){
                return next();
            }
            req.flash("success", "user registration successful!");
            res.redirect("/listings");
        });
    }catch(err){
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signup"); //this is why we used try catch, so our user isnt thrown out of the sign up page if the username already exists and they can try another username
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login = async (req,res)=>{
    req.flash("success", "welcome to wanderlust! you're logged in"); 
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next();
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};