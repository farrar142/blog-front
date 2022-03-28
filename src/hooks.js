import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  currentViewingBlog,
  systemMessageState,
  articleState,
  writeArticle,
  blogFactory,
  Token,
  currentViewingArticle,
  AccountsInfoState,
  AccountsInfoFactory,
  searchTag,
  CliHost,
  CliPw,
  cursorLoadingAtom,
  serviceAtom,
  environAtom,
  testDataAtom,
} from "./Atom";
import { tag_stringfy } from "./functions";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Blog } from "./api/API";
import { any } from "prop-types";

export function useBlogChecker(blogId = null) {
  const [curBlog, setCurBlog] = useRecoilState(currentViewingBlog);
  useEffect(() => {
    if (blogId) {
      if (curBlog.id !== blogId) {
        Blog.get_blog_by_id(blogId).then((res) => {
          setCurBlog(res);
        });
      }
    }
  }, [blogId]);
  return curBlog;
}
export function useArticleChecker(blogId) {
  const [curArticle, setArticle] = useRecoilState(articleState(blogId));
  const handler = (articleId) => {
    setArticle(articleId);
  };
  return [curArticle, handler];
}

export function useSysMsg(value = null) {
  const [message, setMessage] = useRecoilState(systemMessageState);
  // 함수 정의
  const handler = (msg) => {
    setMessage([...message, msg]);
    // setTimeout(() => {
    //   console.log("타임아웃");
    //   setMessage(message.filter((item) => item !== msg));
    // }, 10000);
  };
  return [message, handler];
}
export function useAccountsInfo(value = null) {
  const [accountsInfo, setAccountsInfo] = useRecoilState(AccountsInfoState);
  const handler = (values) => {
    setAccountsInfo(values);
  };
  return [accountsInfo, handler];
}

export function useEditArticle(value = null) {
  const [article, setArticle] = useRecoilState(currentViewingArticle);
  const handler = (title, tags, context, id = 0, blogId = 0) => {
    setArticle(blogFactory(title, tags, context, id, blogId));
    // setArticle(blogFactory(title, tags, context, id));
  };
  return [article, handler];
}

export function useWriteArticle(value = null) {
  const [article, setArticle] = useRecoilState(writeArticle);
  const handler = (title, tags, context) => {
    setArticle(blogFactory(title, tags, context));
  };
  return [article, handler];
}

export function useToken(value = null) {
  const [token, setToken] = useRecoilState(Token);
  const handler = (token) => {
    setToken(token);
  };
  return [token, handler];
}

export function useSearchTag(value = null) {
  const [curTag, setSearchTag] = useRecoilState(searchTag);
  const handler = (tag) => {
    setSearchTag(tag);
  };
  return [curTag, handler];
}
//composerator starts
export function useServiceAtom(value = null) {
  const [service, setService] = useRecoilState(serviceAtom);
  const [sysMsg, setMsg] = useSysMsg();
  const handler = (newValue) => {
    console.log(newValue);
    const isSameName = service.filter((value, index) => {
      if (value.name.toLowerCase() === newValue.name.toLowerCase()) {
        return true;
      }
    });
    if (isSameName.length === 0) {
      setService([...service, newValue]);
      return true;
    } else {
      setMsg("이미 같은 이름이 있습니다.");
      return false;
    }
  };
  const remover = (idx) => {
    setService(service.filter((val, index) => index !== idx));
  };
  return [service, handler, remover];
}
export function useEnvironAtom(value = null) {
  const [environ, setEnviron] = useRecoilState(environAtom(value));
  const handler = (newValue) => {
    setEnviron([...environ, newValue]);
  };
  const remover = (idx) => {
    setEnviron(environ.filter((v, i) => i !== idx));
  };
  return [environ, handler, remover];
}
export function useTestDataAtom(value = null) {
  const [environ, setEnviron] = useRecoilState(testDataAtom);
  const handler = (newValue) => {
    setEnviron(newValue);
  };
  return [environ, handler];
}
//composerator ends

export function useCursorLoading(value = null) {
  const [cursorLoading, setCursorLoading] = useRecoilState(cursorLoadingAtom);

  const handler = (tag) => {
    setCursorLoading(tag);
  };
  const mouseMove = (cursorLoading) => {
    // console.log(cursorLoading);
  };
  useEffect(() => {
    window.addEventListener("mousemove", mouseMove(cursorLoading));
    return () => {
      window.removeEventListener("mousemove", mouseMove(cursorLoading));
    };
  });
  return [cursorLoading, handler];
}
//cli Hooks Start
export function useCliHost(value = null) {
  const [cliHost, setCliHost] = useRecoilState(CliHost);
  const handler = (hostname) => {
    setCliHost(hostname);
  };
  return [cliHost, handler];
}

export function useCliPw(value = null) {
  const [cliPw, setCliPw] = useRecoilState(CliPw);
  const handler = (pw) => {
    setCliPw(pw);
  };
  return [cliPw, handler];
}
//cli Hooks End

export function useTimeout(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
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
    // console.log(winScroll);
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
export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  return position;
};

export function useResize(value = null) {
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
export function useDebounce(callback, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}
