import { FaInfoCircle, FaHeart } from "react-icons/fa";

export default function BookCard({ book, onMoreClick }) {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center h-full justify-between transform transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300">
      {/* Book Cover - full width */}
      <img
        src={book.coverImageUrl}
        alt={book.title}
        className="w-full h-64 object-contain rounded-xl mb-4 shadow-md"
      />

      {/* Title & Author */}
      <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{book.author}</p>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-3 line-clamp-4 px-2">{book.description}</p>

      {/* Availability & Likes */}
      <div className="flex items-center justify-between w-full text-sm text-gray-700 mb-3 px-2">
        <span className={`font-semibold ${isAvailable ? "text-green-600" : "text-red-600"}`}>
          {isAvailable ? `Available (${book.availableCopies})` : "Borrowed"}
        </span>
        <span className="flex items-center gap-1 text-red-500 font-semibold">
          <FaHeart /> {book.likes}
        </span>
      </div>

      {/* More Button */}
      <div className="flex gap-2 w-full">
        {onMoreClick && (
          <button
            className="flex-1 bg-blue-600 text-white rounded-xl py-2 text-sm font-semibold shadow-md hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-1"
            onClick={() => onMoreClick(book)}
          >
            <FaInfoCircle /> More
          </button>
        )}
      </div>
    </div>
  );
}
