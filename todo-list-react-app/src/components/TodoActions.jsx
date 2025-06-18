
import { Plus } from 'lucide-react';

import SearchBar from './SearchBar'; 

// components/TodoActions.jsx


const TodoActions = ({ onAddTodo, searchTerm, onSearchTermChange, onSearch }) => {
  return (
    <div className="todo-actions flex items-center justify-between mb-6">
      <button
        id="add-todo-btn"
        className="btn btn-primary flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        onClick={onAddTodo}
      >
        <Plus size={16} />
        <span>Add Todo</span>
      </button>

      <SearchBar 
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        onSearch={onSearch}
      />
    </div>
  );
};

export default TodoActions ;