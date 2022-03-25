import { useState, useEffect, createRef } from "react";
import {
  TextField,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab,
  Box,
  Typography,
  Checkbox,
  Tooltip,
  IconButton,
  Container,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useSysMsg } from "../src/hooks";
import { atom, atomFamily, useRecoilState } from "recoil";
import DeleteIcon from "@mui/icons-material/Delete";

const filter = createFilterOptions();
const buildDetailState = atomFamily({
  key: "buildDetailpath",
  default: (service) => false,
});
const dockerOptions = [
  { name: "nginx", image: "nginx:latest" },
  { name: "mariadb", image: "mariadb:latest" },
  { name: "jenkins", image: "jenkins:latest" },
  { name: "nodejs", image: "nodejs:16" },
  { name: "redis", image: "redis:latest" },
  { name: "jupyter", image: "jupyter/datascience-notebook:latest" },
];

export default (props) => {
  const [sysMsg, setMsg] = useSysMsg();
  const [dockerText, setDockerText] = useState("");
  const [services, setServices] = useState({
    django: {
      image: "python:3.10",
      build: ".",
      container_name: "django",
      volumes: ["./apps:./usr/src/app"],
      ports: ["8000:8000"],
    },
  });
  const [serviceText, setServiceText] = useState("");
  const dockerRef = createRef();
  const serviceAddHandler = (e) => {
    e.preventDefault();
    if (!serviceText) {
      setMsg("서비스를 입력해주세요");
      return;
    }
    setServices({ [serviceText]: {}, ...services });
    setServiceText("");
  };
  useEffect(() => {
    setDockerText(composerCreator(services));
  }, [services]);

  const serviceRemover = (name) => {
    let tempState = services;
    delete tempState[name];
    setServices({ ...tempState });
  };
  // console.log(serializer(example));
  return (
    <Container style={styles.cprCon}>
      <textarea
        style={{
          padding: 10,
          margin: 0,
          width: "50%",
          position: "sticky",
          top: "80px",
        }}
        ref={dockerRef}
        name="textarea"
        id="dockertextarea"
        cols="30"
        rows="10"
        value={dockerText}
        onChange={(e) => {
          setDockerText(e.target.value);
        }}
      />
      <Box sx={{ width: "50%" }}>
        <Stack sx={styles.inputLine}>
          <Box sx={{ display: "flex", pr: 3 }}>
            <Autocomplete
              sx={{ pl: 3, width: "100%" }}
              disablePortal
              value={serviceText}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setServiceText(newValue);
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setServiceText(newValue.inputValue);
                } else {
                  try {
                    setServiceText(newValue.name);
                  } catch {
                    setServiceText(newValue);
                  }
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.name
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `Add "${inputValue}"`,
                    image: "",
                  });
                }

                return filtered;
              }}
              label="Services"
              size="small"
              options={dockerOptions}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option.name;
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div style={{ width: "40%" }}>{option.name}</div>

                    <div style={{ width: "60%" }}>{option.image}</div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Service" />
              )}
            />
            <Button onClick={serviceAddHandler} variant="contained">
              추가
            </Button>
          </Box>
        </Stack>
        <ServicesContainer
          services={services}
          setServices={setServices}
          serviceRemover={serviceRemover}
        ></ServicesContainer>
      </Box>
    </Container>
  );
};

