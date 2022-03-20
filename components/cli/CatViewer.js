import { useState, createRef, useEffect } from "react";
import { Container, Button, Slider, TextField } from "@mui/material";
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
    <Container sx={{ width: `${vW}%`, paddingBottom: "200px" }}>
      <Container sx={styles.catCon(infoPathOpen)}>
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
        <TextField
          name="TargetFile"
          label="TargetFile"
          sx={styles.inputCon}
          value={sourceFile}
          size="small"
        />
        <TextField
          label="TabLength"
          type="number"
          value={tabLength}
          onChange={(e) => {
            setTabLength(parseInt(e.target.value));
          }}
          size="small"
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "80px" }}>Size</div>
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
        </div>
      </Container>
      <textarea
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
    </Container>
  );
  // } else {
  //   return <Container></Container>;
  // }
};

const styles = {
  catCon: (check) => {
    return {
      display: { xs: check ? "block" : "none", md: "blcok" },
    };
  },
  inputCon: {
    width: "100%",
    padding: "0px",
    marginBottom: "10px",
  },
};
