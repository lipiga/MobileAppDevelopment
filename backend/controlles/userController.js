import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import { hash } from "argon2";
import { verify } from "argon2";
import validator from 'validator'

//login user
const loginUser = async (req,res)=>{
    const {email,password} = req.body
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false,message:"user doesn't exist"})
        }

        const isMatch = await verify(user.password,password)
        if (!isMatch) {
            return res.json({success:false,message:"incorrect password"})
        }

        res.json({success:true,message:"Login Successfull"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async(req,res)=>{
    const {name,password,email} = req.body;
    try {
        //checking the email already exist
        const exist = await userModel.findOne({email})
        if (exist) {
            return res.json({success:false,message:"email exist"})
        }

        //validating email format and strong password

        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"please enter a valid email"})
        }

        if (password.length<8) {
            return res.json({success:false,message:"password length should be  8 character"})
        }

        //hasing user password
        const hashedPassword = await hash(password)

        const newUser = new userModel({
            name :name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save()
        res.json({success:true,message:"Register Successfull"})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {loginUser,registerUser}