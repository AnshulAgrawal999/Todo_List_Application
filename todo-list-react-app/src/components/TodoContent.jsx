import { useState } from 'react';

import TodoItem from './TodoItem.jsx';

// Todo Content Component
const TodoContent = ({ todos, currentUser, onAddTodo, onSearch, onToggleTodo, onEditTodo, onDeleteTodo, onAddNote, onShowDetails, onPageChange, currentPage, totalPages }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <section className="todo-content">
            <div className="todo-actions">
                <button id="add-todo-btn" className="btn btn-primary" onClick={onAddTodo}>
                    <i className="fas fa-plus"></i> Add Todo
                </button>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search todos..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="search-btn" onClick={handleSearch}>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>

            <div className="todo-list">
                {todos.length === 0 ? (
                    <div className="no-todos">No todos found. Add a new one!</div>
                ) : (
                    todos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={onToggleTodo}
                            onEdit={onEditTodo}
                            onDelete={onDeleteTodo}
                            onAddNote={onAddNote}
                            onShowDetails={onShowDetails}
                        />
                    ))
                )}
            </div>

            <div className="pagination-controls">
                <button 
                    className="pagination-prev" 
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <i className="fas fa-chevron-left"></i> Previous
                </button>
                <div className="pagination-pages">
                    <span className="pagination-current">{currentPage}</span> / <span className="pagination-total">{totalPages}</span>
                </div>
                <button 
                    className="pagination-next"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </section>
    );
};
