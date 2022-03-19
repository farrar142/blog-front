import { useState, useEffect, useRef } from "react";
import { Blog } from "../../../../src/api/API";
import { useRouter } from "next/router";
import { Paper, Stack, Typography, Grid, Box, Container } from "@mui/material";
import dynamic from "next/dynamic";
import { Tag_renderer } from "../../../../src/functions";
import {
  useBlogChecker,
  useEditArticle,
  useArticleChecker,
  useSearchTag,
} from "../../../../src/hooks";
import { tag_stringfy } from "../../../../src/functions";
import AsideNavBar, { scrollToItem } from "../../../../components/AsideNavBar";
import theme from "../../../../src/theme";
const ToastViewer = dynamic(
  () => import("../../../../components/ToastViewer"),
  {
    ssr: false,
  }
);
function Viewer(ref, context) {
  return (
    <>
      <ToastViewer aRef={ref} context={context} />
    </>
  );
} //

export default function page() {
  const [singleArticle, setSingleArticle] = useEditArticle();
  const [curShowingArticle, setCurShowingArticle] = useState({});
  const [context, setContext] = useState("");
  const router = useRouter();
  const articleId = router.query.id;
  const blog = useBlogChecker(
    curShowingArticle ? curShowingArticle.blog_id : 0
  );
  const [curArticleId, setArticleId] = useArticleChecker(blog.id);
  const [searchTag, setSearchTag] = useSearchTag();
  const viewerRef = useRef();
  const [isLoading, setLoading] = useState(true);
  const [statusMsg, setMsg] = useState("로딩중");
  useEffect(async () => {
    if (articleId) {
      const res = await Blog.get_article_by_id(articleId);
      if (res) {
        setCurShowingArticle(res);
        setSingleArticle(
          res.title,
          tag_stringfy(res.hashtags),
          res.context,
          res.id,
          res.blog_id
        );
        setArticleId(res.id);
        setContext(Viewer(viewerRef, res.context));
        setLoading(false);
      } else {
        setMsg("검색결과가 없습니다.");
      }
    }
  }, [articleId]);

  if (isLoading) {
    return <div>{statusMsg}</div>;
  }
  console.log("로딩댔어여");
  function refChecker() {
    console.log(viewerRef.current.getInstance());
  }
  return (
    <Container maxWidth={false} sx={styles.articleCon}>
      <Container sx={styles.emptyCon}>
        <div></div>
      </Container>
      <Container sx={styles.innerCon}>
        <Typography
          component="h1"
          variant="h3"
          color="inherit"
          gutterBottom
          textAlign={"center"}
        >
          {curShowingArticle.title}
        </Typography>
        {Tag_renderer(curShowingArticle.hashtags, setSearchTag)}
        <Typography variant="subtitle1" color="textSecondary">
          {curShowingArticle.reg_date}
        </Typography>
        <Box variant="h5" color="inherit" sx={styles.viewer}>
          {context}
        </Box>
      </Container>
      <Container sx={styles.asideCon}>
        <AsideNavBar
          router={router}
          sx={styles.asidebar}
          highlighter={theme.palette.secondary.main}
          target={viewerRef}
        ></AsideNavBar>
      </Container>
    </Container>
  );
}

const styles = {
  articleCon: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    width: "100%",
  },
  viewer: {
    width: "100%",
    // paddingLeft: "20px",
    // paddingRight: "20px",
    paddingBottom: "100vh",
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
  innerCon: {
    width: {
      xs: "100%",
      md: "70%",
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
  asidebar: {
    position: "sticky",
    top: "20vh",
    width: "100%",
    color: "secondary",
    transition: "0.3s",
  },
};
