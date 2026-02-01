import { useState, useEffect, useContext } from "react";
import { API_BASE_URL } from "../config";
import confetti from "canvas-confetti";
import AddTodo from "../components/AddTodo";
import Notification from "../components/Notification";
import ProofModal from "../components/ProofModal";
import FocusTimer from "../components/FocusTimer";
import LevelProgress from "../components/LevelProgress";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit2, RotateCcw, Repeat, Timer } from "lucide-react";
import { Input } from "../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search } from "lucide-react";

function Dashboard() {
  const { user, refreshUser } = useContext(AuthContext); // Destructure refreshUser
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, completed
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest, a-z

  // Proof Modal State
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [todoToComplete, setTodoToComplete] = useState(null);

  // Focus Timer State
  const [isFocusOpen, setIsFocusOpen] = useState(false);
  const [focusTask, setFocusTask] = useState(null);

  // Fetch Todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/todos`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch todos: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          console.error("API returned non-array data:", data);
          setTodos([]); // Fallback to empty array
          showNotification("Received invalid data from server", "error");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setTodos([]); // Ensure todos is always an array on error
        setLoading(false);
        showNotification(error.message || "Failed to fetch tasks", "error");
      }
    };

    if (user) {
      fetchTodos();
      refreshUser(); // Refresh user on load to get latest streak
    }
  }, [user.token]); // Depend on user.token instead of user to avoid infinite loop if user object updates

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  // Add Todo
  const addTodo = async (todo) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(todo),
      });

      const data = await res.json();

      if (res.ok) {
        setTodos([...todos, data]);
        showNotification("Task added successfully!");
      } else {
        showNotification(data.message || "Failed to add task", "error");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      showNotification(error.message || "Failed to add task", "error");
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      showNotification("Task deleted");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Handle Check/Toggle
  const handleToggle = (todo) => {
    if (!todo.completed) {
      // Open Modal for proof
      setTodoToComplete(todo._id);
      setIsProofModalOpen(true);
    } else {
      // Simply reopen
      updateTodo(todo._id, { completed: false });
    }
  };

  // Submit Proof
  const handleProofSubmit = (formData) => {
    if (todoToComplete) {
      updateTodo(todoToComplete, formData);
      setIsProofModalOpen(false);
      setTodoToComplete(null);
    }
  };

  // Handle Focus
  const handleFocus = (todo) => {
    setFocusTask(todo);
    setIsFocusOpen(true);
  };

  const handleFocusComplete = (task) => {
    // Optionally automatically open proof modal
    setTodoToComplete(task._id);
    setIsProofModalOpen(true);
  };

  // Update Todo with Confetti!
  const updateTodo = async (id, updData) => {
    const todoToUpdate = todos.find((todo) => todo._id === id);
    let body;
    let headers = {
      Authorization: `Bearer ${user.token}`,
    };

    if (updData instanceof FormData) {
      body = updData;
    } else {
      const updatedLocal = { ...todoToUpdate, ...updData };
      body = JSON.stringify(updatedLocal);
      headers["Content-type"] = "application/json";
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "PUT",
        headers: headers,
        body: body,
      });

      const data = await res.json();
      setTodos(todos.map((todo) => (todo._id === id ? data : todo)));

      // Confetti Logic
      if (updData instanceof FormData) {
        showNotification("Task completed & proof submitted! 🎉");
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ec4899", "#ffffff"], // Matching theme colors
        });
        const updatedUser = await refreshUser(); // Check for new streak/badges
        if (updatedUser) {
          const oldBadges = user.badges || [];
          const newBadges = updatedUser.badges || [];
          const earned = newBadges.filter((b) => !oldBadges.includes(b));
          earned.forEach((b) =>
            setTimeout(
              () => showNotification(`🏆 Unlocked: ${b}!`, "success"),
              1500
            )
          );

          if (updatedUser.level > (user.level || 1)) {
            setTimeout(
              () =>
                showNotification(
                  `🆙 Level Up! You are now Level ${updatedUser.level}!`,
                  "success"
                ),
              500
            );
            confetti({
              particleCount: 200,
              spread: 100,
              colors: ["#FFD700", "#FFA500"],
            });
          }
        }
      } else if ("completed" in updData) {
        const isCompleted = updData.completed;
        if (isCompleted) {
          const xpMap = { High: 30, Medium: 20, Low: 10 };
          const gainedXP = xpMap[todoToUpdate.priority] || 20;
          showNotification(`Task completed! 🎉 +${gainedXP} XP`, "success");

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#a855f7", "#ec4899", "#ffffff"],
          });
          const updatedUser = await refreshUser(); // Check for new streak/badges
          if (updatedUser) {
            const oldBadges = user.badges || [];
            const newBadges = updatedUser.badges || [];
            const earned = newBadges.filter((b) => !oldBadges.includes(b));
            earned.forEach((b) =>
              setTimeout(
                () => showNotification(`🏆 Unlocked: ${b}!`, "success"),
                1500
              )
            );

            if (updatedUser.level > (user.level || 1)) {
              setTimeout(
                () =>
                  showNotification(
                    `🆙 Level Up! You are now Level ${updatedUser.level}!`,
                    "success"
                  ),
                500
              );
              confetti({
                particleCount: 200,
                spread: 100,
                colors: ["#FFD700", "#FFA500"],
              });
            }
          }
        }
      } else {
        showNotification("Task updated successfully");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      showNotification("Failed to update task", "error");
    }
  };

  // Filter and Sort Logic
  const filteredTodos = todos
    .filter((todo) => {
      // Exclude Soft Deleted
      if (todo.deleted) return false;

      // Search Filter
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description &&
          todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status Filter
      if (filterStatus === "active") return matchesSearch && !todo.completed;
      if (filterStatus === "completed") return matchesSearch && todo.completed;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === "a-z") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <>
      <ProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        onSubmit={handleProofSubmit}
      />

      <FocusTimer
        isOpen={isFocusOpen}
        onClose={() => setIsFocusOpen(false)}
        task={focusTask}
        onComplete={handleFocusComplete}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="container max-w-4xl mx-auto py-8">
        {user && (
          <LevelProgress level={user.level} xp={user.xp} className="mb-6" />
        )}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Task Master
            </h1>
            <div className="text-muted-foreground">
              Welcome back, {user && user.name}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-card p-3 rounded-xl border shadow-sm">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Daily Streak
              </div>
              <div className="text-xl font-bold">{user?.streak || 0} Days</div>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 rounded-xl bg-card border border-border shadow-sm space-y-6">
          <AddTodoForm onAdd={addTodo} />

          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                onFocus={handleFocus}
              />
            ))}
            {filteredTodos.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {todos.length === 0
                  ? "No tasks yet. Create one above! 🚀"
                  : "No matching tasks found. 🔍"}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// Sub-components
const AddTodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [recurrence, setRecurrence] = useState("none");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onAdd({ title, description, category, priority, recurrence });
    setTitle("");
    setDescription("");
    setCategory("General");
    setPriority("Medium");
    setRecurrence("none");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Input
          placeholder="Task Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="md:col-span-4"
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="md:col-span-4"
        />
        <div className="md:col-span-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select value={recurrence} onValueChange={setRecurrence}>
            <SelectTrigger>
              <SelectValue placeholder="Repeat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Repeat</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  );
};

