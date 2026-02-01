import { useState } from "react";

const TodoItem = ({ todo, onDelete, onUpdate, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title || todo.text || ""); // Fallback for old data
  const [editDesc, setEditDesc] = useState(todo.description || "");

  const handleUpdate = () => {
    if (!editTitle) return alert("Title cannot be empty");
    onUpdate(todo._id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title || todo.text || "");
    setEditDesc(todo.description || "");
  };

  if (isEditing) {
    return (
      <div className={`todo-item editing`}>
        <input
          type="text"
          className="todo-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          className="todo-input"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Description"
        />
        <div className="edit-actions">
          <button onClick={handleUpdate} className="btn-add btn-sm">
            Save
          </button>
          <button onClick={cancelEdit} className="btn-delete btn-bordered">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content" onClick={() => onToggle(todo)}>
        <div className="checkbox-custom">
          <svg
            className="check-icon"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="todo-text" style={{ fontWeight: 600 }}>
            {todo.title || todo.text}
          </span>
          {todo.description && (
            <span style={{ fontSize: "0.85rem", color: "var(--text-offset)" }}>
              {todo.description}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <button
          className="btn-delete"
          onClick={() => setIsEditing(true)}
          aria-label="Edit"
          title="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(todo._id)}
          aria-label="Delete"
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
