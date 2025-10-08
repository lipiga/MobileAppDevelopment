import bookModel from "../models/bookModel.js";

const addbook = async(req,res)=>{
    const {isbn,name} = req.body;
    try {
        const bookExist = await bookModel.findOne({isbn});

        if(bookExist){
            return res.json({success:false,message:"Book Already Exist with this ISBN number"});
        }
        const newBook = new bookModel({
            isbn:isbn,
            name:name
        })

        const book = await newBook.save();
        return res.json({success:true, message:"Book added successfully"});
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

const listBook = async(req,res)=>{
    try {
        const books = await bookModel.find();

        if(!books){
            return res.json({success:false,message:"No book found"});
        }
        return res.json({success:true, data:books});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

export {addbook,listBook}