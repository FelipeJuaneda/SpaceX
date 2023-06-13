import { Box, InputAdornment, TextField } from "@mui/material";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchBar = ({ setSearchTerm }) => {
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box
      sx={{
        background: "#121212",
        padding: "30px",
      }}
    >
      <TextField
        sx={{
          width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212",
          borderRadius: "8px",
          "& .MuiInputBase-input": {
            color: "#ffffff78",
          },
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
        }}
      />
    </Box>
  );
};

export default SearchBar;
