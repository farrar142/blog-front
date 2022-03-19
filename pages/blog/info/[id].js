import { TextField, Container, Paper } from "@mui/material";
import { createRef, useEffect, useState } from "react";

export default () => {
  const viewerRef = createRef();
  const [context, setContext] = useState("");

  function inputHandler(e) {
    setContext(e.target.value);
    console.log(e.target.value);
  }
  useEffect(() => {
    console.log(viewerRef.current);
    viewerRef.current.innerHTML = context;
  }, [context]);
  return (
    <Container sx={styles.con}>
      <TextField sx={styles.textfield} onChange={inputHandler} />
      <Paper sx={styles.viewerfield} ref={viewerRef}>
        {" "}
        asd
      </Paper>
    </Container>
  );
};

const styles = {
  con: {
    width: "90vw",
    display: "flex",
    flexDirection: "row",
  },
  textfield: {
    dispaly: "block",
    width: "50%",
  },
  viewerfield: {
    dispaly: "block",
    width: "50%",
  },
};
