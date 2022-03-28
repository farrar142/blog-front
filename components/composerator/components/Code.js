import { useEffect, createRef } from "react";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import Prism from "prismjs";
import "prismjs/components/prism-yaml.js";
import "prismjs/themes/prism-coy.css";
const okaidia = -1;
const coy = 30;
export default ({ code, codeSetter, language }) => {
  const ref = createRef();
  useEffect(() => {
    Prism.highlightAll();
  }, [ref]);
  return (
    <ScrollSync>
      <div className="Code" style={styles.con}>
        <ScrollSyncPane>
          <textarea
            id="editing"
            style={{
              ...styles.editing,
              ...styles.font,
              ...styles.transparent,
              zIndex: "1",
              top: "1px",
              left: `${coy}px`,
              resize: "none",
            }}
            value={code.trim()}
            onChange={(e) => {
              codeSetter(e.target.value);
            }}
            onKeyDown={(e) => handleSetTab(e, codeSetter)}
            className={"scrollbar-hidden"}
          ></textarea>
        </ScrollSyncPane>

        <pre
          id="highlighting"
          style={{ ...styles.editing, ...styles.font, zIndex: "0" }}
          aria-hidden="true"
          className={`lang-${language} scrollbar-hidden`}
          ref={ref}
        >
          <ScrollSyncPane>
            <code
              id="highlighting-content"
              style={styles.font}
              className={`language-${language}  scrollbar-hidden`}
              data-language={`${language}`}
            >
              {code.trim()}
            </code>
          </ScrollSyncPane>
        </pre>
      </div>
    </ScrollSync>
  );
};
const styles = {
  con: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  transparent: {
    color: "transparent",
    background: "transparent",
    caretColor: "black",
  },
  editing: {
    margin: "0px",
    padding: "0px",
    border: 0,
    width: "calc(100vw-50%)",
    height: "80vh",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  font: {
    letterSpacing: "0.3px",
    fontSize: "15pt",
    fontFamily: "monospace",
    lineHeight: "22.5pt",
  },
};

const handleSetTab = (e, setter) => {
  const tabLength = 2;
  if (e.keyCode === 9) {
    e.preventDefault();
    let val = e.target.value;
    let start = e.target.selectionStart;
    let end = e.target.selectionEnd;
    e.target.value =
      val.substring(0, start) + " ".repeat(tabLength) + val.substring(end);
    e.target.selectionStart = e.target.selectionEnd =
      start + parseInt(tabLength);
    setter(e.target.value);
    return false; //  prevent focus
  }
  return false;
};
