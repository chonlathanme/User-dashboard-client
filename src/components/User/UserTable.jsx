import React, { useEffect, useState, useMemo } from "react";
import userStore from "../../stores/userStore";
import useAuthStore from "../../stores/authStore";

const UserTable = () => {
  const actionGetUser = userStore((state) => state.actionGetUser);
  const user = userStore((state) => state.user);
  const loading = userStore((state) => state.loading);
  const actionCreateUsers = userStore((state) => state.actionCreateUsers);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sheetLink, setSheetLink] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    actionGetUser();
    console.log("Fetched user data:", user);
  }, [actionGetUser]);

  useEffect(() => {
    if (user && Array.isArray(user.users)) {
      if (searchQuery) {
        const filtered = user.users
          .slice(1)
          .filter((row) =>
            row.firstName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(user.users.slice(1));
      }
    } else if (Array.isArray(user) && user.length === 0) {
      setFilteredUsers([]);
    } else {
      console.error("User data is not in the expected format:", user);
      setFilteredUsers([]);
    }
    setCurrentPage(1);
  }, [searchQuery, user]);

  const handleCheckboxChange = (row) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some(
        (item) => JSON.stringify(item) === JSON.stringify(row)
      );

      if (isSelected) {
        return prev.filter(
          (item) => JSON.stringify(item) !== JSON.stringify(row)
        );
      } else {
        return [...prev, row];
      }
    });
  };

  const isRowSelected = (row) => {
    return selectedUsers.some(
      (item) => JSON.stringify(item) === JSON.stringify(row)
    );
  };

  const handleExport = async () => {
    if (selectedUsers.length === 0) {
      alert("กรุณาเลือกข้อมูลที่ต้องการ export");
      return;
    }

    try {
      console.log("Selected users for export:", selectedUsers);
      const result = await actionCreateUsers(selectedUsers);
      console.log("Export result:", result);

      if (result?.sheetUrl) {
        setSheetLink(result.sheetUrl);
        window.open(result.sheetUrl, "_blank");
      }
      await setSelectedUsers([]);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert(error.message || "เกิดข้อผิดพลาดในการ export ข้อมูล");
    }
  };

  const handleSort = (columnIndex) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === columnIndex) {
        return {
          key: columnIndex,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        key: columnIndex,
        direction: "asc",
      };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (!isNaN(aValue) && !isNaN(bValue)) {
        return sortConfig.direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      return sortConfig.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredUsers, sortConfig]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToDisplay = sortedData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="flex justify-center min-h-screen w-full bg-gray-50">
      <div className="container p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and export user data</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V7z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </button>
        </div>

        {/* Search and Export Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <button
              onClick={handleExport}
              disabled={selectedUsers.length === 0}
              className={`
                px-6 py-2 rounded-lg flex items-center gap-2 shadow-md
                ${
                  selectedUsers.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }
                transition-colors duration-200
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export ({selectedUsers.length} selected)
            </button>
          </div>
        </div>

        {/* Success Message */}
        {sheetLink && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-700">Export successful!</span>
            </div>
            <a
              href={sheetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              View Sheet
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="overflow-y-auto max-h-[600px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "ID",
                      "Firstname",
                      "Lastname",
                      "Email",
                      "Gender",
                    ].map((header, index) => (
                      <th
                        key={index}
                        onClick={() => handleSort(index)}
                        className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          {header}
                          {sortConfig.key === index && (
                            <span>
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(usersToDisplay) &&
                    usersToDisplay.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        onClick={() => handleCheckboxChange(row)}
                        className={`${
                          isRowSelected(row) ? "bg-blue-50" : "hover:bg-gray-50"
                        } transition-colors duration-150 cursor-pointer`}
                      >
                        {Object.values(row).map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
