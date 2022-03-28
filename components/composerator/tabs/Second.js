import {
  Box,
  Button,
  Checkbox,
  Chip,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  CustomAutoComplete,
  CustomOptions,
  ListSetter,
  useCustomEffect,
} from "..";
import { objRemover, objToArray } from "../../../pages/composerator";
import { isEmpty } from "../../../src/functions";
import { useEnvironAtom, useServiceAtom, useSysMsg } from "../../../src/hooks";
export default (props) => {
  const { services, serviceKey, setServices } = props;
  const curService = services[serviceKey];
  const [sysMsg, setSysMsg] = useSysMsg();
  const [localPath, setLocalPath] = useState("");
  const [conPath, setConPath] = useState("");
  const [volPath, setVolPath] = useState(curService.volumes || []);
  const [localPort, setLocalPort] = useState("");
  const [conPort, setConPort] = useState("");
  const [Ports, setPorts] = useState(curService.ports || []);
  const [envKey, setEnvKey] = useState("");
  const [envValue, setEnvValue] = useState("");
  const [dependsCon, setDependsCon] = useState("");
  const [dependsOption, setDependsOption] = useState("service_started");
  const [depends, setDepends] = useState(curService.depends_on || {});
  const [environ, setEnviron] = useState(curService.environment || []);
  const [expose, setExpose] = useState("");
  const [exposeList, setExposeList] = useState(curService.expose || []);
  //toggle State Start//
  const [volToggle, setVolToggle] = useState(false);
  const [portsToggle, setPortsToggle] = useState(false);
  const [exposeToggle, setExposeToggle] = useState(false);
  const [envToggle, setEnvToggle] = useState(false);
  const [dependsToggle, setDependsToggle] = useState(false);
  const [serviceAtom, setServiceAtom, removeServiceAtom] = useServiceAtom();
  const [environAtom, setEnvironAtom, removeEnvironAtom] =
    useEnvironAtom(serviceKey);
  //toggle State Ends
  //handlerStarts
  const handleVolPath = (e) => {
    e.preventDefault();
    if (!localPath || !conPath) {
      setMsg("경로를 입력해주세요");
      return;
    }
    setVolPath([...volPath, localPath + ":" + conPath]);
    setConPath("");
    setLocalPath("");
  };
  const handleEnviron = (e) => {
    e.preventDefault();
    if (!envKey || !envValue) {
      setMsg("설정을 입력해주세요");
      return;
    }
    setEnviron([...environ, envKey + ":" + envValue]);
    setEnvKey("");
    setEnvValue("");
  };
  const handlePorts = (e) => {
    e.preventDefault();
    if (!localPort || !conPort) {
      setMsg("포트를 입력해주세요");
      return;
    }
    setPorts([...Ports, localPort + ":" + conPort]);
    setConPort("");
    setLocalPort("");
  };
  const handleExpose = (e) => {
    e.preventDefault();
    if (!expose) {
      setMsg("포트를 입력해주세요");
      return;
    }
    setExposeList([...exposeList, expose]);
    setExpose("");
  };
  const handleDepends = (e) => {
    e.preventDefault();
    if (!depends) {
      setMsg("대상컨테이너를 입력해주세요");
      return;
    }
    setDepends({
      ...depends,
      [dependsCon]: {
        condition: dependsOption,
      },
    });
    setDependsCon("");
    setDependsOption("");
  };
  // Handler Ends
  const dependsList = objToArray(depends);
  // function Starts

  const arrRemover = (getter, setter) => {
    return function (index) {
      setter(getter.filter((val, idx) => idx !== index));
    };
  };
  useEffect(() => {
    // 빌드상세설정이 켜져있을경우 계속해서 build를 오버라이드.
    if (!isEmpty(depends)) {
      let tempState = services[serviceKey];
      setServices({
        ...services,
        [serviceKey]: { ...tempState, depends_on: depends },
      });
    } else {
      let tempState = services[serviceKey];
      delete tempState.depends_on;
      setServices({
        ...services,
        [serviceKey]: { ...tempState },
      });
    }
  }, [depends]);
  useCustomEffect(
    setServices,
    services,
    serviceKey,
    volPath,
    [volPath],
    "volumes",
    ["volumes"]
  );
  const env = "environment";
  useCustomEffect(setServices, services, serviceKey, environ, [environ], env, [
    env,
  ]);
  useCustomEffect(
    setServices,
    services,
    serviceKey,
    exposeList,
    [exposeList],
    "expose",
    ["expose"]
  );
  useCustomEffect(setServices, services, serviceKey, Ports, [Ports], "ports", [
    "ports",
  ]);

  return (
    <Stack sx={{ pl: 3 }} spacing={1} direction="column">
      <ListSetter
        names={{
          main: "Volumes",
          left: "LocalVolume",
          right: "ContainerVolume",
        }}
        left={localPath}
        setLeft={setLocalPath}
        right={conPath}
        setRight={setConPath}
        arr={volPath}
        arrSetter={setVolPath}
        toggle={volToggle}
        setToggle={setVolToggle}
        onClickHandler={handleVolPath}
        onRemoveHandler={arrRemover(volPath, setVolPath)}
      />
      <ListSetter
        names={{
          main: "Expose",
          left: "Expose",
          right: "",
        }}
        left={expose}
        setLeft={setExpose}
        right={""}
        setRight={""}
        arr={exposeList}
        arrSetter={setExposeList}
        toggle={exposeToggle}
        setToggle={setExposeToggle}
        onClickHandler={handleExpose}
        onRemoveHandler={arrRemover(exposeList, setExposeList)}
      />
      <ListSetter
        names={{
          main: "Ports",
          left: "LocalPort",
          right: "ContainerPort",
        }}
        left={localPort}
        setLeft={setLocalPort}
        right={conPort}
        setRight={setConPort}
        arr={Ports}
        arrSetter={setPorts}
        toggle={portsToggle}
        setToggle={setPortsToggle}
        onClickHandler={handlePorts}
        onRemoveHandler={arrRemover(Ports, setPorts)}
      />
      <EnvironSetter
        names={{
          main: "Environments",
          left: "EnvironmentKey",
          right: "EnvironmentValue",
        }}
        left={envKey}
        setLeft={setEnvKey}
        right={envValue}
        setRight={setEnvValue}
        arr={environ}
        arrSetter={setEnviron}
        toggle={envToggle}
        setToggle={setEnvToggle}
        onClickHandler={handleEnviron}
        onRemoveHandler={arrRemover(environ, setEnviron)}
        refOptions={environAtom}
        refOptionsSetter={setEnvironAtom}
        refOptionsRemover={removeEnvironAtom}
      />
      <ListSetter
        names={{
          main: "Depends_On",
          left: "TargetServices",
          right: "Options",
        }}
        left={dependsCon}
        setLeft={setDependsCon}
        right={dependsOption}
        setRight={setDependsOption}
        arr={dependsList}
        arrSetter={setDepends}
        toggle={dependsToggle}
        setToggle={setDependsToggle}
        onClickHandler={handleDepends}
        onRemoveHandler={objRemover}
        refOptions={serviceAtom}
        ownOptions={dependsOptions}
        originState={depends}
      />
    </Stack>
  );
};

