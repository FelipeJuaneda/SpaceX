import { InputAdornment, TextField } from "@mui/material";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchBar = () => {
  return (
    <div>
      <TextField
        sx={{
          width: "30%",
          margin: "30px",
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212",
          borderRadius: "8px",
        }}
        size="small"
        placeholder="Search all launches..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BiSearchAlt2 style={{ color: "#ffffff78" }} />
            </InputAdornment>
          ),
          style: {
            color: "#ffffff78",
          },
        }}
      />
    </div>
  );
};

export default SearchBar;
