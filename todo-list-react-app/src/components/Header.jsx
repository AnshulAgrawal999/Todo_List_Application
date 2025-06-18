
import { FileText } from 'lucide-react' ;    

import UserSwitcher from './UserSwitcher';

import UserProfile from './UserProfile';


// components/Header.jsx

const Header = ({ currentUser, users, onExport, onUserSwitch, showUserDropdown, setShowUserDropdown }) => {
  return (
    <header className="app-header bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
        
        <div className="user-controls flex items-center space-x-4">
          <button 
            id="export-btn" 
            className="btn btn-secondary flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            onClick={onExport}
          >
            <FileText size={16} />
            <span>Export</span>
          </button>

          <UserSwitcher 
            currentUser={currentUser}
            users={users}
            onUserSwitch={onUserSwitch}
            showDropdown={showUserDropdown}
            setShowDropdown={setShowUserDropdown}
          />

          <UserProfile user={currentUser} />
        </div>
      </div>
    </header>
  );
};

export default Header;