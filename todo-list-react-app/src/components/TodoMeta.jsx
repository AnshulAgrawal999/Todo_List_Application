

// components/TodoMeta.jsx
const TodoMeta = ({ todo }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="todo-meta flex items-center space-x-4 text-sm">
      <span className={`todo-priority priority-${todo.priority} px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(todo.priority)}`}>
        {todo.priority}
      </span>
      
      {todo.tags && todo.tags.length > 0 && (
        <div className="todo-tags flex items-center space-x-1">
          {todo.tags.map(tag => (
            <span key={tag} className="tag px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {todo.assignedUsers && todo.assignedUsers.length > 0 && (
        <div className="todo-users flex items-center space-x-1">
          {todo.assignedUsers.map(user => (
            <span key={user} className="user-tag px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              {user}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoMeta;