
import { Search } from 'lucide-react';

// components/SearchBar.jsx


const SearchBar = ({ searchTerm, onSearchTermChange, onSearch }) => {
  return (
    <div className="search-container flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search todos..."
        className="search-input px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      />
      <button
        className="search-btn px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        onClick={onSearch}
      >
        <Search size={16} />
      </button>
    </div>
  );
};

export default SearchBar;