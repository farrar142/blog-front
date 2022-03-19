import { createRef, useState } from "react";
import axios from "axios";
import { Container, Box, TextField, Button, FormControl } from "@mui/material";
import { useEditArticle, useToken, useSysMsg } from "../../../src/hooks";
import dynamic from "next/dynamic";
import { Blog } from "../../../src/api/API";
import theme from "../../../src/theme";
import AsideNavBar, { useInterval } from "../../../components/AsideNavBar";
const ToastEditor = dynamic(() => import("../../../components/ToastEditor"), {
  ssr: false,
});
function Editor(props) {
  return (
    <ToastEditor
      article={props.article}
      editorRef={props.editorRef}
      onChangeFunction={props.onChangeFunction}
      context={props.context}
    />
  );
}
export default (props) => {
  const [writeArticle, setWriteArticle] = useEditArticle();
  const [token, setToken] = useToken();
  const [sysMsg, setMsg] = useSysMsg();
  const formRef = createRef();
  const editorRef = createRef();
  const [htmlEl, setEl] = useState(null);
  const onWriteArticleChangeHandler = () => {
    const title = formRef.current.title.value;
    const tags = formRef.current.tags.value;
    const context = editorRef.current.getInstance().getMarkdown();
    setWriteArticle(title, tags, context, writeArticle.id, writeArticle.blogId);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    if (!token) {
      setMsg("로그인 해주세요");
      return;
    }
    //api 폼데이타 송신용
    const title = event.target.title.value;
    const tags = event.target.tags.value;
    const context = editorRef.current.getInstance().getMarkdown();
    const data = {
      title: title,
      tags: tags,
      context: context,
      token: token,
    };
    if (title.length <= 3) {
      setMsg("제목을 3자 이상 입력해주세요");
      return;
    }
    if (context.length <= 3) {
      setMsg("내용을 입력해주세요");
      return;
    }
    Blog.post_article(
      title,
      tags,
      context,
      token,
      writeArticle.id,
      "edit"
    ).then((res) => {
      if (res) {
        setMsg("저장되었습니다");
      } else {
        setMsg("저장하지못하였습니다");
      }
    });
  };

  useInterval(() => {
    try {
      setEl(editorRef);
    } catch {}
  }, 1000);
  return (
    <Container maxWidth={false} sx={styles.articleCon}>
      <Container sx={styles.emptyCon}>
        <div></div>
      </Container>
      <FormControl
        component="form"
        onSubmit={submitHandler}
        onChange={onWriteArticleChangeHandler}
        ref={formRef}
        sx={styles.innerCon}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <TextField
            sx={styles.textArea}
            color="secondary"
            name="title"
            fullWidth
            label="제목을 입력해주세요"
            minLength="3"
            id="fullWidth"
            required
            value={writeArticle.title ? writeArticle.title : ""}
          />
          <TextField
            sx={styles.textArea}
            color="secondary"
            fullWidth
            name="tags"
            label="태그를 입력해주세요"
            id="fullWidth"
            value={writeArticle.tags ? writeArticle.tags : ""}
          />
        </Box>
        <Editor
          article={writeArticle}
          editorRef={editorRef}
          onChangeFunction={onWriteArticleChangeHandler}
        />
        <Button variant="contained" color="secondary" type="submit">
          작성완료
        </Button>
      </FormControl>

      <Container sx={styles.asideCon}>
        <AsideNavBar
          sx={styles.asidebar}
          highlighter={theme.palette.secondary.main}
          htmlEl={htmlEl}
          target={editorRef}
        ></AsideNavBar>
      </Container>
    </Container>
  );
};

const styles = {
  articleCon: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    width: "100%",
  },
  emptyCon: {
    width: "15%",
    marginLeft: "10px",
    marginRight: "10px",
    display: {
      xs: "none",
      md: "block",
    },
  },
  asideCon: {
    width: "15%",
    marginLeft: "10px",
    marginRight: "10px",
    display: {
      xs: "none",
      md: "block",
    },
  },
  innerCon: {
    width: {
      xs: "100%",
      md: "70%",
    },
  },
  editorCon: {
    marginTop: "50px",
  },
  textArea: {
    marginTop: "5px",
    marginBottom: "5px",
  },
  asidebar: {
    position: "sticky",
    top: "70px",
    width: "100%",
    color: "secondary",
  },
};
