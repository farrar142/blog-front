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
} from "@mui/material";
import { createRef, useCallback, useEffect, useState } from "react";
import { Cli } from "../src/api/API";
import { useSysMsg, useToken } from "../src/hooks";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "../src/theme";
import { CatViewer } from "../components/cli/CatViewer";
export default (props) => {
  const [path, setPath] = useState("/home/test");
  const [host, setHost] = useState("49.50.174.121");
  const [user, setUser] = useState("root");
  const [pw, setPw] = useState("");
  const [cmd, setCmd] = useState("");
  const [token, setToken] = useToken();
  const [files, setFiles] = useState([]);
  const [targetFile, setTargetFile] = useState("");
  const [cliResult, setContext] = useState("");
  const [action, setAction] = useState(false);
  const [msg, setMsg] = useSysMsg();
  const formRef = createRef();
  const viewerRef = createRef();
  const styles = mystyles(theme);
  function hostHandler(e) {
    setHost(e.target.value);
  }
  function userHandler(e) {
    setUser(e.target.value);
  }
  function pwHandler(e) {
    setPw(e.target.value);
  }
  function pathHandler(e) {
    setPath(e.target.value);
  }
  function cmdHandler(e) {
    setCmd(e.target.value);
  }
  function handleSubmit(e) {
    try {
      e.preventDefault();
    } catch {}
    try {
      if (cmd.split(" ")[0] == "cd") {
        alert("경로 이동은 ui에서만 해주세요.");
        return;
      }
    } catch {}

    Cli.cli(
      token,
      host,
      user,
      pw ? pw : "eowjsrhkddurtlehdrneowjsfh304qjsrlf28",
      path,
      cmd
    )
      .then((res) => {
        setFiles(res["files"]);
        console.log(res["result"]);
        setContext(res["result"].split("\r\n").slice(2, -1).join("\r\n"));
        setCmd("");
      })
      .catch((res) => {
        alert("접속 정보를 다시 확인해주세요");
      });
  }
  const changeDir = (path, target) => {
    /// /home/test
    let t1 = "/";
    if (target == ".") {
      return;
    } else if (target == "..") {
      t1 = path.split("/");
      t1.pop();
      t1 = t1.join("/");
      if (!t1) {
        t1 = "/";
      }
    } else {
      const prePath = path == "/" ? "" : path;
      t1 = prePath + "/" + target;
    }
    setPath(t1);
    setAction(!action);
  };
  const catDir = (path, target) => {
    const cur_path = path === "/" ? "" : path;
    const t_file = cur_path + "/" + target;
    setCmd("cat " + t_file);
    setTargetFile(t_file);
    setAction(!action);
  };
  const rmRF = (path, target, type) => {
    const cmd = type == "file" ? "rm -f" : "rm -rf";
    const command = `${cmd} ${path}/${target}`;
    console.log(path, target, type);
    if (window.confirm("정말로 삭제하시겠어요?")) {
      setCmd(command);
      setAction(!action);
      setMsg(`삭제됨 명령어 : ${command}`);
    } else {
      setMsg(`삭제 취소됨 명령어 : ${command}`);
    }
  };
  useEffect(() => {
    if (token) {
      handleSubmit(null);
    }
  }, [action]);

  const Breads = (props) => {
    const paths = props.paths;
    let sum = "";
    const ftarget = paths.split("/");
    let target;
    if (ftarget[0] == false && ftarget[1] == false) {
      target = (
        <div
          key="/"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setPath("/");
            setAction(!action);
          }}
        >
          /
        </div>
      );
    } else {
      target = ftarget.map((item) => {
        if (item) {
          const pathProp = sum + "/" + item;
          sum = sum + "/" + item;
          return (
            <div
              key={item}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPath(pathProp);
                setAction(!action);
              }}
            >
              {item}
            </div>
          );
        } else {
          return (
            <div
              key="/"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPath("/");
                setAction(!action);
              }}
            >
              /
            </div>
          );
        }
      });
    }
    return (
      <Breadcrumbs sx={styles.breadCon} separator="›" aria-label="breadcrumb">
        path :: {target}
      </Breadcrumbs>
    );
  };
  const Directories = (props) => {
    const files = props.files;
    const path = props.path;
    try {
      return (
        <Container sx={styles.dirCon}>
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
  const [infoOpen, setOpen] = useState(true);
  const handleOpen = (e) => {
    setOpen(!infoOpen);
  };
  return (
    <Container>
      <Box
        ref={formRef}
        component="form"
        sx={styles.controller}
        noValidate
        autoComplete="off"
      >
        <Paper component="div" sx={styles.respButton} onClick={handleOpen}>
          Setting
        </Paper>
        <Container sx={styles.infoCon(infoOpen)}>
          <TextField
            required
            sx={styles.inputBar}
            id="outlined-required1"
            label="hostname"
            name="hostname"
            onChange={hostHandler}
            value={host}
            placeholder="IP Address"
          />
          <TextField
            required
            sx={styles.inputBar}
            id="outlined-required2"
            label="username"
            name="username"
            onChange={userHandler}
            value={user}
            placeholder="Host NAME"
          />
          <TextField
            required
            sx={styles.inputBar}
            id="outlined-password-input"
            label="HOST PASSWORD"
            type="password"
            name="password"
            onChange={pwHandler}
            autoComplete="current-password"
          />
          <Container sx={styles.submitCon}>
            <TextField
              sx={styles.inputBar}
              id="outlined-read-only-input"
              label="HOST PATH"
              value={path}
              onChange={pathHandler}
              // InputProps={{
              //   readOnly: true,
              // }}
            />
            <TextField
              sx={styles.inputBar}
              id="outlined-search"
              name="command"
              label="Command"
              type="text"
              value={cmd}
              onChange={cmdHandler}
            />
            <Button type="submit" onClick={handleSubmit} variant="contained">
              연결
            </Button>
          </Container>
        </Container>
      </Box>
      <Breads paths={path}></Breads>
      <Container sx={styles.resultCon}>
        <Directories files={files} path={path}></Directories>
        <CatViewer
          sx={styles.textCon}
          targetFile={targetFile}
          context={cliResult}
        ></CatViewer>
      </Container>
    </Container>
  );
};
const mystyles = (theme) => {
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
      margin: "0 auto",
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
    inputBar: {
      width: "300px",
    },
    respButton: {
      display: {
        xs: "block",
        md: "none",
      },
    },
    breadCon: {
      margin: "auto",
      padding: "24px",
    },
    resultCon: {
      display: "flex",
      width: "100%",
      flexDirection: {
        xs: "column",
        md: "row",
      },
    },
    textCon: {
      width: "100%",
    },
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
};
