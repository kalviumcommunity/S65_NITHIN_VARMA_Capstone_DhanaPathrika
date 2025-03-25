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

const createInvoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const { CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date, PaymentMethod, IsDue } = req.body;

        if (!CustomerName || !CustomerEmail || !AmountPaid || !Date || !PaymentMethod || Items.length === 0) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        if (AmountPaid < 0) {
            return res.status(400).send({ "message": "Amount cannot be less than 0" });
        }

        for (const item of Items) {
            const stockItem = await Stock.findOne({ ItemName: item.Name, user: userId });

            if (!stockItem) {
                return res.status(404).send({ "message": `Stock item '${item.Name}' not found` });
            }

            if (stockItem.AvailableQuantity < item.Quantity) {
                return res.status(400).send({ "message": `Not enough stock for '${item.Name}'` });
            }

            stockItem.AvailableQuantity -= item.Quantity;
            await stockItem.save();
        }

        const newInvoice = new Invoice({
            CustomerName,
            CustomerEmail,
            Items,
            AmountPaid,
            DueDate,
            IsDue,
            Date,
            PaymentMethod,
            user: userId
        });

        await newInvoice.save();

        return res.status(201).send({ "message": "Invoice created successfully", invoice: newInvoice });
    } catch (error) {
        console.error("Error creating invoice:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

export {getInvoices, createInvoice}