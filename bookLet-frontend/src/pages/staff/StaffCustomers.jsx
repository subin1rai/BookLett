import React, { useEffect, useState } from "react";
import SearchComponent from "../../components/basic components/SearchComponent";
import apiClient from "../../api/axios";
import UserListTable from "../../components/admin/user list/UserListTable";

const StaffCustomers = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");

  const getusers = async (page = pageNumber) => {
    try {
      const { data } = await apiClient.get(
        `/user/getAllUsers?page=${page}&pageSize=${pageSize}&search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      if (data.status == "success") {
        setUsers(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  useEffect(() => {
    getusers(1);
  }, []);
  return (
    <div>
      <div className="mb-4">
        <SearchComponent
          value={query}
          onChange={setQuery}
          onSubmit={getusers}
          placeholder="Search user by username or email..."
        />
      </div>
      <div>
        <UserListTable
          totalPages={totalPages}
          currentPage={pageNumber}
          onPageChange={(page) => {
            setPageNumber(page);
            getusers(page);
          }}
          users={users}
        />
      </div>
    </div>
  );
};

export default StaffCustomers;
