
import { useState, useEffect } from 'react';

import avatar from '../assets/placeholder-avatar.png'; // Placeholder avatar image

import TodoHeader from './TodoHeader.jsx';

import TodoSidebar from './TodoSidebar.jsx';

import TodoContent from './TodoContent.jsx';

// Sample users data
const initialUsers = [
    {
        id: 1,
        username: 'john_doe',
        displayName: 'John Doe',
        avatar
    },
    {
        id: 2,
        username: 'jane_smith',
        displayName: 'Jane Smith',
        avatar
    },
    {
        id: 3,
        username: 'bob_brown',
        displayName: 'Bob Brown',
        avatar
    },
    {
        id: 4,
        username: 'alice_johnson',
        displayName: 'Alice Johnson',
        avatar
    },
    {
        id: 5,
        username: 'charlie_davis',
        displayName: 'Charlie Davis',
        avatar
    }
];

// Sample todo data
const initialTodos = [
    {
        id: 1,
        title: 'Complete the todo app assignment',
        description: 'Implement all required features of the todo application.',
        priority: 'high',
        completed: false,
        tags: ['work', 'coding'],
        users: ['@john_doe'],
        notes: [
            {
                content: 'This is a sample note for the todo item.',
                date: 'May 10, 2023'
            }
        ],
        userId: 1
    }
];


// Main Todo App Component
const TodoApp = () => {
    const [users] = useState(initialUsers);
    const [currentUser, setCurrentUser] = useState(initialUsers[0]);
    const [todos, setTodos] = useState(initialTodos);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [filters, setFilters] = useState({ priorities: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(10);

    // Filter todos based on current user and filters
    useEffect(() => {
        let userTodos = todos.filter(todo => todo.userId === currentUser.id);
        
        if (filters.priorities.length > 0) {
            userTodos = userTodos.filter(todo => filters.priorities.includes(todo.priority));
        }
        
        setFilteredTodos(userTodos);
    }, [todos, currentUser, filters]);

    const handleUserSwitch = (username) => {
        const user = users.find(u => u.username === username);
        if (user) {
            setCurrentUser(user);
        }
    };

    const handleExport = () => {
        alert(`Exporting todos for user: ${currentUser.displayName}`);
    };

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
    };

    const handleAddTodo = () => {
        alert('You would add a new todo here');
    };

    const handleSearch = (searchTerm) => {
        alert(`Searching for: ${searchTerm}`);
    };

    const handleToggleTodo = (todoId) => {
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleEditTodo = (todoId) => {
        const todo = todos.find(t => t.id === todoId);
        if (todo) {
            alert(`You would edit todo ID: ${todoId}\nCurrent Title: ${todo.title}\nCurrent Priority: ${todo.priority}`);
        }
    };

    const handleDeleteTodo = (todoId) => {
        const confirmed = window.confirm(`Are you sure you want to delete todo ID: ${todoId}?`);
        if (confirmed) {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        }
    };

    const handleAddNote = (todoId) => {
        alert(`You would add a note to todo ID: ${todoId}`);
    };

    const handleShowDetails = (todoId) => {
        const todo = todos.find(t => t.id === todoId);
        if (todo) {
            alert(`Todo Details:\nTitle: ${todo.title}\nDescription: ${todo.description}\nPriority: ${todo.priority}\nTags: ${todo.tags.join(', ')}\nAssigned Users: ${todo.users.join(', ')}\nNotes: ${todo.notes.length} note(s)`);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            alert(`Navigating to page ${page}`);
        }
    };

    return (
        <div className="app-container">
            <TodoHeader 
                currentUser={currentUser}
                users={users}
                onUserSwitch={handleUserSwitch}
                onExport={handleExport}
            />
            
            <main className="app-main">
                <TodoSidebar onFilter={handleFilter} />
                
                <TodoContent 
                    todos={filteredTodos}
                    currentUser={currentUser}
                    onAddTodo={handleAddTodo}
                    onSearch={handleSearch}
                    onToggleTodo={handleToggleTodo}
                    onEditTodo={handleEditTodo}
                    onDeleteTodo={handleDeleteTodo}
                    onAddNote={handleAddNote}
                    onShowDetails={handleShowDetails}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </main>
        </div>
    );
};

export default TodoApp;