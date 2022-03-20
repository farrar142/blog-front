import { useRef, useEffect, useState } from "react";
import { sortById } from "../src/functions";
import { useMousePosition } from "../src/hooks";

//customFunction Start
function htmlCollectionToArray(target, depth) {
  let s1 = Array.prototype.slice.call(target);
  let s2 = s1.map((item) => {
    return {
      context: item.innerText,
      child: [],
      item,
      depth: parseInt(depth),
      id: item.dataset.nodeid,
      offset: item.offsetTop,
    };
  });
  return s2;
}

function offsetSetter(target) {
  let s1 = target;
  let container = [];
  if (target) {
    for (let i = 0; i < target.length; i++) {
      const t1 = s1[i];
      let t2 = null;
      let offsetHeight = 0;
      try {
        t2 = s1[i + 1];
        offsetHeight = t2.offset - t1.offset;
      } catch {
        offsetHeight = 10000;
      }
      container.push({
        ...t1,
        offsetHeight: offsetHeight,
      });
    }
    return container;
  } else {
    return [];
  }
}
function anchorMapper(item) {
  item.item.id = item.context;
  item.item.className = item.context;
  item.item.style = `scroll-margin-top:70px;`;
}
// legacy
export function scrollToItem(item) {
  item.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}
// customFunction End

//mainComponent Start
export default (props) => {
  const highlightedText = props.highlighter || "green";
  const style = props.sx ? props.sx : {};
  const editorRef = props.htmlEl;
  const [titleNav, setTitleNav] = useState({});
  const scrollPosition = useScrollPosition();
  const isResized = useResize(editorRef);
  const [isNavLoaded, setLoading] = useState(true);
  const [isLocated, setLocated] = useState(true);
  const router = props.router;
  let targetPath;
  try {
    targetPath = decodeURI(router.asPath.split("#")[1]);
  } catch {}
  useInterval(() => {
    if (isNavLoaded) {
      try {
        setTitleNav(
          editorRef
            ? editorRef.current
                .getInstance()
                .options.el.querySelector(
                  "div>div>div>div>.toastui-editor-md-preview>div"
                )
            : props.target.current.getInstance().options.el.querySelector("div")
        );
        setLoading(false);
      } catch {}
    }
  }, [isNavLoaded ? null : 1000]);
  let all_list = [];
  const tags = ["h1", "h2", "h3", "h4", "h5"];

  let depth = 0;
  let s1 = [];
  try {
    s1 = tags.map((tag) => {
      depth++;
      return (all_list = all_list.concat(
        htmlCollectionToArray(
          props.htmlEl
            ? props.htmlEl.current
                .getInstance()
                .options.el.querySelector(
                  "div>div>div>div>.toastui-editor-md-preview>div"
                )
                .getElementsByTagName(tag)
            : props.target.current
                .getInstance()
                .options.el.querySelector("div")
                .getElementsByTagName(tag),
          depth
        )
      ));
    });
  } catch {}
  all_list = sortById(all_list, "id");
  all_list = offsetSetter(all_list);
  let dummy = {
    depth: 0,
    child: [],
    context: "목록",
    id: 0,
    item: null,
    offset: 0,
    offsetHeight: 0,
  };
  let last_item = dummy;
  let latest_item = dummy;
  let node_list = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };
  let node = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
  };
  node[0] = dummy;
  node[1] = dummy;
  let offset_node = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let entering_node = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  };
  let last_depth = 0;
  let t1 = {};
  try {
    if (titleNav) {
      try {
        try {
          if (isLocated) {
            const target_collection = props.target.current
              .getInstance()
              .options.el.querySelector("div")
              .getElementsByClassName(targetPath); // 맨처음로딩을 false시키기위해...어쩔수없이 남겨둠
            // setTimeout(() => scrollToItem(target_collection[0]), 1000);
            window.location.href = "#" + targetPath; // scroll to item
            setLocated(false);
          }
        } catch {}

        // console.log("target_path_array", target_path.nameditem(0));
        // scrollToItem(target_path[0]);
        for (let item in all_list) {
          t1 = all_list[item];
          if (latest_item.depth < t1.depth) {
            //더 깊이 들어감
            node[t1.depth] = latest_item; //현재깊이의 바로 상위노드 저장
            node_list[t1.depth] = []; //사용할 노드리스트 초기화
            node_list[t1.depth].push(t1);
            // offset_node[t1.depth] = 0;
            offset_node[t1.depth] = latest_item.offsetHeight + t1.offsetHeight;
            for (let i = 1; i <= t1.depth; i++) {
              offset_node[t1.depth - i] += t1.offsetHeight;
            }
          } else if (latest_item.depth == t1.depth) {
            //같은 위치에서 배열에 푸시
            node_list[t1.depth].push(t1);
            offset_node[t1.depth] += t1.offsetHeight;

            for (let i = 1; i <= t1.depth; i++) {
              offset_node[t1.depth - i] += t1.offsetHeight;
            }
          } else {
            node_list[t1.depth].push(t1); //밖으로나옴 이전노드들과 달리 상위노드에 저장됨.
            offset_node[t1.depth] += t1.offsetHeight;
            for (let i = 0; i <= latest_item.depth - t1.depth; i++) {
              let idx = latest_item.depth - i;
              node[idx].child = node_list[idx]; //depth 4에서 1로가는경우 4~1 노드리스트를 저장함
              node[idx].offsetHeight = offset_node[idx];
              offset_node[idx + 1] = 0;
            }
          }
          latest_item = t1;
        }
        //마지막노드에서 0번노드까지 정리.
        for (let i = 0; i <= t1.depth; i++) {
          offset_node[t1.depth - i] += t1.offsetHeight;
        }
        for (let i = 0; i <= latest_item.depth; i++) {
          let idx = latest_item.depth - i;
          node[idx].child = node_list[idx]; //depth 4에서 1로가는경우 4~1 노드리스트를 저장함
          node[idx].offsetHeight = offset_node[idx];
        }
        node[last_item.depth].child = node_list[last_depth];
        dummy.child = node_list[1];
        dummy.offsetHeight = offset_node[0];
        all_list.map((item) => anchorMapper(item)); //구조분해하게되면 섈로카피를 해서 따로 해줌.
      } catch {}
    } else {
      return;
    }
    return (
      <div style={style}>
        <SubComponent
          highlightedText={highlightedText}
          key={"main"}
          prop={[dummy, ...all_list][0]}
          sposition={scrollPosition}
          editorRef={editorRef}
        ></SubComponent>
      </div>
    );
  } catch {
    return <div></div>;
  }
};

