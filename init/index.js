const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoURL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    mongoose.connect(mongoURL);
};
main()
    .then(()=>{
    console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: '66954b20845ed80c03e7c833'})); //yes, we could've made an array through a for loop, but this is a better method to create a new array with all the elements(objects) from the past array and a new key:value pair of the owner, which here is dhanay from db.users
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};    

initDB();