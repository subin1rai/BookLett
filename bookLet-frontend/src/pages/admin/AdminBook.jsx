import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import images from "../../assets/assets";

const AdminBook = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("grid"); // grid or list
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get("/bookcrud/getallbooks", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        
        if (Array.isArray(res.data)) {
          setBooks(res.data);
        } else if (Array.isArray(res.data.books)) {
          setBooks(res.data.books);
        } else {
          console.log("Unexpected data format:", res.data);
          setBooks([]);
        }
      } catch (err) {
        console.log("Failed to fetch books:", err);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F1F2EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-[#435058] rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Books Management</h1>
              <p className="text-gray-300 mt-1">Manage your book inventory</p>
            </div>
            <button
              onClick={() => navigate("/admin/books/addBooks")}
              className="bg-[#DCF763] hover:bg-opacity-90 transition-colors text-[#435058] px-6 py-3 rounded-md font-bold flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Book
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#DCF763] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#435058] text-sm font-medium">View:</span>
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setCurrentView("grid")}
                className={`p-2 ${currentView === "grid" ? "bg-[#DCF763] text-[#435058]" : "bg-white text-gray-600"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentView("list")}
                className={`p-2 ${currentView === "list" ? "bg-[#DCF763] text-[#435058]" : "bg-white text-gray-600"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Books Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#435058]"></div>
              <p className="mt-4 text-[#435058] font-medium">Loading books...</p>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-4 text-xl font-bold text-[#435058]">No books found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm ? "No books match your search criteria." : "Your inventory is empty. Add a new book to get started."}
              </p>
              <button
                onClick={() => navigate("/admin/books/addBooks")}
                className="mt-6 inline-flex items-center px-4 py-2 bg-[#DCF763] text-[#435058] rounded-md font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Book
              </button>
            </div>
          </div>
        ) : currentView === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.bookId} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src={book.imageUrl ? book.imageUrl : images.user_icon}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#DCF763] text-[#435058]">
                      {book.genre}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#435058] truncate">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-[#435058]">Rs.{book.price}</span>
                    <span className="text-gray-500 text-sm">Stock: {book.quantity}</span>
                  </div>
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => navigate(`/admin/books/view/${book.bookId}`)}
                      className="flex-1 text-center text-web-primary bg-web-secondary p-2 rounded-md font-semibold"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book, index) => (
                  <tr key={book.bookId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">#{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-md object-cover shadow-sm" 
                            src={book.imageUrl ? book.imageUrl : images.user_icon}
                            alt={book.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-[#435058]">{book.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#DCF763] text-[#435058]">
                        {book.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#435058]">
                      Rs.{book.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {book.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => navigate(`/admin/books/view/${book.bookId}`)}
                        className="text-web-primary bg-web-secondary p-1 px-4 rounded-md font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBook;