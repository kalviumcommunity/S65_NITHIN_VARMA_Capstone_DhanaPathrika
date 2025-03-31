import { Schema, model } from "mongoose";

const stockSchema = new Schema({
    ItemName: String,
    CostPrice: Number,
    SellingPrice: Number,
    AvailableQuantity: Number,
    MinQuantity: Number,
    
    user: { type: Schema.Types.ObjectId, ref: "User" } 
})

export const Stock = model("Stock", stockSchema);