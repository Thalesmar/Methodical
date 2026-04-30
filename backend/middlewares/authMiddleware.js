import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const SECRET_TOKEN = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = (req, res, next) => {
  // 1. get header
  const authHeader = req.headers.authorization;

  if (!SECRET_TOKEN) {
    return res.status(500).json({ message: "Auth secret is not configured" });
  }
  
  if(!authHeader){
    return res.status(401).json({message: 'No token provided'});
  }
  
  // 2. extract token
  const [scheme, token] = authHeader.split(" ");

  if(scheme !== "Bearer" || !token){
    return res.status(401).json({ message: 'Invalid token format' });
  }

  //jwt
  try{
    // 3. verify token
    const decode = jwt.verify(token, SECRET_TOKEN); 
    // 4. attach user
    req.user = decode;

    // 5. continue
    next();
  }catch(error){
    return res.status(403).json({ message: "Token is not valid" });
  }
}
