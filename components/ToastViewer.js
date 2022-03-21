import Prism from "prismjs";
import { Viewer } from "@toast-ui/react-editor";
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
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

function ToastViewer(props) {
  // console.log(props);
  return (
    <Viewer
      initialValue={props.context}
      ref={props.aRef}
      previewStyle="vertical"
      initialEditType="markdown"
      width="90%"
      plugins={[uml, [codeSyntaxHighlight, { highlighter: Prism }]]}
    ></Viewer>
  );
}

export default ToastViewer;
