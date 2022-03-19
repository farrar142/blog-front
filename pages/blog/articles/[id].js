import React from "react";
import { Blog } from "../../../src/api/API";
import { useRouter } from "next/router";
import { Paper, Typography, Grid, Box } from "@mui/material";
import dynamic from "next/dynamic";

const ToastViewer = dynamic(() => import("../../../components/ToastViewer"), {
  ssr: false,
});
function Viewer(props) {
  return (
    <>
      <ToastViewer context={props} />
    </>
  );
}
export default function page() {
  const [singleArticle, setSingleArticle] = React.useState({});
  const [context, setContext] = React.useState("");
  const router = useRouter();
  const articleId = router.query.id;
  React.useEffect(() => {
    if (articleId) {
      Blog.get_article_by_id(articleId).then((res) => {
        setSingleArticle(res);
        setContext(Viewer(res.context));
      });
    }
  }, [articleId]);

  return (
    <Paper sx={styles.articleCon}>
      <Typography component="h1" variant="h3" color="inherit" gutterBottom>
        {singleArticle.title}
      </Typography>
      <Typography component="h5" variant="h3" color="inherit" gutterBottom>
        {singleArticle.tags}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {singleArticle.reg_date}
      </Typography>
      <Box variant="h5" color="inherit" sx={styles.viewer}>
        {context}
      </Box>
    </Paper>
  );
}

const styles = {
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
