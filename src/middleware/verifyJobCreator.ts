import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";

//

interface CustomRequest extends Request {
  //as no question mark - was the reason of error
  user?: any; // Replace 'any' with the actual user data type
}
//

const verifyJobCreator = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({ message: "no token found" });
    }
    // //
    // console.log(
    //   req.headers.authorization,
    //   "req.headers.authorization from verifyJobCreator"
    // );
    //
    //
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    //
    const result = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    // console.log(result, "result");
    const userID = result._id;
    //
    const user = await User.findOne({ _id: userID }).select("_id, userType ");
    //
    //sending the user._id in the routes

    if (user && user.userType === "jobcreator") {
      req.user = user._id; // Store user ID in the request
      next();
    } else {
      res.status(403).json({ error: "Permission denied" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

export { verifyJobCreator };
