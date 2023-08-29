import { useEffect, useState } from "react";

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

  const adjustPageIfEmpty = () => {
    const currentPageData = getCurrentPageData();
    if (currentPageData.length === 0 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    adjustPageIfEmpty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentPage]);

  return {
    currentPage,
    totalPageCount,
    getCurrentPageData,
    handlePageChange,
  };
};

export default usePagination;
