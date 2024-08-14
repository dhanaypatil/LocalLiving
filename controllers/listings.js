const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user); //passport does this by default, ie stores the user in req
    res.render("listings/new.ejs");
}; 
module.exports.createListing = async (req,res)=>{
    // let {title, description, image, price, country, location} = req.body;
    //rather create obj key value pairs in the new form names and..
    
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
    
    let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        newListing.geometry = response.body.features[0].geometry;

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url, filename};
    };

    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing doesn't exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    // console.log(typeof listing.image.url);
    // console.log(originalImageUrl);
    originalImageUrl = originalImageUrl.replace("upload", "upload/h_200,w_250/"); //changes to the image with the cloudinary api
    // console.log(originalImageUrl);
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    // //authorisation logic to give access to only the valid user and someone cannot bypass through api req, we'll make it a middleware, that'll be better
    // let listing = Listing.findById(id);
    // if(!currUser && listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstruct and pass 

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }; //so if we didn't update the image, we will have the past image saved and not pass undefined data

    req.flash("success", "Listing Updated");  
    res.redirect(`/listings/${id}`);
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path: "author",}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing doesn't exist!");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted.");
    res.redirect("/listings");
};