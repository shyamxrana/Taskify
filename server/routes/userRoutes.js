const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("profilePic"), updateProfile);
router.put(
  "/focus",
  protect,
  require("../controllers/userController").incrementFocusTime
);

module.exports = router;
