import {connect} from 'mongoose';

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully");
    } catch (error) {
        console.error("error in db", error);
    }
}

export default connectDB