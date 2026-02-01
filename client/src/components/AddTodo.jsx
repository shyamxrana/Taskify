import { useState } from "react";

const AddTodo = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please add a title");
      return;
    }

    onAdd({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form
      className="todo-form"
      onSubmit={onSubmit}
      style={{ flexDirection: "column" }}
    >
      <div className="input-group">
        <input
          type="text"
          placeholder="Task Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
          style={{ marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="todo-input"
        />
      </div>
      <button type="submit" className="btn-add btn-block">
        <span>+</span> Add Task
      </button>
    </form>
  );
};

export default AddTodo;
