const Todo = require("../models/Todo");
const User = require("../models/User");

// @desc    Get todos
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, p_res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    p_res.status(200).json(todos);
  } catch (error) {
    p_res.status(500).json({ message: error.message });
  }
};

// @desc    Set todo
// @route   POST /api/todos
// @access  Public
const setTodo = async (req, p_res) => {
  if (!req.body.title) {
    p_res.status(400).json({ message: "Please add a title" });
    return;
  }

  try {
    const todo = await Todo.create({
      title: req.body.title,
      description: req.body.description || "",
      category: req.body.category || "General",
      priority: req.body.priority || "Medium",
      recurrence: req.body.recurrence || "none",
      user: req.user.id,
    });

    p_res.status(200).json(todo);
  } catch (error) {
    p_res.status(400).json({ message: error.message });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = async (req, p_res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      p_res.status(400);
      throw new Error("Todo not found");
    }

    // Check for user
    if (!req.user) {
      p_res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
      p_res.status(401);
      throw new Error("User not authorized");
    }

    let updatedData = { ...req.body };

    // Handle File Upload
    if (req.file) {
      updatedData.proof = req.file.path;
      updatedData.proofType = req.file.mimetype.startsWith("image")
        ? "image"
        : "video";
    } else if (req.body.proofType === "text") {
      // Text proof is already in req.body.proof
    }

    // Handle Completion Timestamp
    if (updatedData.completed) {
      if (!todo.completed) {
        // Only run gamification if it was *not* previously completed
        updatedData.completedAt = new Date(); // Set completion time

        // Gamification Logic
        const user = await User.findById(req.user.id);
        const now = new Date();
        const last = user.lastCompletedDate
          ? new Date(user.lastCompletedDate)
          : null;
        let newBadges = [...user.badges];
        let streakUpdated = false;

        // Check Streak
        const isSameDay = last && last.toDateString() === now.toDateString();
        const isYesterday =
          last &&
          (() => {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return last.toDateString() === yesterday.toDateString();
          })();

        if (!isSameDay) {
          if (isYesterday) {
            user.streak += 1; // Increment streak
          } else {
            user.streak = 1; // Reset or start streak
          }
          user.lastCompletedDate = now;
          streakUpdated = true;
        }

        // Check Badges
        // 1. Early Bird (Before 8 AM)
        if (now.getHours() < 8 && !newBadges.includes("Early Bird")) {
          newBadges.push("Early Bird");
        }

        // 2. Weekend Warrior (Sat 6 or Sun 0)
        const day = now.getDay();
        if (
          (day === 0 || day === 6) &&
          !newBadges.includes("Weekend Warrior")
        ) {
          newBadges.push("Weekend Warrior");
        }

        // 3. Streak Master (Streak >= 3)
        // 3. Streak Master (Streak >= 3)
        if (user.streak >= 3 && !newBadges.includes("Streak Master")) {
          newBadges.push("Streak Master");
        }

        // --- XP & Leveling Logic ---
        const xpMap = {
          High: 30,
          Medium: 20,
          Low: 10,
        };
        const gainedXP = xpMap[todo.priority] || 20;

        // Init fields if missing
        user.level = user.level || 1;
        user.xp = user.xp || 0;

        user.xp += gainedXP;

        // Level Up Threshold: Level * 100 (e.g., Lvl 1 needs 100, Lvl 2 needs 200)
        let xpThreshold = user.level * 100;
        while (user.xp >= xpThreshold) {
          user.xp -= xpThreshold;
          user.level += 1;
          xpThreshold = user.level * 100; // Recalculate for next level if double jump
        }
        // ---------------------------

        if (
          streakUpdated ||
          newBadges.length !== user.badges.length ||
          gainedXP > 0
        ) {
          user.badges = newBadges;
          await user.save();
        }

        // Handle Recurrence (Respawn Task)
        if (todo.recurrence && todo.recurrence !== "none") {
          await Todo.create({
            user: todo.user,
            title: todo.title,
            description: todo.description,
            category: todo.category,
            priority: todo.priority,
            recurrence: todo.recurrence,
            proof: null,
            proofType: null,
            completed: false,
          });
        }
      }
    } else {
      updatedData.completedAt = null; // Clear if re-opened
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );

    p_res.status(200).json(updatedTodo);
  } catch (error) {
    p_res.status(400).json({ message: error.message });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = async (req, p_res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      p_res.status(400);
      throw new Error("Todo not found");
    }

    // Check for user
    if (!req.user) {
      p_res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
      p_res.status(401);
      throw new Error("User not authorized");
    }

    // SOFT DELETE
    todo.deleted = true;
    await todo.save();

    // Increment deleted count
    const user = await User.findById(req.user.id);
    if (user) {
      user.deletedTasksCount = (user.deletedTasksCount || 0) + 1;
      await user.save();
    }

    p_res.status(200).json({ id: req.params.id });
  } catch (error) {
    p_res.status(400).json({ message: error.message });
  }
};

// Helper to ensure promise if needed
const convertToPromise = (v) => v;

module.exports = {
  getTodos,
  setTodo,
  updateTodo,
  deleteTodo,
};
