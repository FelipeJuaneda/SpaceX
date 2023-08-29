import { useState } from "react";

const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return {
    setSearchTerm,
    searchTerm,
  };
};

export default useSearch;
