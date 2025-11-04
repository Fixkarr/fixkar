import jwt from 'jsonwebtoken';

export const isAuth = (req,res,next) =>{
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({
                message : "Unauthorized Access"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({
                message : "Token not verified"
            })
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
        
    }
}