const express= require("express");
const { User } = require("../db");
const zod=require("zod")
const jwt=require("jsonwebtoken")
const userRouter=require("./user");
const JWT_SECRET = require("../config");

const router=express.Router();
const signupSchema=zod.object({
    username:zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string()
})

 router.post("/signup",async (req,res)=>{
    const body=req.body;
const {sucess}=signupSchema.safeParse(req.body);
if(!sucess){
     return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
})
}
const existuser= await User.findOne({
username: body.username
})
if(existuser){
    return res.status(411).json({
        message: "Email already taken/Incorrect inputs"
    })
}
const user=await User.create({
    username:body.username,
    firstname:body.firstname,
    lastname:body.lastname,
    password:body.password
})
const userid=user._id;
const token=jwt.sign({
    userid
},JWT_SECRET)
res.json({
    message:"user created succesfully",
    token:token
})

 })

module.exports=router;

