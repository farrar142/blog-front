import { useState, createRef, useEffect } from "react";
import { Container } from "@mui/material";
export const CatViewer = (props) => {
  let re = /\r\n/g;
  const context = props.context;
  const targetFile = props.targetFile;
  const [edit, setEdit] = useState("");
  const [tabLength, setTabLength] = useState(4);
  const textRef = createRef(null);
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
    <Container sx={{ paddingBottom: "200px" }}>
      <div>TargetFile : {targetFile}</div>
      <div>
        TabLength :
        <input
          id="outlined-number"
          label="Number"
          type="number"
          value={tabLength}
          onChange={(e) => {
            setTabLength(parseInt(e.target.value));
          }}
        />
      </div>
      <textarea
        ref={textRef}
        name="textarea"
        id=""
        cols="30"
        rows="10"
        value={edit ? edit : context}
        onChange={(e) => {
          setEdit(e.currentTarget.value);
        }}
        onKeyDown={handleSetTab}
      ></textarea>
      {/* <pre>
            <code dangerouslySetInnerHTML={result}></code>
          </pre> */}
    </Container>
  );
  // } else {
  //   return <Container></Container>;
  // }
};
