
import { ChevronLeft, ChevronRight } from 'lucide-react';



// components/Pagination.jsx


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-controls flex items-center justify-center space-x-4 mt-8">
      <button
        className="pagination-prev flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>
      
      <div className="pagination-pages">
        <span className="pagination-current">{currentPage}</span>
        <span> / </span>
        <span className="pagination-total">{totalPages}</span>
      </div>
      
      <button
        className="pagination-next flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;