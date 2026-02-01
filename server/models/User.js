const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    bio: {
      type: String,
      default: "No bio available",
    },
    profilePic: {
      type: String, // Store URL/Path
      default: "",
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    dob: {
      type: Date,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastCompletedDate: {
      type: Date,
      default: null,
    },
    badges: {
      type: [String], // Array of badge names e.g. ["Early Bird", "Weekend Warrior"]
      default: [],
    },
    deletedTasksCount: {
      type: Number,
      default: 0,
    },
    focusMinutes: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
