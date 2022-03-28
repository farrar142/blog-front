import { Stack, TextField, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { useCustomEffect, useCustomEffectCallBack } from "..";
import { isEmpty } from "../../../src/functions";
import { cmdParser, listParser, maskFormatter } from "../functions";
export default (props) => {
  const { services, serviceKey, setServices } = props;
  const curService = services[serviceKey];
  const inputRef = useRef([]);
  const [hc, setHC] = useState(curService.healthcheck || {});
  const [test, setTest] = useState(listParser(hc.test) || "");
  const [interval, setInterval] = useState(hc.interval || "00h00m00s");
  const [timeout, setTimeout] = useState(hc.timeout || "00h00m00s");
  const [retries, setRetries] = useState(hc.retries || "");
  const [startPeriod, setStartPeriod] = useState(
    hc.start_period || "00h00m00s"
  );

  useEffect(() => {
    inputRef.current[0].addEventListener("keydown", function (e) {
      testHandler(e.target.value);
    });
    inputRef.current[1].addEventListener("keydown", function (e) {
      retriesHandler(e.target.value);
    });
  }, []);
  const testHandler = async (value) => {
    setTest(value);
    setHC({ ...hc, test: cmdParser(value) });
  };
  const intervalHandler = async (value) => {
    setHC({ ...hc, interval: maskFormatter(value) });
    setInterval(value);
  };
  const timeoutHandler = async (value) => {
    setTimeout(value);
    setHC({ ...hc, timeout: maskFormatter(value) });
  };
  const retriesHandler = async (value) => {
    setRetries(value);
    setHC({ ...hc, retries: value });
  };
  const startPeriodHandler = async (value) => {
    setStartPeriod(value);
    setHC({ ...hc, startPeriod: maskFormatter(value) });
  };
  useCustomEffect(
    setServices,
    services,
    serviceKey,
    hc,
    [hc],
    "healthcheck",
    []
  );
  useCustomEffectCallBack(() => {
    // 빌드상세설정이 켜져있을경우 계속해서 build를 오버라이드.
    if (!isEmpty(test)) {
      let tempState = services[serviceKey];
      setServices({
        ...services,
        [serviceKey]: {
          ...tempState,
          healthcheck: {
            test: cmdParser(test),
            interval: hc.interval,
            timeout: hc.timeout,
            retries: retries,
            start_period: hc.startPeriod,
          },
        },
      });
    } else {
      let tempState = services[serviceKey];
      const del_list = [
        "test",
        "interval",
        "timeout",
        "retries",
        "start_period",
      ];
      for (let i in del_list) {
        try {
          delete tempState.healthcheck[del_list[i]];
        } catch {}
      }
      setServices({
        ...services,
        [serviceKey]: { ...tempState, healthcheck: {} },
      });
    }
  }, [hc]);

  // useHCEffect(setServices, services, serviceKey, test, [test], "test");
  return (
    <Stack sx={{ pl: 3 }} spacing={1} direction="column">
      <Tooltip title="starts with CMD or CMD-SHELL">
        <TextField
          label="test"
          defaultValue={test}
          ref={(elem) => (inputRef.current[0] = elem)}
          size="small"
        />
      </Tooltip>
      <InputMask
        mask="99:99:99"
        disabled={false}
        maskChar="0"
        alwaysShowMask={true}
        value={interval}
        onChange={(newValue) => intervalHandler(newValue.target.value)}
      >
        {() => <TextField label="interval" size="small" />}
      </InputMask>

      <InputMask
        mask="99:99:99"
        disabled={false}
        maskChar="0"
        alwaysShowMask={true}
        value={timeout}
        onChange={(newValue) => timeoutHandler(newValue.target.value)}
      >
        {() => <TextField label="timeout" size="small" />}
      </InputMask>
      <TextField
        label="retries"
        type="number"
        defaultValue={retries}
        ref={(elem) => (inputRef.current[1] = elem)}
        size="small"
      />
      <InputMask
        mask="99:99:99"
        disabled={false}
        maskChar="0"
        alwaysShowMask={true}
        value={startPeriod}
        onChange={(newValue) => startPeriodHandler(newValue.target.value)}
      >
        {() => <TextField label="startPeriod" size="small" />}
      </InputMask>
    </Stack>
  );
};

const useHCEffect = (
  setter,
  getter,
  key,
  target,
  watcher,
  label,
  del_list = []
) => {
  useEffect(() => {
    // 빌드상세설정이 켜져있을경우 계속해서 build를 오버라이드.
    if (!isEmpty(target)) {
      let tempState = getter[key];
      setter({
        ...getter,
        [key]: { ...tempState, healthcheck: { [label]: target } },
      });
    } else {
      let tempState = getter[key];
      try {
        delete tempState.healthcheck[label];
      } catch {}
      setter({
        ...getter,
        [key]: { ...tempState },
      });
    }
  }, watcher);
};
