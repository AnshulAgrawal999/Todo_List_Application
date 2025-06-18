
import TodoMeta from './TodoMeta';  

import TodoItemActions from './TodoItemActions';

// components/TodoItem.jsx

const TodoItem = ({ todo, onToggleComplete, onEdit, onDelete, onAddNote }) => {
  return (
    <div className="todo-item bg-white rounded-lg shadow-sm border p-4" data-id={todo._id}>
      <div className="flex items-start space-x-4">
        <div className="todo-checkbox">
          <input
            type="checkbox"
            id={`todo-${todo._id}`}
            checked={todo.completed || false}
            onChange={(e) => onToggleComplete(todo._id, e.target.checked)}
            className="rounded"
          />
        </div>

        <div className="todo-content flex-1">
          <h3 className="todo-title text-lg font-medium mb-2">{todo.title}</h3>
          <TodoMeta todo={todo} />
        </div>

        <TodoItemActions 
          todoId={todo._id}
          onEdit={() => onEdit(todo)}
          onDelete={() => onDelete(todo._id)}
          onAddNote={() => onAddNote(todo._id)}
        />
      </div>
    </div>
  );
};

export default TodoItem;