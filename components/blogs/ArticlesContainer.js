import * as React from 'react'
import { Container, Pagination, Card, CardContent, Typography } from '@mui/material';


export default (props) => {
    const classes = useStyles;
    return (
      <>
        <Container sx={classes.cardCon}>
          {showingArticles.map((post) => (
            <Card key={post.title + post.id} sx={classes.card}>
              <CardContent sx={classes.cardDetails}>
                <Typography component="h2" variant="h5">
                  {post.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {post.reg_date}
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  {String(post.context).substring(0, 100)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="secondary"
                  // onClick={() => onArticleClick(post.id)}
                >
                  Continue reading...
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Container>
        <Pagination
          page={curPage}
          sx={classes.pagination}
          elevation={10}
          count={count}
          onChange={onPageChange}
          showFirstButton
          showLastButton
        />
      </>
    );
    
}

const useStyles = {
  cardCon: {
    width: "90%",
    minWidth: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  card: {
    cursor: "pointer",
    width: "90%",
    minWidth: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "5px",
    marginBottom: "5px",
  },
  cardDetails: {
    width: "100%",
    minWidth: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  cardMedia: {
    width: 160,
  },
  pagination: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: "60px",
  },
  paginationContainer: {
    bottom: "60px",
    magin: "auto",
  },
}