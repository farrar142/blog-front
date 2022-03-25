import { Button, Container, TextField, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import API from "../../src/api/API";
import { useSysMsg } from "../../src/hooks";
import Router from "next/router";
import theme from "../../src/theme";
export default (props) => {
  const [idfinderemail, idfindersetEmail] = useState("");
  const [pwfinderid, pwfindersetid] = useState("");
  const [pwfinderemail, pwfindersetEmail] = useState("");
  const [msg, setMsg] = useSysMsg();
  const idfinderinputHandler = (e) => {
    idfindersetEmail(e.target.value);
  };
  const pwfinderinputHandler = (e) => {
    pwfindersetEmail(e.target.value);
  };
  const pwfinderidinputHandler = (e) => {
    pwfindersetid(e.target.value);
  };
  const idfinderonClickHandler = async (e) => {
    e.preventDefault();
    if (!idfinderemail.includes("@")) {
      setMsg("이메일 양식을 정확히 입력해주세요");
      return;
    }
    const result = await API.find_email(idfinderemail);
    if (result) {
      setMsg("메일이 성공적으로 전송되었습니다.");
      Router.push("/");
    } else {
      setMsg("메일 전송에 실패하였습니다.");
    }
  };
  const pwfinderonClickHandler = async (e) => {
    e.preventDefault();
    const result = await API.find_email(idfinderemail);
    let counter = 0;
    let msg = "";
    function msgAdder(message) {
      if (msg) {
        msg += ", " + message;
      } else {
        msg = message;
      }
    }
    if (!pwfinderid) {
      msgAdder("id를 입력해주세요");
      counter++;
    }
    if (!pwfinderemail.includes("@")) {
      msgAdder("이메일 양식을 정확히 입력해주세요");
      counter++;
    }
    if (counter) {
      setMsg(msg);
      return;
    }
    if (result) {
      setMsg("메일이 성공적으로 전송되었습니다.");
      // Router.push("/");
    } else {
      setMsg("메일 전송에 실패하였습니다.");
    }
  };
  const m_style = styles(theme);
  return (
    <Container sx={m_style.mainCon}>
      <Typography>ID찾기</Typography>
      <TextField
        size="small"
        value={idfinderemail}
        onChange={idfinderinputHandler}
        label="email"
        id="outlined-search"
        name="email"
      />
      <Button
        onClick={idfinderonClickHandler}
        type="submit"
        variant="contained"
      >
        이메일전송
      </Button>
      <Typography>비밀번호찾기</Typography>
      <TextField
        size="small"
        value={pwfinderemail}
        onChange={pwfinderinputHandler}
        label="email"
        id="outlined-search2"
        name="email"
      />
      <TextField
        size="small"
        value={pwfinderid}
        onChange={pwfinderidinputHandler}
        label="ID"
        id="outlined-search2"
        name="idinput"
      />
      <Button
        onClick={pwfinderonClickHandler}
        type="submit"
        variant="contained"
      >
        이메일전송
      </Button>
    </Container>
  );
};

const styles = (theme) => {
  return {
    mainCon: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  };
};
