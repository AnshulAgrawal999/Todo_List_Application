import { useState } from 'react';

// Sidebar Component
const TodoSidebar = ({ onFilter }) => {
    const [priorityFilters, setPriorityFilters] = useState([]);

    const handlePriorityChange = (priority) => {
        const newFilters = priorityFilters.includes(priority)
            ? priorityFilters.filter(p => p !== priority)
            : [...priorityFilters, priority];
        
        setPriorityFilters(newFilters);
        onFilter({ priorities: newFilters });
    };

    return (
        <aside className="app-sidebar">
            <div className="filter-section">
                <h3>Filters</h3>
                <div className="filter-group">
                    <h4>Priority</h4>
                    <div className="filter-options">
                        <label>
                            <input 
                                type="checkbox" 
                                value="high"
                                checked={priorityFilters.includes('high')}
                                onChange={() => handlePriorityChange('high')}
                            /> High
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                value="medium"
                                checked={priorityFilters.includes('medium')}
                                onChange={() => handlePriorityChange('medium')}
                            /> Medium
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                value="low"
                                checked={priorityFilters.includes('low')}
                                onChange={() => handlePriorityChange('low')}
                            /> Low
                        </label>
                    </div>
                </div>
                <div className="filter-group">
                    <h4>Tags</h4>
                    <div className="filter-options tags-filter">
                        <div className="tag-placeholder"></div>
                        <div className="tag-placeholder"></div>
                        <div className="tag-placeholder"></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};