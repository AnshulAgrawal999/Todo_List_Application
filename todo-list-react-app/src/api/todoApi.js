

// const BASE_URL = 'http://localhost:5000';

const BASE_URL = 'https://todo-list-application-ieht.onrender.com';

export const todoApi = () => {
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
    return await apiCall('/api/users');
  };

  const fetchTodos = async (user, page = 1, searchTerm = '', filters = {}) => {
    const queryParams = new URLSearchParams({
      user,
      page: page.toString(),
      limit: '10'
    });
    
    if (searchTerm) queryParams.append('search', searchTerm);
    if (filters.priorities?.length > 0) queryParams.append('priority', filters.priorities.join(','));
    if (filters.tags?.length > 0) queryParams.append('tags', filters.tags.join(','));
    
    return await apiCall(`/api/todos?${queryParams}`);
  };

  const createTodo = async (user, todoData) => {
    return await apiCall(`/api/todos?user=${user}`, {
      method: 'POST',
      body: JSON.stringify(todoData)
    });
  };

  const updateTodo = async (user, todoId, todoData) => {
    return await apiCall(`/api/todos/${todoId}?user=${user}`, {
      method: 'PUT',
      body: JSON.stringify(todoData)
    });
  };

  const deleteTodo = async (user, todoId) => {
    return await apiCall(`/api/todos/${todoId}?user=${user}`, {
      method: 'DELETE'
    });
  };

  const addNote = async (user, todoId, content) => {
    return await apiCall(`/api/todos/${todoId}/notes?user=${user}`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  };

  const exportTodos = async (user) => {
    const response = await fetch(`${BASE_URL}/api/todos/export?user=${user}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos-${user}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    fetchUsers,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    addNote,
    exportTodos
  };
};

