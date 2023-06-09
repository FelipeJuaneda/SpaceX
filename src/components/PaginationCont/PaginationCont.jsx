import { Pagination, Stack } from "@mui/material";

const PaginationCont = ({ count, page, onChange }) => {
  return (
    <Stack alignItems={"end"} padding={"30px"} backgroundColor="#121212">
      {count > 0 && (
        <Pagination
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "white",
              color: "black",
            },
          }}
          count={count}
          page={page}
          onChange={onChange}
        />
      )}
    </Stack>
  );
};

export default PaginationCont;
