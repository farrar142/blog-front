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
const { persistAtom: pageAtom } = recoilPersist({ key: "pageAtom" });

export function AccountsInfoFactory(name, id, ownBlogId = 0) {
  return {
    username: name,
    user_id: id,
    ownBlogId: ownBlogId,
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
// ssr option end
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
