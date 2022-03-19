import React from "react";
import { useRecoilState } from "recoil";
import { systemMessageState } from "../src/Atom";
import { Container, Box, Divider, Paper, Typography } from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import theme from "../src/theme";
export default (props) => {
  const [message, setMessage] = useRecoilState(systemMessageState);
  const messageHandler = (idx) => {
    setMessage(message.filter((value, index) => index !== idx));
    console.log("얏호!");
  };
  const render_message = () => {
    if (message.length >= 1) {
      return (
        <Paper sx={styles.msgCon}>
          {message.map((msg, index) => {
            return (
              <Box key={msg + index}>
                <Typography
                  sx={styles.msg}
                  onClick={() => messageHandler(index)}
                >
                  {msg}
                  <CancelIcon sx={styles.icon} />
                </Typography>
                <Divider />
              </Box>
            );
          })}
        </Paper>
      );
    }
  };
  return <Container>{render_message()}</Container>;
};

const styles = {
  msgCon: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    bottom: "55px",
    backgroundColor: theme.palette.white.main,

    margin: "0 auto",
    left: 0,
    right: 0,
    transition: "0.25s",
  },
  msg: {
    fontSize: "1.5rem",
    width: "100%",
  },
  icon: {
    paddingTop: "7px",
    cursor: "pointer",
  },
};
