import React, { createRef, useCallback, useEffect, useState } from "react";
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
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
export const Directories = React.memo((props) => {
  const {
    children,
    rmRF,
    pasteName,
    changeDir,
    catDir,
    infoPathOpen,
    searchKW,
  } = props;
  const [curFiles, setCurFiles] = useState(props.files);
  console.log(children, searchKW);
  console.log("iam rendered");
  useEffect(() => {
    try {
      setCurFiles(
        props.files.filter((item) => {
          console.log(searchKW);
          if (item[1].includes(searchKW)) {
            return item;
          } else {
            return;
          }
        })
      );
    } catch {
      setCurFiles([]);
    }
  }, [props.files, searchKW]);
  const path = props.path;
  const m_styles = styles(theme);
  if (!curFiles) {
    return <Container></Container>;
  }
  return (
    <Box sx={m_styles.dirCon(infoPathOpen)}>
      {children}
      {curFiles.map((item, idx) => {
        if (item[1] == ".") {
          return;
        }
        return (
          <DisplayDirIcon
            key={item[0] + item[1] + idx}
            item={item}
            idx={idx}
            rmRF={rmRF}
            pasteName={pasteName}
            catDir={catDir}
            changeDir={changeDir}
            path={path}
          />
        );
      })}

      {curFiles.map((item, idx) => {
        if (item[0] !== "file") {
          return;
        }
        return (
          <DisplayFileIcon
            key={idx + item[0] + item[1]}
            item={item}
            idx={idx}
            rmRF={rmRF}
            pasteName={pasteName}
            catDir={catDir}
            changeDir={changeDir}
            path={path}
          />
        );
      })}
    </Box>
  );
});

const DisplayDirIcon = React.memo((props) => {
  const { path, item, idx, rmRF, pasteName, catDir, changeDir } = props;
  const name = item[1] == ".." ? "상위폴더" : item[1];
  const [subMenuOpen, setSubOpen] = useState(false);
  const m_styles = styles(theme);
  const remove = () => {
    if (item[1] != "..") {
      return (
        <Tooltip title="삭제">
          <DeleteIcon
            sx={m_styles.iconCursor}
            onClick={() => rmRF(path, item[1], item[0])}
          />
        </Tooltip>
      );
    } else {
      return;
    }
  };
  return (
    <Card
      sx={m_styles.fileStyle}
      // onClick={() => changeDir(path, item[1])}
      onMouseOver={() => {
        setSubOpen(true);
      }}
      onMouseLeave={() => {
        setSubOpen(false);
      }}
    >
      <div style={m_styles.mainMenu(subMenuOpen)}>
        <FolderOpenIcon />
        <Typography sx={m_styles.textStyle}>{name}</Typography>
      </div>
      <Tooltip title={name}>
        <div style={m_styles.subMenu(subMenuOpen)}>
          {remove()}
          <Tooltip title="이름복사">
            <ContentPasteIcon
              sx={m_styles.iconCursor}
              onClick={() => pasteName(path, item[1])}
            />
          </Tooltip>
          <Tooltip title="이동">
            <DriveFileMoveIcon
              sx={m_styles.iconCursor}
              onClick={() => changeDir(path, item[1])}
            />
          </Tooltip>
          <Typography>{name}</Typography>
        </div>
      </Tooltip>
    </Card>
  );
});
const DisplayFileIcon = React.memo((props) => {
  const { path, item, idx, rmRF, pasteName, catDir, changeDir } = props;
  const [subMenuOpen, setSubOpen] = useState(false);
  const name = item[1];
  const m_styles = styles(theme);
  return (
    <Card
      sx={m_styles.fileStyle}
      // onClick={() => changeDir(path, item[1])}
      onMouseOver={(e) => {
        setSubOpen(true);
      }}
      onMouseLeave={(e) => {
        setSubOpen(false);
      }}
    >
      <div style={m_styles.mainMenu(subMenuOpen)}>
        <FileCopyIcon />
        <Typography sx={m_styles.textStyle}>{name}</Typography>
      </div>
      <Tooltip title={name}>
        <div style={m_styles.subMenu(subMenuOpen)}>
          <Tooltip title="삭제">
            <DeleteIcon
              sx={m_styles.iconCursor}
              onClick={() => rmRF(path, item[1], item[0])}
            />
          </Tooltip>
          <Tooltip title="이름복사">
            <ContentPasteIcon
              sx={m_styles.iconCursor}
              onClick={() => pasteName(path, item[1])}
            />
          </Tooltip>
          <Tooltip title="보기">
            <ZoomInIcon
              sx={m_styles.iconCursor}
              onClick={() => catDir(path, item[1])}
            />
          </Tooltip>
          <Typography>{name}</Typography>
        </div>
      </Tooltip>
    </Card>
  );
});
const styles = () => {
  return {
    controller: {
      "& .MuiTextField-root": { m: 1, width: "25ch" },
      maxWidth: "1200px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: "auto",
      margin: "0 10px",
    },
    infoCon: (check) => {
      return {
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        maxWidth: "1200px",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "auto",
        margin: "0 auto",
        display: { xs: check ? "none" : "flex", md: "flex" },
      };
    },
    submitCon: {
      "& .MuiTextField-root": { m: 1, width: "25ch" },
      maxWidth: "1200px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: "auto",
      margin: "0 auto",
    },
    dirUpperCon: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    searchCon: {
      display: "flex",
      flexDirection: "row",
    },
    searchBar: { width: "100%" },
    resetButton: {
      width: "65px",
    },
    inputBar: {
      width: "300px",
    },
    respButton: {
      display: {
        xs: "block",
        md: "none",
      },
      width: "20%",
      margin: "auto",
      textAlign: "center",
      marginTop: "10px",
      marginBottom: "10px",
    },
    breadCon: {
      margin: "auto",
      padding: "24px",
    },
    resultCon: {
      display: "flex",
      width: `100%`,
      padding: 0,
      flexDirection: {
        xs: "column",
        md: "row",
      },
    },
    viwerCon: {
      width: "50%",
    },
    dirCon: (check) => {
      return {
        display: "block",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignContent: "space-around",
        display: { xs: check ? "none" : "block", md: "block" },
      };
    },
    fileStyle: {
      display: "inline-block",
      textAlign: "center",
      height: "70px",
      width: "15%",
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
    iconCursor: {
      cursor: "pointer",
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
    infoPathCon: (check) => {
      return {
        display: { xs: check ? "none" : "flex", md: "flex" },
      };
    },
  };
};