const ServicesContainer = (props) => {
  const { services, setServices, serviceRemover } = props;
  const [value, setValue] = useState(0);
  const handleChange = (e, newValue) => {
    console.log(newValue);
    console.log(e);
    setValue(newValue);
  };
  let serviceList = [];
  for (let serviceKey in services) {
    serviceList.push(serviceKey);
  }

  return (
    <Box>
      <Box>
        <Tabs
          sx={{ pl: 3, maxWidth: "1200px" }}
          value={value}
          // onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {serviceList.map((service, idx) => {
            return (
              <Box key={service + idx}>
                <Tab
                  label={service}
                  onClick={() => {
                    handleChange(0, idx);
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={() => serviceRemover(service)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
        </Tabs>
      </Box>
      {serviceList.map((service, idx) => {
        return (
          <TabPanel
            key={idx + service}
            value={value}
            index={idx}
            services={services}
            serviceKey={service}
            setServices={setServices}
          />
        );
      })}
    </Box>
  );
};

function TabPanel(props) {
  const {
    services,
    serviceKey,
    setServices,
    children,
    value,
    index,
    ...other
  } = props;
  const [sysMsg, setMsg] = useSysMsg();
  const [conName, setConName] = useState(
    services[serviceKey].container_name || ""
  );
  const [imgName, setImgName] = useState(services[serviceKey].image || "");
  const [command, setCommand] = useState(services[serviceKey].command || "");
  const [buildPath, setBuildPath] = useState(services[serviceKey].build || "");
  const [buildPathDetailOption, setBuildPathDetailOption] = useRecoilState(
    buildDetailState(serviceKey)
  );
  const [contextPath, setContextPath] = useState(
    services[serviceKey].context || ""
  );
  const [dockerfilePath, setDockerfilePath] = useState(
    services[serviceKey].dockerfile || "./Dockerfile"
  );
  const [localPath, setLocalPath] = useState("");
  const [conPath, setConPath] = useState("");
  const [volPath, setVolPath] = useState(services[serviceKey].volumes || []);
  const [localPort, setLocalPort] = useState("");
  const [conPort, setConPort] = useState("");
  const [Ports, setPorts] = useState(services[serviceKey].ports || []);
  const [envKey, setEnvKey] = useState("");
  const [envValue, setEnvValue] = useState("");
  const [environ, setEnviron] = useState(
    services[serviceKey].environment || []
  );
  //handlerStarts
  const handleConName = (e) => {
    const name = e.target.value;
    setConName(name);
  };
  const handleImgName = (e) => {
    const name = e.target.value;
    setImgName(name);
  };
  const handleCommand = (e) => {
    const name = e.target.value;
    setCommand(name);
  };
  const handleBuildPath = (e) => {
    const name = e.target.value;
    setBuildPath(name);
  };
  const handleContextPath = (e) => {
    const name = e.target.value;
    setContextPath(name);
  };
  const handleDockerfilePath = (e) => {
    const name = e.target.value;
    setDockerfilePath(name);
  };
  const handleConPath = (e) => {
    const name = e.target.value;
    setConPath(name);
  };
  const handleLocalPath = (e) => {
    const name = e.target.value;
    setLocalPath(name);
  };
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
  const handleEnvKey = (e) => {
    const name = e.target.value;
    setEnvKey(name);
  };
  const handleEnvValue = (e) => {
    const name = e.target.value;
    setEnvValue(name);
  };
  const handleEnviron = (e) => {
    e.preventDefault();
    if (!envKey || !envValue) {
      setMsg("설저을 입력해주세요");
      return;
    }
    setEnviron([...environ, envKey + ":" + envValue]);
    setEnvKey("");
    setEnvValue("");
  };
  const handleConPort = (e) => {
    const name = e.target.value;
    setConPort(name);
  };
  const handleLocalPort = (e) => {
    const name = e.target.value;
    setLocalPort(name);
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
  // Handler Ends
  // function Starts
  const volPathRemover = (volidx) => {
    console.log(volidx);
    setVolPath(volPath.filter((val, idx) => idx !== volidx));
  };
  const PortsRemover = (portidx) => {
    console.log(portidx);
    setPorts(Ports.filter((val, idx) => idx !== portidx));
  };
  const EnvironRemover = (environidx) => {
    console.log(environidx);
    setEnviron(environ.filter((val, idx) => idx !== environidx));
  };
  const cn = "container_name";
  useCustomEffect(setServices, services, serviceKey, conName, [conName], cn, [
    cn,
  ]);
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
    volPath,
    [volPath],
    "volumes",
    ["volumes"]
  );
  const env = "environment";
  useCustomEffect(setServices, services, serviceKey, environ, [environ], env, [
    env,
  ]);
  useCustomEffect(setServices, services, serviceKey, Ports, [Ports], "ports", [
    "ports",
  ]);
  useCustomEffect(
    setServices,
    services,
    serviceKey,
    imgName,
    [imgName, buildPath],
    "image",
    ["image"],
    ["build"],
    () => {
      setBuildPathDetailOption(false);
    }
  );
  // useEffect(() => {
  //   if (buildPathDetailOption) {
  //     const target = ["image"];
  //     let tempState = services[serviceKey];
  //     for (let i in target) {
  //       delete tempState[target[i]];
  //     }
  //     setServices({ ...services, [serviceKey]: { ...tempState } });
  //   } else {
  //     const target = ["context", "dockerfile"];
  //     let tempState = services[serviceKey];
  //     for (let i in target) {
  //       delete tempState.build[target[i]];
  //     }
  //     setServices({ ...services, [serviceKey]: { ...tempState } });
  //   }
  // });
  useEffect(() => {
    // 빌드상세설정이 켜져있을경우 계속해서 build를 오버라이드.
    if (buildPath) {
      let tempState = services[serviceKey];
      setServices({
        ...services,
        [serviceKey]: { ...tempState, build: buildPath },
      });
    } else {
      let tempState = services[serviceKey];
      setServices({
        ...services,
        [serviceKey]: { ...tempState },
      });
    }
  }, [buildPath]);

  useEffect(
    () => {
      if (buildPathDetailOption) {
        if (buildPathDetailOption ? contextPath : false) {
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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Stack sx={{ p: 3 }} spacing={1} direction="column">
          <TextField
            label="ImageName"
            value={imgName}
            onChange={handleImgName}
            size="small"
          />
          <Stack spacing={1} direction="column">
            <Box sx={{ width: "100%", display: "flex" }}>
              <TextField
                sx={{ width: "100%" }}
                label={!buildPathDetailOption ? "BuildPath" : "Context"}
                value={!buildPathDetailOption ? buildPath : contextPath}
                onChange={
                  !buildPathDetailOption ? handleBuildPath : handleContextPath
                }
                size="small"
              />
              <Tooltip title="setDetailBuild">
                <Checkbox
                  checked={buildPathDetailOption}
                  onChange={(e) => setBuildPathDetailOption(e.target.checked)}
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
              <TextField
                sx={{ width: "100%" }}
                label="dockerfile"
                value={dockerfilePath}
                onChange={handleDockerfilePath}
                size="small"
              />
            </Stack>
          </Stack>
          <TextField
            label="ContainerName"
            value={conName}
            onChange={handleConName}
            size="small"
          />
          <TextField
            label="Command"
            value={command}
            onChange={handleCommand}
            size="small"
          />
          <Typography>Volumes</Typography>
          <Box
            sx={{
              display: volPath.length >= 1 ? "block" : "none",
              width: "100%",
            }}
          >
            {volPath.map((path, idx) => {
              return (
                <Tooltip key={path} title="Delete">
                  <Chip
                    sx={{ m: 0.5 }}
                    label={path}
                    onClick={() => volPathRemover(idx)}
                  ></Chip>
                </Tooltip>
              );
            })}
          </Box>
          <Box sx={styles.inputLine}>
            <TextField
              label="LocalPath"
              value={localPath}
              onChange={handleLocalPath}
              size="small"
              sx={{ width: "100%" }}
            />
            <TextField
              label="ContainerPath"
              value={conPath}
              onChange={handleConPath}
              size="small"
              sx={{ width: "100%" }}
            />
            <Button variant="contained" onClick={handleVolPath}>
              추가
            </Button>
          </Box>
          <Typography>Ports</Typography>
          <Box
            sx={{
              display: Ports.length >= 1 ? "block" : "none",
              width: "100%",
            }}
          >
            {Ports.map((path, idx) => {
              return (
                <Tooltip key={path} title="Delete">
                  <Chip
                    sx={{ m: 0.5 }}
                    label={path}
                    onClick={() => PortsRemover(idx)}
                  ></Chip>
                </Tooltip>
              );
            })}
          </Box>
          <Box sx={styles.inputLine}>
            <TextField
              label="LocalPort"
              value={localPort}
              onChange={handleLocalPort}
              size="small"
              sx={{ width: "100%" }}
            />
            <TextField
              label="ContainerPort"
              value={conPort}
              onChange={handleConPort}
              size="small"
              sx={{ width: "100%" }}
            />
            <Button variant="contained" onClick={handlePorts}>
              추가
            </Button>
          </Box>
          <Typography>Environment</Typography>
          <Box
            sx={{
              display: environ.length >= 1 ? "block" : "none",
              width: "100%",
            }}
          >
            {environ.map((path, idx) => {
              return (
                <Tooltip key={path} title="Delete">
                  <Chip
                    sx={{ m: 0.5 }}
                    label={path}
                    onClick={() => EnvironRemover(idx)}
                  ></Chip>
                </Tooltip>
              );
            })}
          </Box>
          <Box sx={styles.inputLine}>
            <TextField
              label="Environment Key"
              value={envKey}
              onChange={handleEnvKey}
              size="small"
              sx={{ width: "100%" }}
            />
            <TextField
              label="Environment Value"
              value={envValue}
              onChange={handleEnvValue}
              size="small"
              sx={{ width: "100%" }}
            />
            <Button variant="contained" onClick={handleEnviron}>
              추가
            </Button>
          </Box>
        </Stack>
      )}
    </div>
  );
}
const example = {
  version: "3",
  services: {
    react: {
      build: ".",
      restart: "unless-stopped",
      container_name: "react",
      command: "npm run dev",
      hostname: "root",
      volumes: [
        "./components:/usr/src/app/components",
        "./components:/usr/src/app/components",
      ],
      ports: ["3000:80", "5555:5555"],
    },
  },
};

const composerCreator = (obj) => {
  const start = { services: obj };
  let texts = 'version: "3"\n';
  texts += serializer(start);
  return texts;
};

const serializer = (obj, depth = 0) => {
  let texts = "";
  // obj를 넣어서 obj인경우엔 재귀호출
  for (let key in obj) {
    const indent = "  ".repeat(depth);
    if (Array.isArray(obj[key])) {
      texts += indent + key + ":\n";
      for (let idx in obj[key]) {
        texts += indent + "  - " + obj[key][idx] + "\n";
      }
    } else if (typeof obj[key] === "object") {
      texts += indent + key + ":\n" + serializer(obj[key], depth + 1);
    } else {
      texts += indent + key + ": " + obj[key] + "\n";
    }
  }
  return texts;
};
const styles = {
  cprCon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "cenmter",
    maxWidth: "1200px",
    height: "80vh",
    marginBottom: "300px",
  },
  inputLine: {
    display: "flex",
    width: "100%",
  },
  tagCon: {
    overflow: "scroll",
    width: "100%",
    padding: "auto",
    margin: "auto",
    justifyContent: "center",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
};
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
    console.log(watcher);

    let tempState = svcGetter[svcKey];
    for (let i in pre_del_list) {
      try {
        delete tempState[pre_del_list[i]];
      } catch {}
    }
    pre_function();
    if (!isEmpty(watcher)) {
      svcSetter({
        ...svcGetter,
        [svcKey]: {
          ...tempState,
          [name]: watcher,
        },
      });
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
const isEmpty = (value) => {
  if (
    value == "" ||
    value == null ||
    value == undefined ||
    (value != null && typeof value == "object" && !Object.keys(value).length)
  ) {
    console.log("값이있다구요?");
    return true;
  } else {
    return false;
  }
};
