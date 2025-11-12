import express from 'express';
import User from './userModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (UserId) => {
  return jwt.sign({ id: UserId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    //check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    //get random avatar
    const profileImage = `https://avatars.dicebear.com/api/avataaars/${Math.floor(
      Math.random() * 1000
    )}.svg`;

    const user = new User({
      username,
      email,
      password,
      profileImage,
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Registration error:", error);
   res.status(500).json(error);
  }
});

/*router.post('/login', (req, res) => {
    res.send('User logged in');
});*/
router.post("/login", async (req, res) => {
  try {
    // 1. Destructure email and password from the request body
    const { email, password } = req.body;

    // 2. Basic validation check for required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    // 3. Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      // Use a generic message for security (don't reveal if email or password was wrong)
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Check if the provided password matches the stored hashed password
    // (Assuming your User model has a method called 'comparePassword')
    // ✅ CORRECT SYNTAX
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Use a generic message for security
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 5. Generate a JWT token for the authenticated user
    const token = generateToken(user._id);

    // 6. Send a successful response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage, // Include necessary user details
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
