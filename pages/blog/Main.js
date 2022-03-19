import React from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { Blog } from "../../src/api/API";
import { Articles_renderer, Main_tag_renderer } from "../../src/functions";
import Link from "next/link";
import { introduce } from "../../src/functions";
import { useSearchTag } from "../../src/hooks";
export default function Main() {
  const [mainArticles, setMainArticles] = React.useState([]);
  const [mainShowingTags, setMainShowingTags] = React.useState([]);
  const [searchTag, setSearchTag] = useSearchTag();
  console.log("메인페이지 렌더링됨.");
  React.useEffect(async () => {
    const articles = await Blog.get_main_articles(searchTag);
    const tags = await Blog.get_tags(0);

    setMainArticles(articles);
    setMainShowingTags(tags);
  }, [searchTag]);
  return (
    <Container sx={styles.mainCon}>
      <Main_tag_renderer tags={mainShowingTags} setSearchTag={setSearchTag} />
      <Typography>{introduce(searchTag, "추천 게시물")}</Typography>
      <Articles_renderer
        articles={mainArticles}
        setSearchTag={setSearchTag}
        page={0}
      />
    </Container>
  );
}
const styles = {
  mainCon: {},
};
