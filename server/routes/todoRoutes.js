const express = require("express");
const router = express.Router();
const {
  getTodos,
  setTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getTodos).post(protect, setTodo);
router
  .route("/:id")
  .put(protect, upload.single("proof"), updateTodo)
  .delete(protect, deleteTodo);

module.exports = router;
