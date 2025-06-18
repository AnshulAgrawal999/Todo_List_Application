
import TodoItem from './TodoItem';


// components/TodoList.jsx
const TodoList = ({ todos, onToggleComplete, onEdit, onDelete, onAddNote }) => {
  if (todos.length === 0) {
    return (
      <div className="no-todos text-center text-gray-500 py-8">
        No todos found. Add a new one!
      </div>
    );
  }

  return (
    <div className="todo-list space-y-4">
      {todos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddNote={onAddNote}
        />
      ))}
    </div>
  );
};

export default TodoList;