import { Invoice } from "../models/invoice.model.js";
import { Stock } from "../models/stock.model.js";
import mongoose from 'mongoose';

const getInvoices = async (req, res) => {
    try {
        const userId = req.user.id
    
        const invoices = await Invoice.find({user: userId});
        
        if (!invoices) {
            return res.status(404).send({"message": "No invoices present"});
        }

        return res.status(201).send({"message": "Invoice retrived successfully", invoices})
        
    } catch (error) {
        console.error("error fetching invoices", error);
        return res.status(500).send({"message": "Internal Server Error"});
    }

}

export {getInvoices}