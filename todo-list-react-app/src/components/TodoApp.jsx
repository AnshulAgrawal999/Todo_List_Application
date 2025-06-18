import { useState, useEffect } from 'react';
import { Search, Plus, FileText, Edit, Trash2, StickyNote, ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const BASE_URL = 'http://localhost:5000';
const CURRENT_USER = 'john_doe';

const TodoApp = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priorities: [],
    tags: []
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTodos: 0
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium',
    tags: [],
    assignedUsers: []
  });

  // API Functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiCall('/api/users');
      setUsers(data);
      const user = data.find(u => u.username === CURRENT_USER);
      setCurrentUser(user || data[0]);
    } catch (error) {
      setError('Failed to load users');
    }
  };

  const fetchTodos = async (page = 1) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        user: currentUser.username,
        page: page.toString(),
        limit: '10'
      });
      
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filters.priorities.length > 0) queryParams.append('priority', filters.priorities.join(','));
      if (filters.tags.length > 0) queryParams.append('tags', filters.tags.join(','));
      
      const data = await apiCall(`/api/todos?${queryParams}`);
      setTodos(data.todos || []);
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalTodos: data.totalTodos || 0
      });
    } catch (error) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData) => {
    try {
      await apiCall(`/api/todos?user=${currentUser.username}`, {
        method: 'POST',
        body: JSON.stringify(todoData)
      });
      fetchTodos(pagination.currentPage);
      setShowAddModal(false);
      setNewTodo({ title: '', description: '', priority: 'medium', tags: [], assignedUsers: [] });
    } catch (error) {
      setError('Failed to create todo');
    }
  };

  const updateTodo = async (todoId, todoData) => {
    try {
      await apiCall(`/api/todos/${todoId}?user=${currentUser.username}`, {
        method: 'PUT',
        body: JSON.stringify(todoData)
      });
      fetchTodos(pagination.currentPage);
      setShowEditModal(false);
      setEditingTodo(null);
    } catch (error) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      await apiCall(`/api/todos/${todoId}?user=${currentUser.username}`, {
        method: 'DELETE'
      });
      fetchTodos(pagination.currentPage);
    } catch (error) {
      setError('Failed to delete todo');
    }
  };

  const addNote = async (todoId, content) => {
    try {
      await apiCall(`/api/todos/${todoId}/notes?user=${currentUser.username}`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      fetchTodos(pagination.currentPage);
      setShowNoteModal(false);
      setNoteContent('');
    } catch (error) {
      setError('Failed to add note');
    }
  };

  const exportTodos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/todos/export?user=${currentUser.username}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todos-${currentUser.username}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to export todos');
    }
  };

  // Effects
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTodos(1);
    }
  }, [currentUser, searchTerm, filters]);

  // Event Handlers
  const handleUserSwitch = (username) => {
    const user = users.find(u => u.username === username);
    setCurrentUser(user);
    setShowUserDropdown(false);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleSearch = () => {
    fetchTodos(1);
  };

  const handlePageChange = (page) => {
    fetchTodos(page);
  };

  const handleAddTodo = () => {
    createTodo(newTodo);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };

  const handleUpdateTodo = () => {
    if (editingTodo) {
      updateTodo(editingTodo._id, editingTodo);
    }
  };

  const handleAddNote = (todoId) => {
    setEditingTodo(todos.find(t => t._id === todoId));
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (editingTodo && noteContent.trim()) {
      addNote(editingTodo._id, noteContent.trim());
    }
  };

  if (loading && todos.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="app-container min-h-screen bg-gray-50">
      {/* Header */}
      <header className="app-header bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
          
          <div className="user-controls flex items-center space-x-4">
            <button 
              id="export-btn" 
              className="btn btn-secondary flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              onClick={exportTodos}
            >
              <FileText size={16} />
              <span>Export</span>
            </button>

            {/* User Switcher */}
            <div className="user-switcher relative">
              <button 
                className="user-switcher-btn flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <span className="current-username">{currentUser?.username || 'Loading...'}</span>
                <ChevronDown size={16} />
              </button>
              
              {showUserDropdown && (
                <div className="user-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                  {users.map(user => (
                    <div
                      key={user._id}
                      className="user-dropdown-item flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      data-username={user.username}
                      onClick={() => handleUserSwitch(user.username)}
                    >
                      <div className="avatar-small w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.username[0].toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="user-profile flex items-center space-x-3">
              <span className="username font-medium">{currentUser?.username}</span>
              <div className="avatar w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {currentUser?.username?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main flex">
        {/* Sidebar */}
        <aside className="app-sidebar w-64 bg-white shadow-sm border-r p-6">
          <div className="filter-section">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="filter-group mb-6">
              <h4 className="text-sm font-medium mb-2">Priority</h4>
              <div className="filter-options space-y-2">
                {['high', 'medium', 'low'].map(priority => (
                  <label key={priority} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={priority}
                      checked={filters.priorities.includes(priority)}
                      onChange={(e) => handleFilterChange('priorities', priority)}
                      className="rounded"
                    />
                    <span className="capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="filter-options tags-filter">
                <div className="tag-placeholder text-sm text-gray-500">
                  Tags will appear here based on your todos
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="todo-content flex-1 p-6">
          <div className="todo-actions flex items-center justify-between mb-6">
            <button
              id="add-todo-btn"
              className="btn btn-primary flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              <span>Add Todo</span>
            </button>

            <div className="search-container flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search todos..."
                className="search-input px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                className="search-btn px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={handleSearch}
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Todo List */}
          <div className="todo-list space-y-4">
            {todos.length === 0 ? (
              <div className="no-todos text-center text-gray-500 py-8">
                No todos found. Add a new one!
              </div>
            ) : (
              todos.map(todo => (
                <div key={todo._id} className="todo-item bg-white rounded-lg shadow-sm border p-4" data-id={todo._id}>
                  <div className="flex items-start space-x-4">
                    <div className="todo-checkbox">
                      <input
                        type="checkbox"
                        id={`todo-${todo._id}`}
                        checked={todo.completed || false}
                        onChange={(e) => updateTodo(todo._id, { ...todo, completed: e.target.checked })}
                        className="rounded"
                      />
                    </div>

                    <div className="todo-content flex-1">
                      <h3 className="todo-title text-lg font-medium mb-2">{todo.title}</h3>
                      <div className="todo-meta flex items-center space-x-4 text-sm">
                        <span className={`todo-priority priority-${todo.priority} px-2 py-1 rounded-full text-xs font-medium ${
                          todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                          todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
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
                    </div>

                    <div className="todo-actions flex items-center space-x-2">
                      <button
                        className="todo-note-btn p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Add note"
                        onClick={() => handleAddNote(todo._id)}
                      >
                        <StickyNote size={16} />
                      </button>
                      <button
                        className="todo-edit-btn p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit todo"
                        onClick={() => handleEditTodo(todo)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="todo-delete-btn p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete todo"
                        onClick={() => deleteTodo(todo._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="pagination-controls flex items-center justify-center space-x-4 mt-8">
            <button
              className="pagination-prev flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.currentPage <= 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            
            <div className="pagination-pages">
              <span className="pagination-current">{pagination.currentPage}</span>
              <span> / </span>
              <span className="pagination-total">{pagination.totalPages}</span>
            </div>
            
            <button
              className="pagination-next flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTodo.title}
                onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
              />
              <textarea
                placeholder="Description"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={newTodo.description}
                onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
              />
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTodo.priority}
                onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setNewTodo({...newTodo, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
              />
              <input
                type="text"
                placeholder="Assigned Users (comma separated, e.g., @john_doe)"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setNewTodo({...newTodo, assignedUsers: e.target.value.split(',').map(u => u.trim()).filter(u => u)})}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleAddTodo}
                disabled={!newTodo.title.trim()}
              >
                Add Todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Todo Modal */}
      {showEditModal && editingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editingTodo.title}
                onChange={(e) => setEditingTodo({...editingTodo, title: e.target.value})}
              />
              <textarea
                placeholder="Description"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={editingTodo.description || ''}
                onChange={(e) => setEditingTodo({...editingTodo, description: e.target.value})}
              />
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editingTodo.priority}
                onChange={(e) => setEditingTodo({...editingTodo, priority: e.target.value})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleUpdateTodo}
              >
                Update Todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && editingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h2 className="text-xl font-bold mb-4">Add Note to: {editingTodo.title}</h2>
            <textarea
              placeholder="Enter your note..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowNoteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleSaveNote}
                disabled={!noteContent.trim()}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;