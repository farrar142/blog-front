import { Stack, Container, Chip, Typography, Box, Paper } from "@mui/material";
import Link from "next/link";
import { useSearchTag } from "./hooks";

export const introduce = (searchTag, text) => {
  if (searchTag) {
    return `${searchTag} 검색결과`;
  } else {
    return text;
  }
};
export function sortById(arr, target = "id") {
  const result = arr.sort((item1, item2) => {
    if (parseInt(item1[target]) < parseInt(item2[target])) {
      return -1;
    } else if (parseInt(item1[target]) > parseInt(item2[target])) {
      return 1;
    } else {
      return 0;
    }
  });
  return result;
}
export function Main_tag_renderer(props) {
  const tags = props.tags;
  const setSearchTag = props.setSearchTag;
  return (
    <Stack sx={styles.mainTagCon} direction="row" spacing={1}>
      <Chip
        onClick={() => setSearchTag("")}
        sx={{ cursor: "pointer" }}
        label={"전체보기"}
      />
      {tags.map((tag) => {
        if (tag) {
          return (
            <Chip
              onClick={() => setSearchTag(tag.name)}
              sx={{ cursor: "pointer" }}
              key={tag.name}
              label={`#${tag.name} (${tag.count})`}
            />
          );
        } else {
          return null;
        }
      })}
    </Stack>
  );
}
export function Tag_renderer(tags, setSearchTag) {
  if (tags) {
    const target = tags.split(",");
    return (
      <Stack sx={styles.tagCon} direction="row" spacing={1}>
        {target.map((tag) => {
          if (tag) {
            return (
              <Chip
                onClick={() => setSearchTag(tag)}
                sx={{ cursor: "pointer" }}
                key={tag}
                label={"#" + tag}
              />
            );
          } else {
            return null;
          }
        })}
      </Stack>
    );
  } else {
    return <Stack></Stack>;
  }
}
export function tag_stringfy(tags) {
  if (tags) {
    tags = tags.split(",");
    return tags
      .map((tag) => {
        if (tag) {
          return "#" + tag;
        } else {
          return null;
        }
      })
      .join(" ");
  } else {
    return "";
  }
}

export function Articles_renderer(props) {
  const page = props.page;
  const setSearchTag = props.setSearchTag;
  if (props.articles) {
    const articles = page
      ? props.articles.slice((page - 1) * 10, page * 10)
      : props.articles;
    return (
      <Box sx={styles.articleBox}>
        {articles.map((article, idx) => {
          return (
            <Paper key={idx} sx={styles.articleCon}>
              <Typography noWrap sx={styles.articleTitle}>
                {article.title}
              </Typography>
              {Tag_renderer(article.taglist, setSearchTag)}
              <Typography component="div" sx={styles.articleBody}>
                {article.context.substring(0, 200)}
              </Typography>
              <Link href={`/blog/articles/view/${article.id}`}>
                <Typography color="secondary" sx={styles.link}>
                  더보기
                </Typography>
              </Link>
            </Paper>
          );
        })}
      </Box>
    );
  }
}

const styles = {
  mainTagCon: {
    overflow: "scroll",
    width: "100%",
    padding: "auto",
    margin: "auto",
    justifyContent: "start",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
  tagCon: {
    overflow: "scroll",
    width: "100%",
    padding: "auto",
    margin: "auto",
    justifyContent: "center",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
  articleBox: {
    marginBottom: "40px",
  },
  articleCon: {
    marginTop: "10px",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
    height: "150px",
  },
  articleTitle: {
    fontSize: "1.5rem",
    height: "40px",
    textAlign: "center",
  },
  articleBody: {
    height: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  link: {
    marginTop: "5px",
    textAlign: "center",
    cursor: "pointer",
  },
};
