
import { ChevronDown } from 'lucide-react';

// components/UserSwitcher.jsx

const UserSwitcher = ({ currentUser, users, onUserSwitch, showDropdown, setShowDropdown }) => {
  return (
    <div className="user-switcher relative">
      <button 
        className="user-switcher-btn flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="current-username">{currentUser?.username || 'Loading...'}</span>
        <ChevronDown size={16} />
      </button>
      
      {showDropdown && (
        <div className="user-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
          {users.map(user => (
            <div
              key={user._id}
              className="user-dropdown-item flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
              data-username={user.username}
              onClick={() => onUserSwitch(user.username)}
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
  );
};

export default UserSwitcher;