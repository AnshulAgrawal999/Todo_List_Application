
import { useState, useEffect } from 'react';

import Header from './Header';

import Sidebar from './Sidebar';

import TodoActions from './TodoActions';

import TodoList from './TodoList';

import Pagination from './Pagination';

import AddTodoModal from './AddTodoModal';

import EditTodoModal from './EditTodoModal';

import AddNoteModal from './AddNoteModal';

import { todoApi } from '../api/todoApi' ;


const CURRENT_USER = 'john_doe';


// Main TodoApp component


const TodoApp = () => {
  // State
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

  const api = todoApi();

  // API Functions
  const loadUsers = async () => {
    try {
      const data = await api.fetchUsers();
      setUsers(data);
      const user = data.find(u => u.username === CURRENT_USER);
      setCurrentUser(user || data[0]);
    } catch (error) {
      setError('Failed to load users');
    }
  };

  const loadTodos = async (page = 1) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const data = await api.fetchTodos(currentUser.username, page, searchTerm, filters);
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
    loadTodos(1);
  };

  const handlePageChange = (page) => {
    loadTodos(page);
  };

  const handleAddTodo = async () => {
    try {
      await api.createTodo(currentUser.username, newTodo);
      loadTodos(pagination.currentPage);
      setShowAddModal(false);
      setNewTodo({ title: '', description: '', priority: 'medium', tags: [], assignedUsers: [] });
    } catch (error) {
      setError('Failed to create todo');
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };

  const handleUpdateTodo = async () => {
    try {
      await api.updateTodo(currentUser.username, editingTodo._id, editingTodo);
      loadTodos(pagination.currentPage);
      setShowEditModal(false);
      setEditingTodo(null);
    } catch (error) {
      setError('Failed to update todo');
    }
  };

  const handleToggleComplete = async (todoId, completed) => {
    try {
      const todo = todos.find(t => t._id === todoId);
      await api.updateTodo(currentUser.username, todoId, { ...todo, completed });
      loadTodos(pagination.currentPage);
    } catch (error) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      await api.deleteTodo(currentUser.username, todoId);
      loadTodos(pagination.currentPage);
    } catch (error) {
      setError('Failed to delete todo');
    }
  };

  const handleAddNote = (todoId) => {
    setEditingTodo(todos.find(t => t._id === todoId));
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    try {
      await api.addNote(currentUser.username, editingTodo._id, noteContent.trim());
      loadTodos(pagination.currentPage);
      setShowNoteModal(false);
      setNoteContent('');
    } catch (error) {
      setError('Failed to add note');
    }
  };

  const handleExport = async () => {
    try {
      await api.exportTodos(currentUser.username);
    } catch (error) {
      setError('Failed to export todos');
    }
  };

  // Effects
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTodos(1);
    }
  }, [currentUser, searchTerm, filters]);

  if (loading && todos.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="app-container min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser}
        users={users}
        onExport={handleExport}
        onUserSwitch={handleUserSwitch}
        showUserDropdown={showUserDropdown}
        setShowUserDropdown={setShowUserDropdown}
      />

      <main className="app-main flex">
        <Sidebar 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <section className="todo-content flex-1 p-6">
          <TodoActions 
            onAddTodo={() => setShowAddModal(true)}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearch}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <TodoList 
            todos={todos}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
            onAddNote={handleAddNote}
          />

          <Pagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      </main>

      {/* Modals */}
      <AddTodoModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        todo={newTodo}
        onChange={setNewTodo}
        onSubmit={handleAddTodo}
      />

      <EditTodoModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        todo={editingTodo}
        onChange={setEditingTodo}
        onSubmit={handleUpdateTodo}
      />

      <AddNoteModal 
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        todoTitle={editingTodo?.title}
        noteContent={noteContent}
        onChange={setNoteContent}
        onSubmit={handleSaveNote}
      />
    </div>
  );
};

export default TodoApp;