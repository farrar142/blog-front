import { useEffect } from "react";
export const useCustomEffect = (
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
  useEffect(() => {
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
  }, watcherList);
};
export const cmdParser = (value = "") => {
  const step1 = value.split(" ");
  const step2 = step1.map((val, idx) => '"' + cmdUpper(val, idx) + '"');
  const step3 = "[" + step2.join(", ") + "]";
  return step3;
};
const cmdUpper = (value = "", idx = 0) => {
  if (idx === 0 && value.toLowerCase().includes("cmd")) {
    return value.toUpperCase();
  } else {
    return value;
  }
};

export const listParser = (value = "") => {
  try {
    return JSON.parse(value).join(" ");
  } catch {
    return false;
  }
};
export const maskFormatter = (value = null) => {
  const hms = value.split(":").map((val) => val.trim());
  const h = hms[0] != "00" ? hms[0] + "h" : "";
  const m = hms[1] != "00" ? hms[1] + "m" : "";
  const s = hms[2] != "00" ? hms[2] + "s" : "";
  return h + m + s;
};
