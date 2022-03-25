import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default (props) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "20px",
        margin: "0px",
        padding: "0px",
        marginTop: "74px",
      }}
    >
      <LinearProgress color="secondary" />
    </Box>
  );
};
