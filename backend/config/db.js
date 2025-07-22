import mongoose from "mongoose";

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://lipigaA:lipigaA@cluster0.us2lajm.mongodb.net/MobAppLogin").then(() => {
        console.log("DB Connected Successfully");
    });
}

export default connectDB();
