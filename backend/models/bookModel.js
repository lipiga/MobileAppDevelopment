import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    isbn:{type:String, required:true},
    name:{type:String, required:true},
    
})

const bookModel = mongoose.models.book || mongoose.model("book",bookSchema);

export default bookModel;