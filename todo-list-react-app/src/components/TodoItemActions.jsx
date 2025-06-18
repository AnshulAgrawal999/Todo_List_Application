
import { Edit, Trash2, StickyNote } from 'lucide-react';

// components/TodoItemActions.jsx

const TodoItemActions = ({ todoId, onEdit, onDelete, onAddNote }) => {
  return (
    <div className="todo-actions flex items-center space-x-2">
      <button
        className="todo-note-btn p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Add note"
        onClick={onAddNote}
      >
        <StickyNote size={16} />
      </button>
      <button
        className="todo-edit-btn p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        title="Edit todo"
        onClick={onEdit}
      >
        <Edit size={16} />
      </button>
      <button
        className="todo-delete-btn p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete todo"
        onClick={onDelete}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TodoItemActions;