const mongoose = require("mongoose");
const initData = require("./data.js");
const specialistData = require("./dataSpecialist.js");

const Listing = require("../models/listing.js");
const Specialist = require("../models/specialist.js");

const MONGO_URL ='mongodb://127.0.0.1:27017/visionora';

main().then(() => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
})

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
     try {
    // Clear old data
    await Listing.deleteMany({});
    await Specialist.deleteMany({});

    // Insert new data
    await Listing.insertMany(initData.data);
    await Specialist.insertMany(specialistData.data);

    console.log("Listings + Specialists initialized successfully!");
  } catch (err) {
    console.log("Error initializing database:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();