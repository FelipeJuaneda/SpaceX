import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useFavoriteContext } from "../../context/FavoriteContext";

export const SortButton = () => {
  const { handleSort } = useFavoriteContext();
  const [isAscending, setIsAscending] = useState(() => {
    const storedSort = localStorage.getItem("sort");
    return storedSort ? storedSort === "ascend" : true;
  });

  useEffect(() => {
    handleSort(isAscending ? "ascend" : "descend");
    localStorage.setItem("sort", isAscending ? "ascend" : "descend");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAscending]);

  const toggleSort = () => {
    setIsAscending((prevIsAscending) => !prevIsAscending);
  };

  return (
    <Button
      sx={{
        padding: "0 30px",
        margin: "0 30px",
        color: "#ffffff78",
        borderColor: "#ffffff78",
        ":hover": {
          borderColor: "#FFFFFF",
        },
      }}
      variant="outlined"
      size="small"
      onClick={toggleSort}
    >
      {isAscending ? "Sort Z-A ↓" : "Sort A-Z ↓"}
    </Button>
  );
};
