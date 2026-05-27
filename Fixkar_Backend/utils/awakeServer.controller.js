export const awakeServer = async (req,res)=>{
    try {
        res.status(200).json({
            message : "Server waked up!"
        })
    } catch (error) {
        res.status(500).json({
            message : "Internal server error!"
        })
    }
}