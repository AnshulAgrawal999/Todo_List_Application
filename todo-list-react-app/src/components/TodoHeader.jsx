
import { useState } from 'react';

// Header Component
const TodoHeader = ({ currentUser, users, onUserSwitch, onExport }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="app-header">
            <h1>Todo List</h1>
            <div className="user-controls">
                <button id="export-btn" className="btn btn-secondary" onClick={onExport}>
                    <i className="fas fa-file-export"></i> Export
                </button>
                
                <div className="user-switcher">
                    <button 
                        className="user-switcher-btn"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className="current-username">{currentUser.displayName}</span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    {dropdownOpen && (
                        <div className="user-dropdown">
                            {users.map(user => (
                                <div 
                                    key={user.id}
                                    className="user-dropdown-item" 
                                    data-username={user.username}
                                    onClick={() => {
                                        onUserSwitch(user.username);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <img src={user.avatar} alt={user.displayName} className="avatar-small" />
                                    <span>{user.displayName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="user-profile">
                    <span className="username">{currentUser.displayName}</span>
                    <img src={currentUser.avatar} alt="User avatar" className="avatar" />
                </div>
            </div>
        </header>
    );
};
