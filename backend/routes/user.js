const express= require("express");
const { User } = require("../db");
const zod=require("zod")
const jwt=require("jsonwebtoken")
const userRouter=require("./user");
const JWT_SECRET = require("../config");
const  { authMiddleware } = require("../middleware");

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
 const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }


    res.status(411).json({
        message: "Error while logging in"
    })
})
const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports=router;

