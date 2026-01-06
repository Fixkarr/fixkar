export const adminPermission = (...allowedRoles)=>{
    return (req,res,next)=>{
        try {
            const admin = req.admin;

             if (!admin) {
                return res.status(403).json({
                success: false,
                message: "Admin access denied",
                });
            }

            if (!allowedRoles.includes(admin.role)) {
                return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
                });
            }

            next();

        } catch (error) {
              return res.status(500).json({
                    success: false,
                    message: "Permission check failed",
            });
        }
    }
}