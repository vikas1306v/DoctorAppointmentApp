const jwt=require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;



const validateToken=(req,res,next)=>{
    const token=req.header('auth-token');
   try{
   
    if(!token){
        return res.status(401).json({
            success:false,
            error:"Access Denied",
            message:"You Don't have token"
        })
    }
   const decodedToken= jwt.verify(token,JWT_SECRET)
   if(!decodedToken){
    return res.status(401).json({
        success:false,
        error:"Invalid Token",
        message:"Invalid Token"
    })
   }

   req.user_id=decodedToken.user_id;
   req.user_role=decodedToken.user_role;
next();
   }catch(e)
   {
    res.status(500).json({
        success:false,
        error:e,
        message:"valid token error"
    })
   }

}
module.exports= validateToken;