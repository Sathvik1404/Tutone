import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGO CONNECTED :${process.env.MONGO_URI}`);

    } catch (err) {
        console.error(err);
    }
}
export default connectdb;