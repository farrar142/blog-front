import { Box, Checkbox, Stack, TextField, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { atomFamily, useRecoilState } from "recoil";
import { useCustomEffect, useCustomEffectCallBack } from "..";
import { isEmpty } from "../../../src/functions";

const buildDetailState = atomFamily({
  key: "buildDetailpath",
  default: (service) => false,
});
export default (props) => {
  const { services, serviceKey, setServices } = props;
  const curService = services[serviceKey];
  const inputRef = useRef([]);
  useEffect(() => {
    inputRef.current[0].addEventListener("keydown", function (e) {
      setImgName(e.target.value);
    });
    inputRef.current[1].addEventListener("keydown", function (e) {
      setBuildPath(e.target.value);
    });
    inputRef.current[2].addEventListener("keydown", function (e) {
      setDockerfilePath(e.target.value);
    });
    inputRef.current[3].addEventListener("keydown", function (e) {
      setConName(e.target.value);
    });
    inputRef.current[4].addEventListener("keydown", function (e) {
      setUser(e.target.value);
    });
    inputRef.current[5].addEventListener("keydown", function (e) {
      setEntry(e.target.value);
    });
    inputRef.current[6].addEventListener("keydown", function (e) {
      setCommand(e.target.value);
    });
    inputRef.current[7].addEventListener("keydown", function (e) {
      setContextPath(e.target.value);
    });
  }, []);

  const [conName, setConName] = useState(
    services[serviceKey].container_name || ""
  );
  const [imgName, setImgName] = useState(curService.image || "");
  const [buildPath, setBuildPath] = useState(curService.build || "");
  const [command, setCommand] = useState(curService.command || "");
  const [entry, setEntry] = useState(curService.entrypoint || "");
  const [buildPathDetailOption, setBuildPathDetailOption] = useRecoilState(
    buildDetailState(serviceKey)
  );
  const [contextPath, setContextPath] = useState(curService.context || "");
  const [dockerfilePath, setDockerfilePath] = useState(
    curService.dockerfile || "./Dockerfile"
  );
  const [user, setUser] = useState(curService.user || "");

  const cn = "container_name";
  useCustomEffect(setServices, services, serviceKey, conName, [conName], cn, [
    cn,
  ]);
  useCustomEffect(setServices, services, serviceKey, user, [user], "user", [
    "user",
  ]);
  useCustomEffect(
    setServices,
    services,
    serviceKey,
    entry,
    [entry],
    "entrypoint",
    ["entrypoint"]
  );
  useCustomEffect(
    setServices,
    services,
    serviceKey,
    command,
    [command],
    "command",
    ["command"]
  );

  useCustomEffect(
    setServices,
    services,
    serviceKey,
    imgName,
    [imgName],
    "image",
    ["image"],
    ["build", "Dockerfile", "context"],
    () => {
      if (buildPathDetailOption == true) {
        setBuildPathDetailOption(false);
      }
    }
  );
  useCustomEffect(
    setServices,
    services,
    serviceKey,
    buildPathDetailOption,
    [buildPathDetailOption],
    false,
    ["context", "dockerfile", ["image"]]
  );
  useCustomEffectCallBack(async () => {
    // 빌드상세설정이 켜져있을경우 계속해서 build를 오버라이드.
    if (!isEmpty(buildPath)) {
      let tempState = services[serviceKey];
      try {
        delete tempState.image;
      } catch {}
      setServices({
        ...services,
        [serviceKey]: { ...tempState, build: buildPath },
      });
    } else {
      let tempState = services[serviceKey];
      try {
        delete tempState.build;
      } catch {}
      setServices({
        ...services,
        [serviceKey]: { ...tempState },
      });
    }
  }, [buildPath, buildPathDetailOption]);

  useCustomEffectCallBack(
    async () => {
      if (!isEmpty(buildPathDetailOption)) {
        if (!isEmpty(buildPathDetailOption) ? contextPath : false) {
          setServices({
            ...services,
            [serviceKey]: {
              ...services[serviceKey],
              build: {
                context: contextPath,
                dockerfile: dockerfilePath,
              },
            },
          });
        } else {
          let tempState = services[serviceKey];
          try {
            delete tempState.build.context;
            delete tempState.build.dockerfile;
            delete tempState.image;
          } catch {}
          setServices({
            ...services,
            [serviceKey]: { ...tempState },
          });
        }
      }
    },
    buildPathDetailOption ? [contextPath, dockerfilePath] : [buildPath]
  );
  return (
    <Stack sx={{ p: 3 }} spacing={1} direction="column">
      <TextField
        label="ImageName"
        // value={imgName}
        // onChange={async (e) => setImgName(e.target.value)}
        defaultValue={imgName}
        ref={(elem) => (inputRef.current[0] = elem)}
        size="small"
      />
      <Box
        sx={{ width: "100%", display: buildPathDetailOption ? "none" : "flex" }}
      >
        <TextField
          sx={{ width: "100%" }}
          ref={(elem) => (inputRef.current[1] = elem)}
          label={"BuildPath"}
          defaultValue={buildPath}
          size="small"
        />
        <Tooltip title="setDetailBuild">
          <Checkbox
            checked={buildPathDetailOption}
            onChange={async (e) => setBuildPathDetailOption(e.target.checked)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Tooltip>
      </Box>
      <Stack
        sx={{
          display: buildPathDetailOption ? "block" : "none",
          width: "100%",
        }}
        spacing={1}
        direction="column"
      >
        <Box sx={{ width: "100%", display: "flex" }}>
          <TextField
            sx={{ width: "100%" }}
            ref={(elem) => (inputRef.current[7] = elem)}
            label={"Context"}
            defaultValue={contextPath}
            size="small"
          />
          <Tooltip title="setDetailBuild">
            <Checkbox
              checked={buildPathDetailOption}
              onChange={async (e) => setBuildPathDetailOption(e.target.checked)}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Tooltip>
        </Box>
        <TextField
          sx={{ width: "100%" }}
          label="dockerfile"
          ref={(elem) => (inputRef.current[2] = elem)}
          defaultValue={dockerfilePath}
          size="small"
        />
      </Stack>
      <TextField
        label="ContainerName"
        defaultValue={conName}
        ref={(elem) => (inputRef.current[3] = elem)}
        size="small"
      />
      <TextField
        label="User"
        defaultValue={user}
        ref={(elem) => (inputRef.current[4] = elem)}
        size="small"
      />
      <TextField
        label="EntryPoint"
        defaultValue={entry}
        ref={(elem) => (inputRef.current[5] = elem)}
        size="small"
      />
      <TextField
        label="Command"
        defaultValue={command}
        ref={(elem) => (inputRef.current[6] = elem)}
        size="small"
      />
    </Stack>
  );
};
