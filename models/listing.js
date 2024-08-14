const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
        },
        url: {
        type: String,
        //when img is undefined
        default: "https://images.unsplash.com/photo-1710609942195-b9dab8f48fc6?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //when image is sent but empty
        set: (v)=> v === "" ? "https://images.unsplash.com/photo-1710609942195-b9dab8f48fc6?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, //Don't do '{location: { type: String }}',
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    category: {
        type: String,
        enum: ["Rooms", "Iconic Cities", "Mountains", "Castle", "Camping", "Pools", "Farmhouse", "Arctic"],
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;