import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

//
const createToken = (_id: string) => {
  return jwt.sign({ _id: _id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};
//

// Controller function to register a new user
const registerUser = async (req: Request, res: Response) => {
  try {
    const { /*username*/ email, password, userType } = req.body;

    // Create a new user
    const newUser = new User({
      //   username: username,
      email: email,
      password: password,
      userType: userType,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    if (savedUser) {
      const token = createToken(savedUser._id.toString());
      res.status(201).json({ user: savedUser, token: token });
    }
  } catch (error) {
    res.status(400).json(error); // Handle any validation or database errors
  }
};
//
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ email: email });

    // Check if the user exists and compare passwords
    if (user && user.password === password) {
      // creating token
      const token = createToken(user._id.toString());
      res.status(200).json({ token: token, user: user });
      //
      //
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { registerUser, loginUser };
