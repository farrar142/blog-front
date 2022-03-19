import "../src/style.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import { Toolbar, Fab, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTopButton from "../components/ScrollTopButton";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { Container } from "@mui/material";
import Navbar from "../components/Navbar";
import FixedBottomNavigation from "../components/Footer";
import SysMsg from "../components/SysMsg";
import { AccountsInfoFactory, useSsrComplectedState } from "../src/Atom";
import Router, { useRouter } from "next/router";
import {
  useAccountsInfo,
  useBlogChecker,
  useSysMsg,
  useToken,
} from "../src/hooks";
import Auth from "../src/api/API";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <RecoilRoot>
          <Middleware>
            <Contents>
              <Box sx={{ height: "74px" }} id="back-to-top-anchor" />
              <Navbar />
              <Component {...pageProps} />
              <ScrollTopButton>
                <Fab
                  color="secondary"
                  size="small"
                  aria-label="scroll back to top"
                >
                  <KeyboardArrowUpIcon />
                </Fab>
              </ScrollTopButton>
              <SysMsg />
              <FixedBottomNavigation />
            </Contents>
          </Middleware>
        </RecoilRoot>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

const Contents = ({ children }) => {
  const router = useRouter();
  if (router.isReady) {
  } else {
    return <div>로딩중</div>;
  }
  return (
    <Container maxWidth={false} component="div" sx={styles}>
      {children}
    </Container>
  );
};
const Middleware = ({ children }) => {
  const setSsrCompleted = useSsrComplectedState();
  useEffect(setSsrCompleted, [setSsrCompleted]);
  const [accountsInfo, setAccountsInfo] = useAccountsInfo();
  const [token, setToken] = useToken();
  const [msg, setMsg] = useSysMsg();
  useEffect(async () => {
    if (token) {
      const result = await Auth.get_info(token);
      console.log(result);
      if (result) {
        console.log("validated");
      } else {
        setToken(null);
        setMsg("로그아웃되었습니다");
        setAccountsInfo(AccountsInfoFactory(null, 0));
      }
    }
  }, [token]);
  return <>{children}</>;
};
const styles = {
  margin: 0,
  width: {
    sm: "100vw",
    md: "100vw",
  },
  padding: {
    sm: 0,
    md: 0,
    xs: 0,
  },
};
