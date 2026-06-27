const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{

 const token = req.headers.authorization;

 if(!token){
  return res.status(401).json({
   message:"Access denied"
  });
 }

 try{

  const verify = jwt.verify(
   token.split(" ")[1],
   process.env.JWT_SECRET
  );

  req.user = verify;

  next();

 }catch(error){

  res.status(401).json({
   message:"Invalid token"
  });

 }

};