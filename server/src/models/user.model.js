const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
    },
    profilePictureId:{
        type: String,
    },
    fullname:{
        type: String,
    },
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true,
    },
    email: {
        type: String,
        unique: [true, "account already exists with this email"],
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
},{
    timestamps: true,
});

UserSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
});

UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;