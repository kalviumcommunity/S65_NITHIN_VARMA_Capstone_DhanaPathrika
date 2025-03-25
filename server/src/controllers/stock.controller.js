import { Stock } from "../models/stock.model.js";
import mongoose from 'mongoose';

const getStock = async (req, res) => {
    try {
        const userId = req.user.id;
        const stockItems = await Stock.find({ user: userId });

        if (!stockItems.length) {
            return res.status(404).send({ "message": "No stock items found for this user" });
        }

        return res.status(200).send(stockItems);
    } catch (error) {
        console.error("error in getting items", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const addStock = async (req, res) => {
    try {
        const { ItemName, CostPrice, SellingPrice, AvailableQuantity, MinQuantity } = req.body;
        const userId = req.user.id;
        // console.log("userId", userId)

        if (!ItemName || !CostPrice || !SellingPrice || !AvailableQuantity || !MinQuantity) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        const existedItem = await Stock.findOne({ ItemName, user: userId });

        if (existedItem) {
            return res.status(409).send({ "message": "Item already exists in your stock" });
        }

        if (CostPrice < 1 || SellingPrice < 1 || AvailableQuantity < 1 || MinQuantity < 1) {
            return res.status(400).json({ message: "Values must be greater than 0" });
        }

        const newStock = new Stock({
            ItemName,
            CostPrice,
            SellingPrice,
            AvailableQuantity,
            MinQuantity,
            user: userId
        });

        await newStock.save();

        return res.status(201).send({ "message": "Item added successfully", newStock });
    } catch (error) {
        console.error("error adding stock", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

export {getStock, addStock}