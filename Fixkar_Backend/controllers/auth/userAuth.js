
import { User, Customer, Professional } from "../../models/userModel.js";
import bcrypt from 'bcryptjs'
import { genToken } from '../../utils/AuthToken.js';
import redis from "../../services/redisClient.js";


export const registerUserWithForm = async (req, res) => {
    const { fullName, email, password, role,  acceptedTerms, acceptedProfessionalPolicy, } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All Fields are required"
            })
        } 

        const isEmailVerified = await redis.get(`email_verified:${email}`);
         if (!isEmailVerified) {
          return res.status(403).json({
            message: "Please verify your email before signup",
          });
        }

        if (!acceptedTerms) {
      return res.status(400).json({ message: "Terms acceptance required" });
    }

    if (role === "professional" && !acceptedProfessionalPolicy) {
      return res.status(400).json({ message: "Professional policy acceptance required" });
    }

      const userIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;


        // step 2 - check if user already exists

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            termsAcceptance: {
            accepted: true,
            acceptedAt: new Date(),
            acceptedIP: userIP,
            policyVersion: "v1.0",
      },
      professionalAcceptance:
        role === "professional"
          ? {
              accepted: true,
              acceptedAt: new Date(),
              acceptedIP: userIP,
              policyVersion: "v1.0",
            }
          : undefined,
        })


        await redis.del(`email_verified:${email}`);
          
        const token = await genToken(newUser._id);
        res.cookie("token", token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        if (role === "customer") {
            await Customer.create({
                userId: newUser._id,
            })
            const customer = await Customer.findOne({ userId: newUser._id }).populate("userId")
            return res.status(201).json({
                message: "user registered successfully",
                user: customer
            })
        } else if (role === "professional") {
            await Professional.create({
                userId: newUser._id,
                address: {
                    addressLine: "",
                    lat: null,
                    lng: null
                },
                location: {
                    type: "Point",
                    coordinates: []
                },
            })
            const professional = await Professional.findOne({ userId: newUser._id }).populate("userId", '-password')
            return res.status(201).json({
                message: "user registered successfully",
                user: professional
            })
        }

    } catch (error) {
        console.log("error in registerCustomerWithForm controller", error);
        res.status(500).json({
            message: "Internal Server Error"
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
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
        });

        let userData;
        if (existingUser.role === "customer") {
            userData = await Customer.findOne({ userId: existingUser._id }).populate("userId", '-password');
        } else if (existingUser.role === "professional") {  
            userData = await Professional.findOne({ userId: existingUser._id }).select('-poi -dob').populate("userId", '-password').populate({
    path: "reviews",
    options: {
      sort: { createdAt: -1 },
      limit: 10   // latest 5 reviews
    }
  }).populate({
    path: "gallery",
    options: {
      sort: { createdAt: -1 },
      limit: 20   // latest 6 images
    }
  }).populate({
    path : "profession",
    select : "name image skills",
    populate: {
      path: "skills",
      select: "name", // Skill schema field
    },
  }).populate({
    path : "selectedSkills",
    select : "name"
  });
        } else {
            return res.status(400).json({ message: "No role assigned to this user" })
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

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/"
      // domain: ".onrender.com"  // agar login me domain diya tha to
    });

    return res.status(200).json({
      message: "Signout successful"
    });
  } catch (error) {
    console.log("error in signOutCustomer", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// reset password

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
};

export const googleAuthSignup = async (req, res) => {
    try {
        const { fullName, email, role, acceptedTerms, acceptedProfessionalPolicy} = req.body;

        
         if (!acceptedTerms) {
      return res.status(400).json({ message: "Terms acceptance required" });
    }

    if (role === "professional" && !acceptedProfessionalPolicy) {
      return res.status(400).json({ message: "Professional policy acceptance required" });
    }

      const userIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;


        let existingUser = await User.findOne({ email });

        if (existingUser) {
           return res.status(400).json({
            message : "User already exists with this email"
           })
        }
         const hashedPass = await bcrypt.hash("pass", 10);
            existingUser = await User.create({
                fullName,
                email,
                password: hashedPass,
                role,
                termsAcceptance: {
                accepted: true,
                acceptedAt: new Date(),
                acceptedIP: userIP,
                policyVersion: "v1.0",
              },
              professionalAcceptance:
                role === "professional"
                  ? {
                      accepted: true,
                      acceptedAt: new Date(),
                      acceptedIP: userIP,
                      policyVersion: "v1.0",
            }
          : undefined,
            })

        const token = await genToken(existingUser._id);
        res.cookie("token", token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,// 7 days
            httpOnly: true
        })
        if (role === "customer") {
            await Customer.create({
                userId: existingUser._id,
            })
            const customer = await Customer.findOne({ userId: existingUser._id }).populate("userId", "-password")

            return res.status(201).json({
                message: "user registered successfully",
                user: customer
            })
        } else if (role === "professional") {
            let professional = await Professional.findOne({ userId: existingUser._id })

            if (!professional) {

                await Professional.create({
                    userId: existingUser._id,
                    address: {
                        addressLine: "",
                        lat: null,
                        lng: null
                    },
                    location: {
                        type: "Point",
                        coordinates: [] 
                    },

                })
            }
            professional = await Professional.findOne({ userId: existingUser._id }).populate("userId", '-password').select('-poi -dob').populate({
    path: "reviews",
    options: {
      sort: { createdAt: -1 },
      limit: 10   // latest 5 reviews
    }
  }).populate({
    path: "gallery",
    options: {
      sort: { createdAt: -1 },
      limit: 20   // latest 6 images
    }
  });
  
            return res.status(201).json({
                message: "user loggedin successfully",
                user: professional
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "google auth error" });
    }
}

export const googleAuthLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please signup with Google first.",
      });
    }

    // Generate token
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Role based response
    if (user.role === "customer") {
      const customer = await Customer.findOne({ userId: user._id })
        .populate("userId", "-password");

      return res.status(200).json({
        message: "Google login successful",
        user: customer,
      });
    }

    if (user.role === "professional") {
      const professional = await Professional.findOne({ userId: user._id })
        .populate("userId", "-password")
        .select("-poi -dob")
        .populate({
          path: "reviews",
          options: { sort: { createdAt: -1 }, limit: 10 },
        })
        .populate({
          path: "gallery",
          options: { sort: { createdAt: -1 }, limit: 20 },
        }).populate({
    path : "profession",
    select : "name image skills",
    populate: {
      path: "skills",
      select: "name", // Skill schema field
    },
  });



      return res.status(200).json({
        message: "Google login successful",
        user: professional,
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Google login failed" });
  }
};
