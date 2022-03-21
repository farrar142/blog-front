import { useState, createRef, useEffect } from "react";
import { Container, Button, Slider, TextField, Box } from "@mui/material";
export const CatViewer = (props) => {
  let re = /\r\n/g;
  const {
    context,
    sourceFile,
    modifyFile,
    viewerWidth,
    edit,
    setEdit,
    infoPathOpen,
  } = props;
  const [tabLength, setTabLength] = useState(4);
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
    <Box sx={{ width: `${vW}%`, paddingBottom: "200px", paddingLeft: "10px" }}>
      <Box sx={styles.catCon(infoPathOpen)}>
        <Box sx={styles.inputWithButton}>
          <TextField
            name="SourceFile"
            label="SourceFile"
            sx={styles.inputCon}
            value={sourceFile}
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />

          <Button
            sx={styles.actionButton}
            onClick={() => {}}
            variant="contained"
          >
            Paste
          </Button>
        </Box>
        <Box sx={styles.inputWithButton}>
          <TextField
            name="TargetFile"
            label="TargetFile"
            sx={styles.inputCon}
            value={sourceFile}
            size="small"
          />
          <Button
            sx={styles.actionButton}
            onClick={() => {}}
            variant="contained"
          >
            Move
          </Button>
        </Box>
        <TextField
          label="TabLength"
          type="number"
          value={tabLength}
          onChange={(e) => {
            setTabLength(parseInt(e.target.value));
          }}
          size="small"
        />

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
      <Button
        sx={styles.modifyButton}
        onClick={() => {
          modifyFile(sourceFile, edit ? edit : context);
        }}
        variant="contained"
      >
        Modify
      </Button>
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
