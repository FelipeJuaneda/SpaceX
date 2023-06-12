import { Pagination, Stack } from "@mui/material";

const PaginationCont = ({ count, page, onChange }) => {
  return (
    <Stack alignItems={"end"} padding={"30px"} backgroundColor="#121212">
      <Pagination
        size="small"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "white",
          },
        }}
        count={count}
        page={page}
        onChange={onChange}
      />
    </Stack>
  );
};

export default PaginationCont;
