import { readUsersFile, writeUsersFile } from '../services/authService.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const TOKEN_EXPIRES_IN = "2h";

const isValidPassword = (password) => {
  return password.length >= 8 && /[a-z]/.test(password) && /\d/.test(password);
};

const isValidUsername = (username) => {
  return /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(username);
};

export const loadData = async (req, res) => {
    try {
        const usersData = await readUsersFile();

        const safeUsers = usersData.map((u) => ({
          username: u.username,
          email: u.email
        }));

        res.status(200).json({
          users: safeUsers,
          message: "Displaying data",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to load users",
        });
    }
};

export const signUp = async(req, res) => {
  try{
    const { username, email, password } = req.body;

    if(!username || !email || !password){
      return res.status(400).json({message: 'All fields required'});
    }

    const trimUsername = username.trim();
    const trimEmail = email.trim().toLowerCase();
    const trimPassword = password.trim();

    if(!trimUsername || !trimEmail || !trimPassword){
      return res.status(400).json({message: 'All fields required'});
    }

    if (!isValidUsername(trimUsername)) {
      return res.status(400).json({
        message: "Username can use letters, numbers, and single hyphens only",
      });
    }

    if (!isValidPassword(trimPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include a lowercase letter and number",
      });
    }
    
    const userData = await readUsersFile();
    
    const userExists = userData.find((u) => {
      return u.username?.toLowerCase() === trimUsername.toLowerCase() || u.email?.toLowerCase() === trimEmail;
    });
    
    if(userExists){
      //err 409 already exist
      return res.status(409).json({ message: 'User already exist!'});
    }
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(trimPassword, salt); 
    
    const newUser = {
      username: trimUsername,
      email: trimEmail,
      password: hashedPassword
    }
    
    userData.push(newUser);
    await writeUsersFile(userData);
    
    res.status(201).json({ message: 'User created successfully'});

  }catch(error){
    console.log('Error', error);
    res.status(500).json({message: 'Server error'});
  }  
}

export const signIn = async(req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const login = (username || email).trim();
    const trimPassword = password.trim();

    if (!login || !trimPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userData = await readUsersFile();

    const user = userData.find((u) => u.username === login || u.email === login.toLowerCase());

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(trimPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
