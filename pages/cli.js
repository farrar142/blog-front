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
  const [path, setPath] = useState("/home/test/backend/src");
  const [host, setHost] = useState("49.50.174.121");
  const [user, setUser] = useState("root");
  const [port, setPort] = useState(22);
  const [pw, setPw] = useState("");
  const [cmd, setCmd] = useState("");
  const [token, setToken] = useToken();
  const [files, setFiles] = useState([]);
  const [targetFile, setTargetFile] = useState("");
  const [cliResult, setContext] = useState("");
  const [edit, setEdit] = useState("");
  const [action, setAction] = useState(false);
  const [searchKW, setKW] = useState("");
  const [msg, setMsg] = useSysMsg();
  const [viewerWidth, setViewerWidth] = useState(200);
  const [pathHistories, setPathHistories] = useState([]);
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
  function inputPathHandler(e) {
    setPath(e.target.value);
  }
  function pathHandler(target_path) {
    setTargetFile("");
    setPath(target_path);
  }
  function cmdHandler(e) {
    setCmd(e.target.value);
  }
  function portHandler(e) {
    setPort(e.target.value);
  }
  function searchHandler(e) {
    e.preventDefault();
    setKW(e.target.value);
  }
  function handleSubmit(e) {
    try {
      e.preventDefault();
    } catch {}
    try {
      if (cmd.split(" ")[0] == "cd") {
        setMsg("경로 이동은 ui에서만 해주세요.");
        return;
      }
    } catch {}
    if (!token) {
      setMsg("로그인이 필요합니다.");
      return;
    }
    Cli.cli(
      token,
      host,
      user,
      pw ? pw : "eowjsrhkddurtlehdrneowjsfh304qjsrlf28",
      path,
      cmd,
      parseInt(port)
    )
      .then((res) => {
        setFiles(res["files"]);
        //filtering
        const regexUser = `\\[${user}\\@.*\\]\\#`;
        const regexPath = `\\[${user}\\@.*\\]\\# cd ${path}`;
        const regexCmd = `\\[${user}\\@.*\\]\\# ${cmd}`;
        const regexWrapCmd = `${cmd}(.*)`;
        const regexPureCmd = cmd;
        const regexSpace = `(\\s\\r\\n)*[\\s\\r\\n]*`; //시작쪽의 공백제거
        const regexLast = "(\\r\\n\\s)*";
        const regexPurePath = `cd ${path}`;
        const reUser = new RegExp(regexUser, "gm");
        const rePath = new RegExp(regexPath, "gm");
        const reCmd = new RegExp(regexCmd, "gm");
        const rePure = new RegExp(regexPurePath, "gm");
        const rePureCommand = new RegExp(regexPureCmd, "gm");
        const reSpace = new RegExp(regexSpace, "m");
        const reWrap = new RegExp(regexWrapCmd, "m");
        const reLast = new RegExp(regexLast, "gm");
        const regexResult = res["result"]
          .replace(rePath, "")
          .replace(reCmd, "")
          .replace(reUser, "")
          .replace(rePure, "")
          .replace(rePureCommand, "")
          .replace(reSpace, "")
          .replace(/\r\n\>\s/gm, "\n")
          .trim()
          .replace(reWrap, "");
        // .replace(/(\r\n\s)+$/gm, "");
        // .replace(/\s$/gm, "");
        const resultContext = regexResult;
        // console.log(JSON.stringify(cmd));
        // console.log(JSON.stringify(resultContext));
        setContext(resultContext.trim());
        if (!cmd.includes("echo -e")) {
          setEdit("");
        }
        setCmd("");
      })
      .catch((res) => {
        setCmd("");
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
    setKW("");
    setPathHistories([...pathHistories, path]);
    pathHandler(t1);
    setAction(!action);
  };
  const catDir = (path, target) => {
    const cur_path = path === "/" ? "" : path;
    const t_file = cur_path + "/" + target;
    setCmd("cat " + t_file);
    setEdit(""); //수정중인글 초기화
    setTargetFile(t_file);
    setAction(!action);
  };
  const rmRF = (path, target, type) => {
    const cmd = type == "file" ? "rm -f" : "rm -rf";
    const command = `${cmd} ${path}/${target}`;
    if (window.confirm("정말로 삭제하시겠어요?")) {
      setCmd(command);
      setAction(!action);
      setMsg(`삭제됨 명령어 : ${command}`);
    } else {
      setMsg(`삭제 취소됨 명령어 : ${command}`);
    }
  };
  const backToHistories = () => {
    if (pathHistories.length > 0) {
      pathHandler(pathHistories[pathHistories.length - 1]);
      setPathHistories(pathHistories.slice(0, -1));
      setAction(!action);
    }
  };
  const moveAction = (targetPath) => {
    setPathHistories([...pathHistories, path]);
    pathHandler(targetPath);
    setAction(!action);
  };
  useEffect(() => {
    if (token) {
      handleSubmit(null);
    }
  }, [action]);
  const modifyFile = (target, content) => {
    const reContent = `echo -e "${content.replace(
      /\r\n/gm,
      "\n"
    )}" > ${target}`.trim();
    setCmd(reContent);
    setAction(!action);
  };
  const Breads = (props) => {
    const paths = props.paths;
    let sum = "";
    const ftarget = paths.split("/");
    let target;
    //뒤로가기버튼
    const BackButton = () => {
      return (
        <div
          key="backToHitories"
          style={{ cursor: "pointer" }}
          onClick={backToHistories}
        >
          뒤로가기
        </div>
      );
    };
    if (ftarget[0] == false && ftarget[1] == false) {
      target = (
        <div
          key="/"
          style={{ cursor: "pointer" }}
          onClick={() => {
            moveAction("/");
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
                moveAction(pathProp);
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
                moveAction("/");
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
        <BackButton /> {target}
      </Breadcrumbs>
    );
  };
  const Directories = (props) => {
    const { children } = props;
    let files;
    try {
      files = props.files.filter((item) => {
        if (item[1].includes(searchKW)) {
          return item;
        } else {
          return;
        }
      });
    } catch {
      files = [];
    }
    const path = props.path;
    try {
      return (
        <Container sx={styles.dirCon(infoPathOpen)}>
          {children}
          {files.map((item, idx) => {
            const name = item[1] == ".." ? "상위폴더" : item[1];
            const [subMenuOpen, setSubOpen] = useState(false);
            const remove = () => {
              if (item[1] != "..") {
                return (
                  <Tooltip title="삭제">
                    <DeleteIcon
                      sx={styles.iconCursor}
                      onClick={() => rmRF(path, item[1], item[0])}
                    />
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
                          sx={styles.iconCursor}
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
                          sx={styles.iconCursor}
                          onClick={() => rmRF(path, item[1], item[0])}
                        />
                      </Tooltip>
                      <Tooltip title="보기">
                        <ZoomInIcon
                          sx={styles.iconCursor}
                          onClick={() => catDir(path, item[1])}
                        />
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
  const [infoSettingOpen, setSettingOpen] = useState(true);
  const handleSettingOpen = (e) => {
    setSettingOpen(!infoSettingOpen);
  };
  const [infoPathOpen, setPathOpen] = useState(true);
  const handlePathOpen = (e) => {
    setPathOpen(!infoPathOpen);
  };
  return (
    <Container>
      <Container sx={styles.resultCon}>
        <Paper
          component="div"
          sx={styles.respButton}
          onClick={handleSettingOpen}
        >
          Setting
        </Paper>
      </Container>
      <Box
        ref={formRef}
        component="form"
        sx={styles.controller}
        noValidate
        autoComplete="off"
      >
        <Container sx={styles.infoCon(infoSettingOpen)}>
          <TextField
            size="small"
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
            size="small"
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
            size="small"
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
              size="small"
              sx={styles.inputBar}
              id="outlined-read-only-input"
              label="HOST PATH"
              value={path}
              onChange={inputPathHandler}
              // InputProps={{
              //   readOnly: true,
              // }}
            />
            <TextField
              size="small"
              sx={styles.inputBar}
              id="outlined-search"
              name="command"
              label="Command"
              type="text"
              value={cmd}
              onChange={cmdHandler}
            />
            <Button type="submit" onClick={handleSubmit} variant="contained">
              Connect
            </Button>
            <TextField
              size="small"
              sx={styles.inputBar}
              id="outlined-number"
              name="port"
              label="Port"
              type="number"
              value={port}
              onChange={portHandler}
            />
          </Container>
        </Container>
      </Box>
      <Container sx={styles.resultCon}>
        <Paper component="div" sx={styles.respButton} onClick={handlePathOpen}>
          Path
        </Paper>
        <Container>
          <Container sx={styles.dirUpperCon}>
            <Container sx={styles.searchCon}>
              <TextField
                size="small"
                // sx={styles.inputBar}
                id="outlined-search2"
                label="Search"
                name="search"
                onChange={(e) => setKW(e.target.value)}
                value={searchKW}
                autoComplete="off"
              />
              <Button variant="contained" onClick={() => setKW("")}>
                Reset
              </Button>
            </Container>
            <Breads paths={path}></Breads>
          </Container>
          <Directories files={files} path={path}></Directories>
        </Container>
        <CatViewer
          sx={styles.viwerCon}
          sourceFile={targetFile}
          modifyFile={modifyFile}
          viewerWidth={viewerWidth}
          infoPathOpen={infoPathOpen}
          edit={edit}
          setEdit={setEdit}
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
    dirUpperCon: {
      display: "flex",
      flexDirection: { md: "row", xs: "column" },
      alignItems: "center",
    },
    searchCon: {
      display: "flex",
      flexDirection: "row",
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
      flexDirection: {
        xs: "column",
        md: "row",
      },
    },
    viwerCon: {
      width: `100%`,
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
