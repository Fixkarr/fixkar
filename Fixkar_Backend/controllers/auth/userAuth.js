
import { User, Customer, Professional } from "../../models/userModel.js";
import bcrypt from 'bcryptjs'
import { genToken } from '../../utils/AuthToken.js';

export const registerUserWithForm = async (req,res ) =>{
    const {fullName, email, password, role} = req.body;
   
    try {
       if(!fullName || !email || !password){
        return res.status(400).json({
            message : "All Fields are required"
        })
        } 
        
        // step 2 - check if user already exists

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message : "User already exists with this email"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            fullName,
            email,
            password : hashedPassword,
            role
        })

     

        const token = await genToken(newUser._id);
        res.cookie("token", token, {
            secure : process.env.NODE_ENV === 'production',
            sameSite : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days
        })

           if(role === "customer"){
             await Customer.create({
                userId : newUser._id,
                address : "",
                mobile : "",
            })
                const customer = await Customer.findOne({userId : newUser._id}).populate("userId")
            return res.status(201).json({
                message : "user registered successfully",
                user : customer
            })
        }else if(role === "professional"){
           await Professional.create({
                userId : newUser._id,
                dob : "",
                profession : "",
                description : "",
                mobile : "",
                address : "",
                charges : "",
                poi : "",
                profilePicture : ""
            })
              const professional = await Professional.findOne({userId : newUser._id}).populate("userId")
             return res.status(201).json({
                message : "user registered successfully",
                user : professional
            })
        }

    } catch (error) {
        console.log("error in registerCustomerWithForm controller", error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    } 
}


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist with this email" });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await genToken(existingUser._id);
    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
    });

    let userData;
    if (existingUser.role === "customer") {
      userData = await Customer.findOne({ userId: existingUser._id }).populate("userId");
    } else if (existingUser.role === "professional") {
      userData = await Professional.findOne({ userId: existingUser._id }).populate("userId");
    } else {
      userData = existingUser; // for admin or other roles
    }

    return res.status(200).json({
      message: "User logged in successfully",
      user: userData,
    });
  } catch (error) {
    console.log("error in login controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const signOut = async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message : "Signout successfull"
        })
    } catch (error) {
        console.log("error in signOutCustomer", error)
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}


// reset password

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
};

 export const googleAuth = async (req,res)=>{
    try {
        const {fullName, email, role} = req.body;

        let existingUser = await User.findOne({email});

        if(!existingUser){
            const hashedPass = await bcrypt.hash("pass", 10);
            existingUser = await User.create({
                fullName,
                email,
                password : hashedPass,
                role
            })
        }
        const token = await genToken(existingUser._id);
        res.cookie("token", token, {
            secure : process.env.NODE_ENV === 'production',
            sameSite : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000,// 7 days
            httpOnly: true
        })
                 if(role === "customer"){
             await Customer.create({
                userId : existingUser._id,
                address : "",
                mobile : "",
            })
                const customer = await Customer.findOne({userId : existingUser._id}).populate("userId")
            return res.status(201).json({
                message : "user registered successfully",
                user : customer
            })
        }else if(role === "professional"){
           await Professional.create({
                userId : existingUser._id,
                dob : "",
                profession : "",
                description : "",
                mobile : "",
                address : "",
                charges : "",
                poi : "",
                profilePicture : ""
            })
              const professional = await Professional.findOne({userId : existingUser._id}).populate("userId")
             return res.status(201).json({
                message : "user registered successfully",
                user : professional
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "google auth error"});
    }
 }