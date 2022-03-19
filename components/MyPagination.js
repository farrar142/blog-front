import { Pagination } from "@mui/material";
export default (props) => {
  const { curPage, styles, pageCounter, onPageChange, articleLength } = props;
  return (
    <Pagination
      page={curPage}
      sx={styles}
      elevation={10}
      count={pageCounter(articleLength)}
      onChange={onPageChange}
      color="secondary"
      variant="outlined"
      showFirstButton
      showLastButton
    />
  );
};
