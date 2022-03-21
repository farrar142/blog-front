import Prism from "prismjs";
import { Editor } from "@toast-ui/react-editor";
import uml from "@toast-ui/editor-plugin-uml";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-docker.js";
// import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-c.js";
import "prismjs/components/prism-cpp.js";
import "prismjs/components/prism-csharp.js";
import "prismjs/components/prism-powershell.js";
import "prismjs/components/prism-cshtml.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-scss.js";
import "prismjs/components/prism-css-extras.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-systemd.js";
// import "prismjs/components/prism-django.js";
// import "prismjs/components/prism-phpdoc.js";
import "prismjs/components/prism-go.js";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

import "@toast-ui/editor/dist/toastui-editor.css";
import { useState } from "react";
import { useInterval } from "./AsideNavBar";
import theme from "../src/theme";
import AsideNavBar from "./AsideNavBar";
function ToastEditor(props) {
  const editorRef = props.editorRef;
  const onChange = props.onChangeFunction;
  const context = props.context;
  const { article } = props;
  const [htmlEl, setEl] = useState(null);
  useInterval(() => {
    try {
      setEl(editorRef);
    } catch {}
  }, 1000);
  return (
    // <div style={{ display: "flex", flexDirection: "row" }}>
    <Editor
      initialValue={article.context}
      previewStyle="vertical"
      initialEditType="markdown"
      width="100%"
      height="60vh"
      onChange={onChange}
      ref={editorRef}
      plugins={[uml, [codeSyntaxHighlight, { highlighter: Prism }]]}
    />
    //   {/* <AsideNavBar
    //     sx={styles.asidebar}
    //     highlighter={theme.palette.secondary.main}
    //     htmlEl={htmlEl}
    //     target={editorRef}
    //   ></AsideNavBar> */}
    // {/* </div> */}
  );
}

export default ToastEditor;
