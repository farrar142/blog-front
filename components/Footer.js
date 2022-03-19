import React, { useState, useEffect, createRef, useRef } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import ArticleIcon from "@mui/icons-material/Article";
import ListIcon from "@mui/icons-material/List";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Popper,
  Divider,
  MenuList,
  MenuItem,
  ClickAwayListener,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import theme from "../src/theme";
import Router, { useRouter } from "next/router";
import {
  useBlogChecker,
  useArticleChecker,
  useSysMsg,
  useToken,
  useAccountsInfo,
} from "../src/hooks";
import { Blog } from "../src/api/API";
export default function FixedBottomNavigation(props) {
  const router = useRouter();
  const [token, setToken] = useToken();
  const [sysMsg, setMsg] = useSysMsg();
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const actionRef = useRef(null);
  const curBlog = useBlogChecker();
  const [accountsInfo, setAccountsInfo] = useAccountsInfo();
  const [curArticleId, setArticle] = useArticleChecker(
    curBlog ? curBlog.id : 0
  );

  const searchTagHandler = (e) => {
    console.log(e);
  };
  useEffect(() => {
    //바텀내비게이션 활성화 조절
    setValue(
      router.pathname === "/blog/[id]"
        ? 0
        : router.pathname === "/blog/articles/view/[id]"
        ? 1
        : value
    );
  }, [router]);

  const popperHandler = () => {
    setOpen(!open);
  };
  const handleClose = (event) => {
    if (actionRef.current.contains(event.target)) {
    }

    setOpen(false);
  };
  const navigationHandler = (value) => {
    setValue(value);
    if (value === 0) {
      if (curBlog) {
        Router.push(`/blog/${curBlog.id}`);
      } else {
        setMsg("아직 본 블로그가 없어요.");
      }
    } else if (value === 1) {
      if (curArticleId) {
        Router.push(`/blog/articles/view/${curArticleId}`);
      } else {
        setMsg("아직 본 글이 없어요");
      }
    }
  };
  const editorNavHandler = (value) => {
    setOpen(false);
    if (value === 1) {
      Router.push(`/blog/articles/write`);
    } else if (value === 2) {
      Router.push(`/blog/articles/edit`);
    } else if (value === 3) {
      if (onRemove()) {
        Blog.delete_article_by_id(curArticleId, token).then((res) => {
          if (res) {
            setMsg("삭제되었습니다");
            navigationHandler(0);
          } else {
            setMsg("삭제되지않았습니다");
          }
        });
      } else {
      }
    } else {
    }
  };

  const onEdit = () => {
    if (window.confirm("수정중인 글이 있습니다. 덮어 쓰시겠습니까?")) {
      return true;
    } else {
      setMsg("취소합니다.");
      return false;
    }
  };

  const onRemove = () => {
    if (window.confirm("정말 삭제합니까?")) {
      return true;
    } else {
      setMsg("취소합니다.");
      return false;
    }
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) {
      setOpen(false);
    }
  });
  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        color="secondary"
        elevation={3}
      >
        <BottomNavigation
          sx={styles.items}
          color="secondary"
          showLabels
          value={value}
          onChange={(event, newValue) => {
            navigationHandler(newValue);
          }}
        >
          <BottomNavigationAction label="글목록" icon={<ListIcon />} />
          <BottomNavigationAction label="게시물" icon={<ArticleIcon />} />
          <BottomNavigationAction
            label="메뉴"
            icon={<SettingsIcon ref={actionRef} />}
            onClick={popperHandler}
            onKeyDown={handleListKeyDown}
          ></BottomNavigationAction>
        </BottomNavigation>

        <Popper
          key="bottomNav"
          open={open}
          anchorEl={actionRef.current}
          placement="top"
          disablePortal
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList onKeyDown={handleListKeyDown}>
                {actions.map((action) => {
                  if (action.permission >= 1) {
                    if (accountsInfo.user_id >= 1) {
                      try {
                        if (accountsInfo.user_id !== curBlog.user_id) {
                          return;
                        }
                      } catch {
                        return;
                      }
                    } else {
                      return;
                    }
                  }
                  return (
                    <MenuItem
                      key={action.name}
                      onClick={() => {
                        editorNavHandler(action.action);
                      }}
                    >
                      {action.icon}
                      {action.name}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </Paper>
    </Box>
  );
}

const actions = [
  { icon: <CreateIcon />, name: "글쓰기", permission: 1, action: 1 },
  { icon: <RateReviewIcon />, name: "수정하기", permission: 1, action: 2 },
  { icon: <DeleteIcon />, name: "삭제하기", permission: 1, action: 3 },
  { icon: <ShareIcon />, name: "공유하기", permission: 0, action: 4 },
];

const dividerChekcer = (arrayLength, idx) => {
  if (arrayLength - 1 !== idx) {
    return <Divider />;
  } else {
    return;
  }
};

const styles = {
  items: {
    "& .Mui-selected, .Mui-selected > svg": {
      color: theme.palette.secondary.main,
    },
  },
};
