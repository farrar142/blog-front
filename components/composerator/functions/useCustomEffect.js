import { useEffect } from "react";
import { isEmpty } from "../../../src/functions";
export default (
  svcSetter,
  svcGetter,
  svcKey,
  watcher,
  watcherList,
  name,
  del_list,
  pre_del_list = [],
  pre_function = () => {}
) => {
  useEffect(async () => {
    const timer = setTimeout(() => {
      let tempState = svcGetter[svcKey];
      for (let i in pre_del_list) {
        try {
          delete tempState[pre_del_list[i]];
        } catch {}
      }
      pre_function();
      if (!isEmpty(watcher)) {
        if (!isEmpty(name)) {
          svcSetter({
            ...svcGetter,
            [svcKey]: {
              ...tempState,
              [name]: watcher,
            },
          });
        }
      } else {
        let tempState = svcGetter[svcKey];
        for (let i in del_list) {
          try {
            delete tempState[del_list[i]];
          } catch {}
        }
        svcSetter({
          ...svcGetter,
          [svcKey]: { ...tempState },
        });
      }
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, watcherList);
};
export const UCECB = (callBack, args) => {
  let timer;
  useEffect(() => {
    timer = setTimeout(() => {
      callBack();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, args);
};
