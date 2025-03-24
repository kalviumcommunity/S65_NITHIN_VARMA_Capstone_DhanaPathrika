import { Schema, model } from "mongoose";

const userSchema = new Schema({
    UserName: String,
    Email: String,
    MobileNumber: Number,
    Password: String,
    CompanyName: String,
    Logo: String,
    BussinessAdress: String,
    Pincode: Number
})

export const User = model("User", userSchema);