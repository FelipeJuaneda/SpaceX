import { Box, InputAdornment, TextField } from "@mui/material";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchBar = ({ setSearchTerm }) => {
  const handleSearchTermChange = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  return (
    <Box
      sx={{
        background: "#121212",
        width: "100%",
      }}
    >
      <TextField
        sx={{
          width: { xs: "80%", lg: "50%" },
          margin: "30px",
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212",
          borderRadius: "8px",
        }}
        size="small"
        onChange={handleSearchTermChange}
        placeholder="Search all launches..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BiSearchAlt2 color="#ffffff78" />
            </InputAdornment>
          ),
          style: {
            color: "#ffffff78",
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
