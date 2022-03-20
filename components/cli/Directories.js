import { createRef, useCallback, useEffect, useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  alpha,
  Card,
  Typography,
  Tooltip,
  Breadcrumbs,
  Slider,
} from "@mui/material";

import theme from "../../src/theme";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DeleteIcon from "@mui/icons-material/Delete";
export const Directories = (props) => {
  const { children, catDir, rmRF, changeDir } = props;
  const files = props.files;
  const path = props.path;
  console.log(files);
  try {
    return (
      <Container sx={styles.dirCon}>
        {children}
        {files.map((item, idx) => {
          const name = item[1] == ".." ? "상위폴더" : item[1];
          const [subMenuOpen, setSubOpen] = useState(false);
          const remove = () => {
            if (item[1] != "..") {
              return (
                <Tooltip title="삭제">
                  <DeleteIcon onClick={() => rmRF(path, item[1], item[0])} />
                </Tooltip>
              );
            } else {
              return;
            }
          };
          if (item[1] == ".") {
            return;
          } else if (item[0] == "dir") {
            return (
              <Card
                key={idx + item[0] + item[1]}
                sx={styles.fileStyle}
                // onClick={() => changeDir(path, item[1])}
                onMouseOver={() => {
                  setSubOpen(true);
                }}
                onMouseLeave={() => {
                  setSubOpen(false);
                }}
              >
                <div style={styles.mainMenu(subMenuOpen)}>
                  <FolderOpenIcon />
                  <Typography sx={styles.textStyle}>{name}</Typography>
                </div>
                <Tooltip title={name}>
                  <div style={styles.subMenu(subMenuOpen)}>
                    {remove()}
                    <Tooltip title="이동">
                      <DriveFileMoveIcon
                        onClick={() => changeDir(path, item[1])}
                      />
                    </Tooltip>
                    <Typography>{name}</Typography>
                  </div>
                </Tooltip>
              </Card>
            );
          }
        })}

        {files.map((item, idx) => {
          const name = item[1];
          const [subMenuOpen, setSubOpen] = useState(false);
          if (item[0] == "file") {
            const name = item[1];
            return (
              <Card
                key={idx + item[0] + item[1]}
                sx={styles.fileStyle}
                // onClick={() => changeDir(path, item[1])}
                onMouseOver={(e) => {
                  setSubOpen(true);
                }}
                onMouseLeave={(e) => {
                  setSubOpen(false);
                }}
              >
                <div style={styles.mainMenu(subMenuOpen)}>
                  <FileCopyIcon />
                  <Typography sx={styles.textStyle}>{name}</Typography>
                </div>
                <Tooltip title={name}>
                  <div style={styles.subMenu(subMenuOpen)}>
                    <Tooltip title="삭제">
                      <DeleteIcon
                        onClick={() => rmRF(path, item[1], item[0])}
                      />
                    </Tooltip>
                    <Tooltip title="보기">
                      <ZoomInIcon onClick={() => catDir(path, item[1])} />
                    </Tooltip>
                    <Typography>{name}</Typography>
                  </div>
                </Tooltip>
              </Card>
            );
          }
        })}
      </Container>
    );
  } catch {
    return <Container></Container>;
  }
};

const styles = {
  dirCon: {
    display: "block",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignContent: "space-around",
  },
  fileStyle: {
    display: "inline-block",
    textAlign: "center",
    height: "90px",
    width: "22%",
    padding: "5px",
    margin: "3px",
    "&:hover": {
      backgroundColor: alpha(theme.palette.secondary.main, 0.25),
    },
  },
  textStyle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  action: {},
  mainMenu: (check) => {
    return {
      display: check ? "none" : "block",
    };
  },
  subMenu: (check) => {
    return {
      height: "100%",
      // cursor: "pointer",
      visibility: check ? "visible" : "hidden",
      // display: check ? "block" : "none",
    };
  },
};
