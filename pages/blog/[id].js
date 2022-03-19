import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useBlogChecker, useSearchTag, useSysMsg } from "../../src/hooks";
import Router, { useRouter } from "next/router";
import { Blog } from "../../src/api/API";
import { currentViewingBlog, pageState } from "../../src/Atom";
import { useRecoilState } from "recoil";
import {
  Articles_renderer,
  Main_tag_renderer,
  introduce,
} from "../../src/functions";
import MyPagination from "../../components/MyPagination";
export default (props) => {
  const blogId = useRouter().query.id;
  const [curBlog, setCurBlog] = useRecoilState(currentViewingBlog);
  const [articles, setArticles] = useState([]);
  const [curPage, setPage] = useRecoilState(pageState(blogId));
  const [mainShowingTags, setMainShowingTags] = useState([]);
  const [searchTag, setSearchTag] = useSearchTag();
  const [curTag, setCurTag] = useState("");
  const articleLength = articles.length;
  const [sysMsg, setMsg] = useSysMsg();
  const [isLoading, setLoading] = useState(true);
  const pageCounter = (number) => {
    if (number > 0 && number % 10 == 0) {
      return parseInt(number / 10);
    } else {
      return parseInt(number / 10) + 1;
    }
  };
  useEffect(() => {
    if (blogId) {
      Blog.get_blog_by_id(blogId).then((res) => {
        setCurBlog(res);
      });
    }
  }, [blogId]);
  useEffect(() => {
    try {
      if (curBlog.id) {
        if (searchTag !== curTag) {
          Blog.get_blog_articles(curBlog.id, searchTag).then((res) => {
            setArticles(res);
            setCurTag(searchTag);
            setPage(1);
          });
        } else {
          Blog.get_blog_articles(curBlog.id).then((res) => {
            setArticles(res);
          });
        }
        Blog.get_tags(curBlog.id).then((res) => {
          setMainShowingTags(res);
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setMsg("블로그가 없어요.");
      Router.push("/");
      setLoading(false);
    }
  }, [curBlog, searchTag]);
  const onPageChange = (event, value) => {
    setPage(value);
  };
  if (isLoading) {
    return <div>로딩중</div>;
  }
  return (
    <Container sx={styles.mainCon}>
      <Main_tag_renderer tags={mainShowingTags} setSearchTag={setSearchTag} />
      <Typography>{introduce(searchTag, "")}</Typography>
      <Articles_renderer
        articles={articles}
        setSearchTag={setSearchTag}
        page={curPage}
      />
      {/* {articles_renderer(articles, curPage)} */}
      <MyPagination
        curPage={curPage}
        styles={styles.pagination}
        pageCounter={pageCounter}
        articleLength={articleLength}
        onPageChange={onPageChange}
      />
      {/* <Pagination
        page={curPage}
        sx={styles.pagination}
        elevation={10}
        count={pageCounter(articleLength)}
        onChange={onPageChange}
        color="secondary"
        variant="outlined"
        showFirstButton
        showLastButton
      /> */}
    </Container>
  );
};

const styles = {
  mainCon: {},
  articleCon: {
    marginBottom: "100px",
  },
  pagination: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: "60px",
    margin: "0 auto",
    left: 0,
    right: 0,
  },
};
