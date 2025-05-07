const genreOptions = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Fantasy",
  "Mystery",
  "Romance",
  "Horror",
];
import React, { useState } from "react";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

const AddBooks = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    description: "",
    publisher: "",
    publicationDate: "",
    price: "",
    quantity: "",
    language: "",
    discount: "",
    format: "",
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("Processing...");

    const data = new FormData();

    for (const key in formData) {
      if (key === "publicationDate" && formData[key]) {
        const utcDate = new Date(formData[key]).toISOString();
        data.append(key, utcDate);
      } else {
        data.append(key, formData[key]);
      }
    }

    if (image) {
      data.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.post("/bookcrud/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);

      setTimeout(() => {
        toast.success("Book created successfully!");
        setIsSubmitting(false);
        setMessage(null);
        window.location.href = `/admin/books`;
      }, 1000);
    } catch (err) {
      console.error(err);
      console.log("Failed to create book");
      setIsSubmitting(false);
    }
  };

  // Group form fields for better layout
  const formFields = [
    [
      { label: "Title", name: "title" },
      { label: "Author", name: "author" },
    ],
    [
      { label: "Genre", name: "genre" },
      { label: "Format", name: "format" },
    ],
    [
      { label: "ISBN", name: "isbn" },
      { label: "Language", name: "language" },
    ],
    [
      { label: "Publisher", name: "publisher" },
      { label: "Publication Date", name: "publicationDate", type: "date" },
    ],
    [
      { label: "Price ($)", name: "price", type: "number" },
      { label: "Discount (%)", name: "discount", type: "number" },
    ],
    [{ label: "Quantity", name: "quantity", type: "number" }],
  ];

  return (
    <div className="min-h-screen bg-[#F1F2EE] p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#435058] p-6 text-white">
          <h2 className="text-2xl font-bold">Add New Book</h2>
          <p className="text-sm opacity-80">
            Enter book details to add to inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {formFields.flat().map(({ label, name, type = "text" }) => (
              <div
                key={name}
                className={name === "quantity" ? "md:col-span-2" : ""}
              >
                <label className="block text-[#435058] font-medium mb-2">
                  {label}
                </label>
                {label === "Genre" ? (
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#DCF763] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Genre</option>
                    {genreOptions.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                ) : label === "Format" ? (
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#DCF763] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Format</option>
                    <option value="Paperback">Paperback</option>
                    <option value="Hardcover">Hardcover</option>
                    <option value="Signed Edition">Signed Edition</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="First Edition">First Edition</option>
                    <option value="Collector’s Edition">
                      Collector’s Edition
                    </option>
                    <option value="Author’s Edition">Author’s Edition</option>
                    <option value="Deluxe Edition">Deluxe Edition</option>
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#DCF763] focus:border-transparent transition-all"
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-[#435058] font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#DCF763] focus:border-transparent transition-all"
              rows="4"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#435058] font-medium mb-2">
              Book Cover Image
            </label>
            <div className="flex items-start gap-6 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#DCF763] file:text-[#435058]"
                  />
                </div>
                <p className="mt-1 text-sm text-[#848C8E]">
                  Recommended: JPG or PNG, 300×450 pixels
                </p>
              </div>

              <div className="w-32 h-48 bg-gray-100 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src="/api/placeholder/200/300"
                    alt="Book cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-xs mt-1">No image</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 bg-[#F1F2EE] text-[#435058] font-medium rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#DCF763] text-[#435058] font-bold rounded-md hover:bg-opacity-90 transition-colors flex gap-2 items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#435058]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBooks;
