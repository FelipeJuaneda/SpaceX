import { useState } from "react";

const usePagination = (data, pageSize) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPageCount = Math.ceil(data.length / pageSize);

  const getCurrentPageData = () => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  return {
    currentPage,
    totalPageCount,
    getCurrentPageData,
    handlePageChange,
  };
};

export default usePagination;
