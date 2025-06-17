

// Todo Item Component
const TodoItem = ({ todo, onToggle, onEdit, onDelete, onAddNote, onShowDetails }) => {
    return (
        <div className="todo-item" data-id={todo.id}>
            <div className="todo-checkbox">
                <input 
                    type="checkbox" 
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                />
                <label htmlFor={`todo-${todo.id}`}></label>
            </div>
            <div className="todo-content" onClick={() => onShowDetails(todo.id)}>
                <h3 className="todo-title">{todo.title}</h3>
                <div className="todo-meta">
                    <span className={`todo-priority priority-${todo.priority}`}>
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </span>
                    <div className="todo-tags">
                        {todo.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                    </div>
                    <div className="todo-users">
                        {todo.users.map((user, index) => (
                            <span key={index} className="user-tag">{user}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="todo-actions">
                <button 
                    className="todo-note-btn" 
                    title="Add note"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddNote(todo.id);
                    }}
                >
                    <i className="fas fa-sticky-note"></i>
                </button>
                <button 
                    className="todo-edit-btn" 
                    title="Edit todo"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(todo.id);
                    }}
                >
                    <i className="fas fa-edit"></i>
                </button>
                <button 
                    className="todo-delete-btn" 
                    title="Delete todo"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(todo.id);
                    }}
                >
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
};

export default TodoItem;