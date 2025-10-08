import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import userRouter from './routers/userRouter.js';
import bookRouter from './routers/bookRouter.js';


const app = express();

const PORT = 4000;

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://lipigaA:lipigaA@cluster0.us2lajm.mongodb.net/MobAppLogin").then(()=>{
        console.log("DB Connected Successfully");
    })
}

connectDB(); 

app.use(cors());
app.use(express.json());

app.use("/api/user",userRouter);
app.use("/api/book",bookRouter)

app.get("/",(req,res)=>{
    res.send("API WORKING");

})

app.listen(PORT,'0.0.0.0',()=>{
    console.log(`Listening to the port ${PORT}`);
})




