import TodoItem from "./TodoItem";

const TodoList = ({ todos, onDelete, onUpdate, onToggle }) => {
  if (!todos || todos.length === 0) {
    return <div className="empty-state">No tasks yet. Add one above!</div>;
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default TodoList;
