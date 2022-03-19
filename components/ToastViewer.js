import Prism from "prismjs";
import { Viewer } from "@toast-ui/react-editor";
import uml from "@toast-ui/editor-plugin-uml";
import "prismjs/themes/prism.css";
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
