import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useAccountsInfo, useSysMsg, useToken } from "../../src/hooks";
import theme from "../../src/theme";
import { Blog } from "../../src/api/API";
import Router from "next/router";
export default (props) => {
  const m_styles = styles(theme);
  const [my_info, set_info] = useAccountsInfo();
  console.log(my_info);

  return (
    <Container sx={m_styles.mainContainer}>
      <InfoContainer infos={my_info} setInfo={set_info} />
    </Container>
  );
};

const InfoContainer = (props) => {
  const { infos, setInfo } = props;
  const m_styles = styles(theme);
  const [blogName, setBlogName] = useState(infos["blog__name"]);
  const [token, setToken] = useToken();
  const [sysMsg, setMsg] = useSysMsg();
  const blogNameHandler = (e) => {
    setBlogName(e.target.value);
  };
  const blogNameChange = async (e) => {
    e.preventDefault();
    if (blogName === infos["blog__name"]) {
      setMsg("블로그 이름을 입력해주세요");
      return;
    }
    const result = await Blog.post_blogName(token, infos["blog__id"], blogName);
    try {
      setInfo({ ...infos, blog__name: result[0]["name"] });
    } catch {
      setMsg("네?");
    }
    console.log(result);
  };
  useEffect(() => {
    if (!token) {
      setMsg("접근 권한이 없습니다.");
      Router.push("/");
      // return <div>asd</div>;
    }
  }, [token]);
  return (
    <Paper sx={m_styles.infoCon}>
      <Box sx={m_styles.infoBox}>
        <Typography sx={m_styles.infoItems}>유저아이디 </Typography>
        <Divider />
        <Typography sx={m_styles.infoItems}>유저이메일 </Typography>
        <Divider />
        <Typography sx={m_styles.infoItems}>블로그이름 </Typography>
        <Divider />
      </Box>
      <Box sx={m_styles.infoBox}>
        <Typography sx={m_styles.infoItems}>{infos["username"]}</Typography>
        <Divider />
        <Typography sx={m_styles.infoItems}>{infos["email"]}</Typography>
        <Divider />
        <Box sx={m_styles.infoItems}>
          <TextField
            size="small"
            color="secondary"
            label={blogName ? blogName : infos["blog__name"]}
            onChange={blogNameHandler}
          />
          <Button type="submit" variant="contained" onClick={blogNameChange}>
            변경
          </Button>
          <Divider />
        </Box>
      </Box>
    </Paper>
  );
};

const styles = (theme) => {
  return {
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    infoCon: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      padding: "20px",
      width: "500px",
    },
    infoBox: {
      marginRight: "20px",
      marginLeft: "20p",
    },
    infoItems: {
      height: "40px",
      marginTop: "5px",
      marginBottom: "5pxx",
      marginRight: "5px",
      marginLeft: "5px",
      display: "flex",
      alignItems: "center",
    },
  };
};

function objMap(obj) {
  let arr = [];
  for (let key in obj) {
    arr.push(obj[key]);
  }
  return arr;
}
