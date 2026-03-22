const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";


main()
    .then((res) => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(Mongo_Url);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj , owner : '69be987731058883d1f3270b'}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}; 

initDB();
