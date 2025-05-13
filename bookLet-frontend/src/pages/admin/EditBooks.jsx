import React, { useState, useEffect } from "react";
import { Edit, Save, X, Image, Loader2 } from "lucide-react";
import apiClient from "../../api/axios";
import { useParams } from "react-router-dom";
import Loading from "../../components/basic components/Loading";
import { toast } from "react-toastify";

const EditBooks = () => {
  const [book, setBook] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      } catch (err) {
        console.log("Failed to fetch book details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
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
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(book).forEach((key) => {
        if (key === "publicationDate") {
          formData.append(key, new Date(book[key]).toISOString());
        } else {
          formData.append(key, book[key]);
        }
      });

      if (image) {
        formData.append("image", image);
      } else {
        // Send an empty field if backend requires it
        formData.append("image", "");
      }

      await apiClient.put(`/bookcrud/updatebook/${bookId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Book updated successfully!");
      setTimeout(() => {
        window.location.href = `/admin/books/${bookId}`;
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update book. Please check your input.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading || !book) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Edit className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Edit Book</h1>
      </div>

      {/* The entire form remains same — omitted here for brevity */}

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
          disabled={isSubmitting}
          className={`px-4 py-2 border rounded-md font-medium text-white flex items-center ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditBooks;
