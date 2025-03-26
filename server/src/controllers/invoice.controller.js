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

const updateInvoice = async (req, res) => {
    try {
        let { id } = req.params;
        id = id.replace(":", "");

        // console.log(id);
        
                
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ "message": "Invalid invoice ID" });
        }
        const userId = req.user.id;
        // console.log(userId);
        
        const { CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date, PaymentMethod, IsDue } = req.body;

        // console.log(CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date, PaymentMethod, IsDue);
        

        if (!CustomerName || !CustomerEmail || !AmountPaid || !Date || !PaymentMethod || Items.length === 0) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        if (AmountPaid < 0) {
            return res.status(400).send({ "message": "Amount cannot be less than 0" });
        }

        const invoice = await Invoice.findById(id);
        // console.log(invoice);
        
        if (!invoice || invoice.user.toString() !== userId) {
            return res.status(404).send({ "message": "Invoice not found or unauthorized" });
        }

        // Compare old and new items
        const oldItemsMap = new Map(invoice.Items.map(item => [item.Name, item.Quantity]));
        const newItemsMap = new Map(Items.map(item => [item.Name, item.Quantity]));

        // Restore stock for removed or changed items
        for (const [itemName, oldQty] of oldItemsMap.entries()) {
            const newQty = newItemsMap.get(itemName);
            if (newQty === undefined || newQty !== oldQty) {
                await Stock.findOneAndUpdate(
                    { ItemName: itemName, user: userId },
                    { $inc: { AvailableQuantity: oldQty } }
                );
            }
        }

        // Validate and update stock for new or modified items
        for (const [itemName, newQty] of newItemsMap.entries()) {
            const oldQty = oldItemsMap.get(itemName);
            if (oldQty === undefined || newQty !== oldQty) {
                const stockItem = await Stock.findOne({ ItemName: itemName, user: userId });

                if (!stockItem) {
                    return res.status(404).send({ "message": `Stock item '${itemName}' not found` });
                }

                if (stockItem.AvailableQuantity < newQty) {
                    return res.status(400).send({ "message": `Not enough stock for '${itemName}'` });
                }

                await Stock.findOneAndUpdate(
                    { ItemName: itemName, user: userId },
                    { $inc: { AvailableQuantity: -newQty } }
                );
            }
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            { CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date, PaymentMethod, IsDue },
            { new: true }
        );

        return res.status(200).send({ "message": "Invoice updated successfully", invoice: updatedInvoice });
    } catch (error) {
        console.error("Error updating invoice", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

export {getInvoices, createInvoice, updateInvoice}