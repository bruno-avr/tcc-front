import { Box, CircularProgress } from "@mui/material";
import React from "react";

export default function WaitLoading({ loading, children }) {
  if (loading)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight={100}
      >
        <CircularProgress />
      </Box>
    );
  return children;
}
