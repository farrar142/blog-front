import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  TextField,
  Badge,
  MenuItem,
  Menu,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  AccountsInfoState,
  Token,
  AccountsInfoFactory,
  currentViewingBlog,
} from "../src/Atom";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  useSysMsg,
  useSearchTag,
  useAccountsInfo,
  useBlogChecker,
  useToken,
} from "../src/hooks";
import HomeIcon from "@mui/icons-material/Home";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [userName, setUserName] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [accountsInfo, setAccountsInfo] = useAccountsInfo();
  const [token, setToken] = useToken();
  const [msg, setMsg] = useSysMsg();
  const curBlog = useBlogChecker();
  const [searchTag, setSearchTag] = useSearchTag();
  const searchTagHandler = (e) => {
    console.log(e);
  };
  const router = useRouter();
  const logout = () => {
    setToken(null);
    setMsg("로그아웃되었습니다");
    setAccountsInfo(AccountsInfoFactory(null, 0));
    handleMobileMenuClose();
  };
  React.useEffect(() => {
    if (accountsInfo) {
      setUserName(accountsInfo.username);
    }
  }, [accountsInfo]);
  const titleRenderer = () => {
    if (router.pathname === "/") {
      return ["Blog", "/"];
    } else {
      try {
        if (curBlog.name) {
          return [curBlog.name, `/blog/${curBlog.id}`];
        } else {
          return ["Blog", "/"];
        }
      } catch {
        return ["Blog", "/"];
      }
    }
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  const mobileMenuId = "primary-search-account-menu-mobile";
  const MoveToCliButton = () => {
    if (accountsInfo.user_id) {
      return (
        <MenuItem>
          <Link href="/cli">
            <Typography>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={0} color="error">
                  <AccountCircle />
                </Badge>
              </IconButton>
              SSH
            </Typography>
          </Link>
        </MenuItem>
      );
    } else {
      return;
    }
  };
  const infoEditButton = () => {
    if (accountsInfo.user_id) {
      return (
        <MenuItem>
          <Link href="/accounts/Info">
            <Typography>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={0} color="error">
                  <AccountCircle />
                </Badge>
              </IconButton>
              회원정보수정
            </Typography>
          </Link>
        </MenuItem>
      );
    } else {
      return;
    }
  };
  const loginButton = (props) => {
    if (accountsInfo.user_id) {
      return (
        <Typography onClick={logout} variant="contained">
          {props}
          로그아웃
        </Typography>
      );
    } else {
      return (
        <Link href="/accounts/Signin">
          <Typography variant="contained">{props}로그인</Typography>
        </Link>
      );
    }
  };
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMobileMenuClose}>
        {loginButton(
          <IconButton size="large" color="inherit">
            <Badge badgeContent={0} color="error">
              <AccountCircle />
            </Badge>
          </IconButton>
        )}
      </MenuItem>
      {infoEditButton()}
      {MoveToCliButton()}
    </Menu>
  );
  const [inputValues, setInput] = React.useState("");
  React.useEffect(() => {
    if (inputValues) {
      setSearchTag(inputValues.target.value);
      console.log(inputValues.target.value);
    }
  }, [inputValues]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Link href="/">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
          </Link>
          <Link href={titleRenderer()[1]}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { cursor: "pointer" } }}
            >
              {titleRenderer()[0]}
            </Typography>
          </Link>
          <Search sx={{ display: { width: "150px" } }}>
            <SearchIconWrapper>
              <SearchIcon onClick={(e) => searchTagHandler(e)} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={setInput}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Typography>{userName}</Typography>
          <Box sx={{ display: { xs: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <AppBar sx={styles.fakeAppBar} position="static" />
      {renderMobileMenu}
    </Box>
  );
}

const styles = {
  fakeAppBar: {},
};
