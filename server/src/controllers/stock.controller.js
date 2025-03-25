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
        res.status(500).send({ "message": "Internal Server Error" });
    }
};

export {getStock}