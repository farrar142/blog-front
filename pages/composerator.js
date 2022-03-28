import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { createRef, useEffect, useState } from "react";
import {
  CustomAutoComplete,
  Essentials,
  PortVolumes,
  NetworksETC,
  Code,
  HealthCheck,
} from "../components/composerator";
import { isEmpty } from "../src/functions";
import { useServiceAtom, useSysMsg } from "../src/hooks";

const serviceMenu = [
  "Essentials",
  "Ports,Volumes,Environ",
  "Networks,ETC",
  "HealthCheck",
  "Deployment",
];
const testData = {
  django: {
    healthcheck: {
      test: '["CMD", "curl", "-f", "localhost:3000"]',
      interval: "20h24m60s",
    },
    image: "python:3.10",
    container_name: "django",
    volumes: ["./apps:./usr/src/app"],
    ports: ["8000:8000"],
    environment: ["APIKEY:124125621323"],
    depends_on: {
      db: {
        condition: "service_healthy",
      },
    },
  },
  // react: {
  //   build: ".",
  //   user: "root",
  //   restart: "unless-stopped",
  //   container_name: "react",
  //   command: "npm run dev",
  //   user: "root",
  //   volumes: ["./components:./usr/src/app/components"],
  //   ports: ["3000:80", "5555:5555"],
  // },
};

export default (props) => {
  const [sysMsg, setMsg] = useSysMsg();
  const [dockerText, setDockerText] = useState("");
  const [services, setServices] = useState(testData);
  const [serviceText, setServiceText] = useState("");
  const [serviceAtom, setServiceAtom, removeServiceAtom] = useServiceAtom();
  const dockerRef = createRef();
  const serviceAddHandler = (e) => {
    e.preventDefault();
    if (!serviceText) {
      setMsg("서비스를 입력해주세요");
      return;
    }
    setServices({ [serviceText]: { healthcheck: {} }, ...services });
    setServiceText("");
  };
  console.log(services);
  useEffect(() => {
    const text = composerCreator(services);
    setDockerText(text);
  }, [services]);

  const serviceRemover = (name) => {
    let tempState = services;
    delete tempState[name];
    setServices({ ...tempState });
  };
  return (
    <Container sx={styles.cprCon}>
      <Box sx={{ position: "absolute", top: "80px", left: "80px" }}>
        <Box sx={{ position: "fixed" }}>
          <Typography>Todo</Typography>
        </Box>
      </Box>
      <Box sx={{ height: "100%", width: { md: "50%", xs: "100%" } }}>
        <Code code={dockerText} codeSetter={setDockerText} language="yml" />
      </Box>
      <Box sx={{ width: { md: "50%", xs: "100%" } }}>
        <Stack sx={styles.inputLine}>
          <Box sx={{ display: "flex", width: "100%", pl: 3, pr: 3 }}>
            <CustomAutoComplete
              getter={serviceText}
              setter={setServiceText}
              options={serviceAtom}
              optionsSetter={setServiceAtom}
              optionsRemover={removeServiceAtom}
              label={"name"}
              Tag={"service"}
              subLabel={"image"}
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
    setValue(newValue);
  };
  const serviceList = objToArray(services);

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
  const [subMenuValue, setSubMenuValue] = useState(3);
  const [sysMsg, setMsg] = useSysMsg();
  const curService = services[serviceKey];

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Tabs
            sx={{ pl: 3, maxWidth: "600px" }}
            value={subMenuValue}
            variant="scrollable"
            scrollButtons="auto"
            onChange={(e, nV) => {
              setSubMenuValue(nV);
            }}
          >
            {serviceMenu.map((submenu, subidx) => {
              return <Tab key={submenu + subidx} label={submenu}></Tab>;
            })}
          </Tabs>
          <Box
            component="div"
            hidden={subMenuValue !== 0}
            id={"simple-tabpanel-0"}
          >
            <Essentials
              services={services}
              serviceKey={serviceKey}
              setServices={setServices}
            />
          </Box>
          <Box
            component="div"
            hidden={subMenuValue !== 1}
            id={"simple-tabpanel-1"}
          >
            <PortVolumes
              services={services}
              serviceKey={serviceKey}
              setServices={setServices}
            />
          </Box>

          <Box
            component="div"
            hidden={subMenuValue !== 2}
            id={"simple-tabpanel-2"}
          >
            <NetworksETC
              services={services}
              serviceKey={serviceKey}
              setServices={setServices}
            />
          </Box>
          <Box
            component="div"
            hidden={subMenuValue !== 3}
            id={"simple-tabpanel-3"}
          >
            <HealthCheck
              services={services}
              serviceKey={serviceKey}
              setServices={setServices}
            />
          </Box>
        </Box>
      )}
    </div>
  );
}
const composerCreator = (obj) => {
  const start = { services: obj };
  let texts = 'version: "3.7"\n';
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
      if (!isEmpty(obj[key])) {
        texts += indent + key + ":\n" + serializer(obj[key], depth + 1);
      }
    } else {
      if (!isEmpty(obj[key])) {
        texts += indent + key + ": " + obj[key] + "\n";
      }
    }
  }
  return texts;
};
export const objToArray = (obj) => {
  let arr = [];
  for (let key in obj) {
    arr.push(key);
  }
  return arr;
};
export const objRemover = (empty, setter, getter, target) => {
  const tempState = getter;
  try {
    delete getter[target];
  } catch {
  } finally {
    setter({ ...tempState });
  }
};
const styles = {
  cprCon: {
    display: "flex",
    flexDirection: {
      md: "row",
      xs: "column-reverse",
    },
    justifyContent: "center",
    alignItems: {
      md: "normal",
      xs: "center",
    },
    maxWidth: "1200px",
    height: "80vh",
    marginBottom: "600px",
    top: "80px",
  },
  inputLine: {
    display: "flex",
    width: "100%",
    alignItems: "center",
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
