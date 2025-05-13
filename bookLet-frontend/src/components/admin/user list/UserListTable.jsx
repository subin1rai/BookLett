import {
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import apiClient from "../../../api/axios";

const UserListTable = ({ users, totalPages, currentPage, onPageChange }) => {
  const getPaginationRange = () => {
    let range = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      range = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      range = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );

      if (startPage > 1) {
        range = [1, "...", ...range];
      }

      if (endPage < totalPages) {
        range = [...range, "...", totalPages];
      }
    }

    return range;
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderVerificationStatus = (isVerified) => {
    const verified =
      typeof isVerified === "string"
        ? isVerified.toLowerCase() === "true"
        : Boolean(isVerified);

    return (
      <div
        className={`flex items-center gap-1 ${
          verified ? "text-blue-600" : "text-red-600"
        }`}
      >
        {verified ? (
          <>
            <CheckCircle size={16} className="text-blue-600" />
            <span className="font-medium">Verified</span>
          </>
        ) : (
          <>
            <XCircle size={16} className="text-red-600" />
            <span className="font-medium">Not Verified</span>
          </>
        )}
      </div>
    );
  };

  const handleRoleChange = async (userId, newRole, currentRole) => {
    if (newRole === currentRole) return;
    console.log(newRole);

    try {
      const token = localStorage.getItem("token");
      const { data } = await apiClient.put(
        `/user/updaterole/${userId}`,
        JSON.stringify(newRole),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="w-full">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 text-left text-sm text-gray-500">
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Username</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Joined At</th>
            <th className="py-3 px-4">IsVerified</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.length > 0 ? (
            users.map((user) => {
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                    {user.id}
                  </td>
                  <td className="py-4 px-4 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                    {user.username}
                  </td>
                  <td className="py-4 px-4 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                    {user.email}
                  </td>
                  <td className="py-4 px-4 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value, user.role)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Staff">Staff</option>
                      <option value="User">User</option>
                    </select>
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600 flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 px-4 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                    {renderVerificationStatus(user.isVerified)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white py-3 px-4 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
              currentPage === 1
                ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
              currentPage === totalPages
                ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span> pages
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {getPaginationRange().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListTable;