const dependsOptions = [
  {
    name: "service_started",
    short: "started",
    desc: "컨테이너가 시작되면 실행됩니다.",
  },
  {
    name: "service_healthy",
    short: "healthy",
    desc: "컨테이너 상태를 체크 후 실행됩니다.",
  },
  {
    name: "service_completed_successfully",
    short: "completed",
    desc: "컨테이너가 완전히 시작되고 나서 실행됩니다.",
  },
];

const EnvironSetter = (props) => {
  const {
    names,
    left,
    setLeft,
    right,
    setRight,
    arr,
    arrSetter,
    toggle,
    setToggle,
    onClickHandler,
    onRemoveHandler,
    refOptions,
    refOptionsSetter,
    refOptionsRemover,
  } = props;
  return (
    <Box>
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Typography sx={{ m: 0 }}>{names.main}</Typography>
        <Checkbox
          checked={toggle}
          onChange={(e) => setToggle(e.target.checked)}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Box>
      <Box
        sx={{
          display: !isEmpty(arr) ? "block" : "none",
          width: "100%",
        }}
      >
        {arr.map((path, idx) => {
          return (
            <Tooltip key={path} title="Delete">
              <Chip
                sx={{ m: 0.5 }}
                label={path}
                onClick={() => onRemoveHandler(idx)}
              ></Chip>
            </Tooltip>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          display: toggle ? "flex" : "none",
        }}
      >
        <CustomAutoComplete
          getter={left}
          setter={setLeft}
          options={refOptions}
          optionsSetter={refOptionsSetter}
          // optionsRemover={refOptionsRemover}
          label={"name"}
          Tag={names.left}
        />
        <TextField
          label={names.right}
          value={right}
          onChange={(e) => setRight(e.target.value)}
          size="small"
          sx={{ width: "100%" }}
        />
        <Button variant="contained" onClick={onClickHandler}>
          추가
        </Button>
      </Box>
    </Box>
  );
};