// mainComponent End

// SubComponent Start
function SubComponent(props) {
  const highlightedText = props.highlightedText;
  const editorRef = props.editorRef;
  const myItem = props.prop;
  const scrollPosition = props.sposition;

  const mousePosition = useMousePosition();
  const margin = props.margin ? props.margin : 300;
  if (myItem) {
    function isButton() {
      if (myItem.child.length) {
        return <button onClick={() => isDisplay()}>Toggle</button>;
      } else {
        return;
      }
    }
    function isDisplay(value = null) {
      let target = document.getElementsByClassName(
        `asideNavBar-${myItem.id}`
      )[0].style.display;
      if (target === "block") {
        document.getElementsByClassName(
          `asideNavBar-${myItem.id}`
        )[0].style.display = value || "none";
      } else {
        document.getElementsByClassName(
          `asideNavBar-${myItem.id}`
        )[0].style.display = value || "block";
      }
    }
    function isFirst(id) {
      if (id !== 0) {
        return editorRef ? "block" : "none";
      } else {
        return "block";
      }
    }
    function highlighter() {
      if (
        myItem.offset - 140 < scrollPosition + mousePosition.y - 140 &&
        scrollPosition + mousePosition.y - 140 <
          myItem.offset + myItem.offsetHeight - 140
      ) {
        try {
          isDisplay("block");
        } catch {}
        return [
          editorRef ? "1rem" : "1.4rem",
          editorRef ? "black" : highlightedText,
        ];
      } else {
        try {
          isDisplay("none");
        } catch {}
        return [editorRef ? "1rem" : "0.7rem", "black"];
      }
    }
    return (
      <div key={myItem.id}>
        <div>
          <a
            component="div"
            onClick={() => isDisplay()}
            href={`#${myItem.context}`}
            // onClick={() => scrollToItem(item.item)}
            style={{
              marginLeft: `${myItem.depth * 20}px`,
              textDecoration: "none",
              whiteSpace: "noWrap",
              fontSize: highlighter()[0],
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
              display: "block",
              "&:hover": {
                fontSize: "1.2rem",
              },
            }}
          >
            <font color={highlighter()[1]}>
              {myItem.context}
              {/* offset : {myItem.offset} to{" "}
              {myItem.offset + myItem.offsetHeight} */}
            </font>
          </a>
          {/* {isButton()} */}
          <div
            style={{ display: isFirst(myItem.id) }}
            className={`asideNavBar-${myItem.id}`}
          >
            {myItem.child.map((item) => {
              return (
                <SubComponent
                  highlightedText={highlightedText}
                  key={item.context}
                  prop={item}
                  sposition={scrollPosition}
                  editorRef={editorRef}
                ></SubComponent>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  return <div></div>;
}
// SubComponent End

// customHook Start

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
export function useScrollPosition(value = null) {
  const [scrollPosition, setPosition] = useState(0);
  const listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = winScroll / height;
    setPosition(winScroll);
    return {
      theposition: scrolled,
    };
  };
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => {
      window.removeEventListener("scroll", listenToScroll);
    };
  }, []);
  return scrollPosition;
}

export function useResize(value = value) {
  const [changed, setChanged] = useState(0);
  const handleResize = (e) => {
    setChanged(e);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return changed;
}

// customHook End
