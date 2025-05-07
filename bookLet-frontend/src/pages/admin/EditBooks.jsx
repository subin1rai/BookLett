import React, { useState, useEffect } from "react";
import { Edit, Save, X, Image } from "lucide-react";
import apiClient from "../../api/axios";
import { useParams } from "react-router-dom";
import Loading from "../../components/basic components/Loading";
import { toast } from "react-toastify";

const EditBooks = () => {
  const [book, setBook] = useState();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { bookId } = useParams();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await apiClient.get(
          `/bookcrud/getbookbyid/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBook(data.data);
        setLoading(false);
      } catch (err) {
        console.log("Failed to fetch book details:", err);
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevState) => ({
      ...prevState,
      [name]:
        name === "price" || name === "quantity" || name === "discount"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      Object.keys(book).forEach((key) => {
        if (key === "publicationDate") {
          const utcDate = new Date(book[key]).toISOString();
          formData.append(key, utcDate);
        } else {
          formData.append(key, book[key]);
        }
      });

      if (image) {
        formData.append("image", image);
      }

      const response = await apiClient.put(
        `/bookcrud/updatebook/${bookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTimeout(() => {
        toast.success("Book Updated successfully!");
        setLoading(false);
        window.location.href = `/admin/books/${bookId}`;
      }, 2000);
    } catch (err) {
      console.log(err.message || "Error updating book");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return book ? (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Edit className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Edit Book</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={book.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={book.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={book.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={book.isbn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publisher
            </label>
            <input
              type="text"
              name="publisher"
              value={book.publisher}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Date
            </label>
            <input
              type="date"
              name="publicationDate"
              value={book.publicationDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={book.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={book.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={book.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              name="format"
              value={book.format}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Format</option>
              <option value="Paperback">Paperback</option>
              <option value="Hardcover">Hardcover</option>
              <option value="Signed Edition">Signed Edition</option>
              <option value="Limited Edition">Limited Edition</option>
              <option value="First Edition">First Edition</option>
              <option value="Collector’s Edition">Collector’s Edition</option>
              <option value="Author’s Edition">Author’s Edition</option>
              <option value="Deluxe Edition">Deluxe Edition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              name="discount"
              value={book.discount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={book.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Cover Image
          </label>
          <div className="flex items-center space-x-4">
            {imagePreview && (
              <div className="relative w-32 h-44 border rounded-md overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Book cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <label className="flex items-center justify-center w-full h-12 px-4 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Image className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {image ? image.name : "Choose new image"}
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default EditBooks;
