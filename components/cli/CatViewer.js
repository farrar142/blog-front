import { useState, createRef, useEffect } from "react";
import {
  Container,
  Button,
  Slider,
  TextField,
  Box,
  Tooltip,
} from "@mui/material";
export const CatViewer = (props) => {
  let re = /\r\n/g;
  const {
    context,
    sourceFile,
    modifyFile,
    viewerWidth,
    setSourceFile,
    edit,
    setEdit,
    infoPathOpen,
    cP,
    mV,
  } = props;
  const [tabLength, setTabLength] = useState(4);
  const [targetFile, setTargetFile] = useState("");
  const textRef = createRef(null);
  const [vW, setVW] = useState(100);
  useEffect(() => {
    if (textRef === null || textRef.current === null) {
      return;
    }
    textRef.current.style.height = "50vh";
    // textRef.current.style.height = textRef.current.scrollHeight + "px";
    textRef.current.style.width = "100%";
  }, [textRef]);
  const handleSetTab = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      let val = e.target.value;
      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      e.target.value =
        val.substring(0, start) + " ".repeat(tabLength) + val.substring(end);
      e.target.selectionStart = e.target.selectionEnd =
        start + parseInt(tabLength);
      setEdit(e.target.value);
      return false; //  prevent focus
    }
    return false;
  };
  // if (context) {
  // context.replace(re, "<br>")
  const result = { __html: context };
  return (
    <Box
      sx={{
        width: `${vW}%`,
        paddingBottom: "200px",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      <Box sx={styles.catCon(infoPathOpen)}>
        <Box sx={styles.inputWithButton}>
          <Tooltip title="원본 파일 입니다.">
            <TextField
              name="SourceFile"
              label="SourceFile"
              sx={styles.inputCon}
              value={sourceFile}
              onChange={(e) => setSourceFile(e.target.value)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="원본 파일에서 대상 파일로 복사합니다">
            <Button
              sx={styles.actionButton}
              onClick={() => {
                cP(sourceFile, targetFile);
              }}
              variant="contained"
            >
              Paste
            </Button>
          </Tooltip>
        </Box>
        <Box sx={styles.inputWithButton}>
          <Tooltip title="대상 파일입니다.">
            <TextField
              name="TargetFile"
              label="TargetFile"
              sx={styles.inputCon}
              value={targetFile}
              onChange={(e) => {
                setTargetFile(e.target.value);
              }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="원본 파일에서 대상 파일로 파일을 옮깁니다.">
            <Button
              sx={styles.actionButton}
              onClick={() => {
                mV(sourceFile, targetFile);
              }}
              variant="contained"
            >
              Move
            </Button>
          </Tooltip>
        </Box>
        <Tooltip title="탭을 눌렀을때 탭의 길이를 조절합니다.">
          <TextField
            label="TabLength"
            type="number"
            value={tabLength}
            onChange={(e) => {
              setTabLength(parseInt(e.target.value));
            }}
            size="small"
          />
        </Tooltip>
        <Tooltip title="에디터 창의 크기를 조절합니다.">
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <Box style={{ width: "80px" }}>Size</Box>
            <Slider
              defaultValue={100}
              min={20}
              max={200}
              aria-label="Default"
              valueLabelDisplay="auto"
              onMouseUp={(e) => {
                if (e.target.querySelector("input")) {
                  setVW(e.target.querySelector("input").value);
                }
              }}
            />
          </Box>
        </Tooltip>
      </Box>
      <textarea
        style={{ padding: 0, margin: 0 }}
        ref={textRef}
        name="textarea"
        id=""
        cols="30"
        rows="10"
        value={edit ? edit : context}
        onChange={(e) => {
          if (e.currentTarget) {
            setEdit(e.currentTarget.value);
          }
        }}
        onKeyDown={handleSetTab}
      ></textarea>
      <Tooltip title="소스파일을 수정합니다.">
        <Button
          sx={styles.modifyButton}
          onClick={() => {
            modifyFile(sourceFile, edit ? edit : context);
          }}
          variant="contained"
        >
          Modify
        </Button>
      </Tooltip>
      {/* <pre>
            <code dangerouslySetInnerHTML={result}></code>
          </pre> */}
    </Box>
  );
  // } else {
  //   return <Container></Container>;
  // }
};

const styles = {
  catCon: (check) => {
    return {
      display: { xs: check ? "none" : "flex", md: "flex" },
      flexDirection: "column",
      justifyContent: "center",
    };
  },
  inputWithButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
  },
  actionButton: { width: "65px" },
  inputCon: {
    width: "100%",
  },
  modifyButton: {
    padding: "6px 0",
  },
};
