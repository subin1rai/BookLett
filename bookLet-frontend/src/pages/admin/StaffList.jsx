import React, { useEffect, useState } from "react";
import SearchComponent from "../../components/basic components/SearchComponent";
import apiClient from "../../api/axios";
import UserListTable from "../../components/admin/user list/UserListTable";

const StaffList = () => {
  const [query, setQuery] = useState("");
  const [Staffs, setStaffs] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");

  const getStaffs = async (page = pageNumber) => {
    try {
      const { data } = await apiClient.get(
        `/user/getAllStaffs?page=${page}&pageSize=${pageSize}&search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      if (data.status == "success") {
        setStaffs(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log("Error fetching Staffs", error);
    }
  };

  useEffect(() => {
    getStaffs(1);
  }, []);
  return (
    <div>
      <div className="mb-4">
        <SearchComponent
          value={query}
          onChange={setQuery}
          onSubmit={getStaffs}
          placeholder="Search staff by username or email..."
        />
      </div>
      <div>
        <UserListTable
          totalPages={totalPages}
          currentPage={pageNumber}
          onPageChange={(page) => {
            setPageNumber(page);
            getStaffs(page);
          }}
          users={Staffs}
        />
      </div>
    </div>
  );
};

export default StaffList;
