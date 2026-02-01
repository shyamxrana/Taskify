const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profilePic: req.file ? req.file.path : null, // Add profilePic
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      bio: user.bio,
      profilePic: user.profilePic,
      username: user.username,
      dob: user.dob,
      deletedTasksCount: user.deletedTasksCount,
      level: user.level,
      xp: user.xp,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      bio: user.bio,
      profilePic: user.profilePic,
      username: user.username,
      dob: user.dob,
      deletedTasksCount: user.deletedTasksCount,
      level: user.level,
      xp: user.xp,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.username =
      req.body.username !== undefined ? req.body.username : user.username;
    user.dob = req.body.dob !== undefined ? req.body.dob : user.dob;

    if (req.file) {
      user.profilePic = req.file.path;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
      username: updatedUser.username,
      dob: updatedUser.dob,
      deletedTasksCount: updatedUser.deletedTasksCount,
      level: updatedUser.level,
      xp: updatedUser.xp,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};
// @desc    Increment focus time
// @route   PUT /api/users/focus
// @access  Private
const incrementFocusTime = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.focusMinutes = (user.focusMinutes || 0) + (req.body.minutes || 0);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  incrementFocusTime,
};
