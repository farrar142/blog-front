import * as React from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Auth from "../../src/api/API";
import Router from "next/router";
import { useSysMsg, useToken, useAccountsInfo } from "../../src/hooks";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://soundcloud.com/sandring-443999826">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default function SignIn(props) {
  // const { token, tokenHandler } = React.useState;
  const [token, setToken] = useToken();
  const [accountInfo, setAccountInfo] = useAccountsInfo();
  const [msg, setMsg] = useSysMsg();
  //Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const datas = {
      username: data.get("username"),
      password: data.get("password"),
    };
    const result = await Auth.login(data.get("username"), data.get("password"));
    if (result) {
      setToken(result);
      const { pathname } = Router;
      //redirect
      Router.push("/");
    } else {
      setMsg("정보가 옳바르지 않아요");
    }
  };
  //getInfo
  React.useEffect(async () => {
    if (token) {
      const result = await Auth.get_info(token);
      if (result) {
        setMsg("로그인되었습니다."); // 커스텀 훅 안됨...
        setAccountInfo(result);
      }
    }
  }, [token]);
  const handleLogout = () => {
    Auth.logout();
  };
  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: "20vh" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            color="secondary"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            color="secondary"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Remember me"
            color="secondary"
          />
          <Button
            color="secondary"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" color="black.main">
                <Typography color="black">Forgot password?</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link href="/accounts/Signup" color="black.main">
                <Typography>Sign Up</Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
