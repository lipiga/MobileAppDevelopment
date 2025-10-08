import express from 'express';
import {addbook,listBook} from '../controlles/bookController.js';

const bookRouter = express.Router()

bookRouter.post("/addbook",addbook);
bookRouter.get("/listbook",listBook);

export default bookRouter;