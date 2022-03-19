import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Paper, Typography, Grid, Box } from "@mui/material";
import dynamic from "next/dynamic";

const ToastViewer = dynamic(() => import("../ToastViewer"), { ssr: false });
function Viewer(props) {
  return (
    <>
      <ToastViewer context={props} />
    </>
  );
}
export default (props) => {
  const article_id = props.article_id;
  const { article, setArticle } = props;
  // const test = tags.map((tag)=>(tag))
  const [isLoading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (article_id) {
      const articles_url = `/api/article/${article_id}`;
      console.log("fetching data");
      axios
        .get(articles_url)
        .then((res) => {
          const result = res.data[0];
          setArticle({
            id: result.id,
            title: result.title,
            context: result.context,
            reg_date: result.reg_date,
            tags: result.hashtags.map((tags) => tags.tags__name).join(" / "),
          });
          // setArticleContext(Viewer(result.context));
          // setArticleTags()
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error(error));
      setLoading(false);
    }
  }, []);
  const classes = useStyles;
  if (article_id === 0) {
    return <div>보고있는 게시물이 없어요</div>;
  }
  if (isLoading) {
    return <div>로딩중이에요</div>;
  } else {
    return (
      <Paper sx={classes.articleCon}>
        <Typography component="h1" variant="h3" color="inherit" gutterBottom>
          {article.title}
        </Typography>
        <Typography component="h5" variant="h3" color="inherit" gutterBottom>
          {article.tags}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {article.reg_date}
        </Typography>
        <Box variant="h5" color="inherit" sx={classes.viewer}>
          {Viewer(article.context)}
        </Box>
      </Paper>
    );
  }
};

const useStyles = {
  articleCon: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50px",
    width: "90%",
  },
  viewer: {
    width: "100%",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
};
