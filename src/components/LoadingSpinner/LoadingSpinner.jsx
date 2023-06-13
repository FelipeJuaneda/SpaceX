import { CircularProgress, Stack } from "@mui/material";

export const LoadingSpinner = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100vh"
      backgroundColor="#121212"
    >
      <CircularProgress color="inherit" />
    </Stack>
  );
};
