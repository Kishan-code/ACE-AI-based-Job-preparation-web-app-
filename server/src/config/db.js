const mongoose = require("mongoose");
const {MONGO_URI } = require("./server.config");

 
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("database connected");
    } catch (error) {
        console.log("database connection failed: \n",error);
        process.exit(0);
    }
}

module.exports = connectDB;