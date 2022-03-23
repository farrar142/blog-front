import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
  atomFamily,
} from "recoil";

import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();
const { persistAtom: blogAtom } = recoilPersist({
  key: "blogAtom",
});
const { persistAtom: ArticleAtom } = recoilPersist({
  key: "ArticleAtom",
});
const { persistAtom: CliAtom } = recoilPersist({
  key: "CliAtom",
});
const { persistAtom: pageAtom } = recoilPersist({ key: "pageAtom" });

export function AccountsInfoFactory(name, id, blog__id = 0, blog__name = "") {
  return {
    username: name,
    user_id: id,
    blog__id: blog__id,
    blog__name: blog__name,
  };
}

export function blogFactory(title, tags, context, id = 0, blogId = 0) {
  return {
    title: title,
    tags: tags,
    context: context,
    id: id,
    blogId: blogId,
  };
}
//ssr option start
const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
});

export const useSsrComplectedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};

export const persistAtomEffect = (param) => {
  param.getPromise(ssrCompletedState).then(() => {
    return persistAtom(param);
  });
};
export const persistCliEffect = (param) => {
  param.getPromise(ssrCompletedState).then(() => {
    return CliAtom(param);
  });
};
// ssr option end
export const cursorLoadingAtom = atom({
  key: "cursorLoading",
  default: false,
});
export const searchTag = atom({
  key: "searchTag",
  default: "",
  effects_UNSTABLE: [persistAtomEffect],
});
export const systemMessageState = atom({
  key: "systemMessage",
  default: [],
  effects_UNSTABLE: [persistAtomEffect],
});

export const AccountsInfoState = atom({
  key: "accountsInfo",
  default: AccountsInfoFactory("", 0, 0),
  effects_UNSTABLE: [persistAtomEffect],
});

export const Token = atom({
  key: "loginToken",
  default: null,
  effects_UNSTABLE: [persistAtomEffect],
});

export const CliHost = atom({
  key: "CliHost",
  default: "",
  effects_UNSTABLE: [persistAtomEffect],
});
export const CliPw = atom({
  key: "CliPw",
  default: "",
  effects_UNSTABLE: [persistAtomEffect],
});
export const currentViewingBlog = atom({
  key: "currentViewingBlog",
  default: {},
  effects_UNSTABLE: [persistAtomEffect],
});
export const currentViewingArticle = atom({
  key: "currentViewingArticle",
  default: {},
  effects_UNSTABLE: [persistAtomEffect],
});
export const pageState = atomFamily({
  key: "pageState",
  effects_UNSTABLE: [persistAtomEffect],
  default: (id) => 1,
});
export const articleState = atomFamily({
  key: "articleState",
  default: (id) => 0,
  effects_UNSTABLE: [persistAtomEffect],
});
export const writeArticle = atom({
  key: "writeArticleState",
  default: blogFactory("", "", ""),
  effects_UNSTABLE: [persistAtomEffect],
});