const TodoItem = ({ todo, onToggle, onDelete, onUpdate, onFocus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description);
  const [editCategory, setEditCategory] = useState(todo.category || "General");
  const [editPriority, setEditPriority] = useState(todo.priority || "Medium");
  const [editRecurrence, setEditRecurrence] = useState(
    todo.recurrence || "none"
  );

  const handleSave = () => {
    onUpdate(todo._id, {
      title: editTitle,
      description: editDesc,
      category: editCategory,
      priority: editPriority,
      recurrence: editRecurrence,
    });
    setIsEditing(false);
  };

  const priorityColors = {
    High: "bg-red-100 text-red-800 border-red-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Low: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        todo.completed ? "opacity-70 bg-muted/50" : "bg-card"
      }`}
    >
      <CardContent className="p-4 flex items-start gap-4">
        <div className="pt-1">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo)}
          />
        </div>

        <div className="flex-1 space-y-1">
          {isEditing ? (
            <div className="grid gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
              />
              <Input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Description"
              />
              <div className="flex gap-2 flex-wrap">
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={editPriority} onValueChange={setEditPriority}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={editRecurrence}
                  onValueChange={setEditRecurrence}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Repeat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Repeat</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    priorityColors[todo.priority] || priorityColors.Medium
                  }`}
                >
                  {todo.priority || "Medium"}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
                  {todo.category || "General"}
                </span>
                {todo.recurrence && todo.recurrence !== "none" && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
                    <Repeat className="h-3 w-3" />
                    {todo.recurrence}
                  </span>
                )}
              </div>
              <h3
                className={`font-semibold text-lg leading-none ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-sm text-muted-foreground">
                  {todo.description}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isEditing && !todo.completed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          {!isEditing && !todo.completed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFocus(todo)}
              title="Start Focus Session"
            >
              <Timer className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(todo._id)}
            className="hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
