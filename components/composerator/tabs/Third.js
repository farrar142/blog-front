import { Stack } from "@mui/material";
import { useState } from "react";
import { CustomOptions, useCustomEffect } from "..";
export default (props) => {
  const { services, serviceKey, setServices } = props;
  const curService = services[serviceKey];

  const [restart, setRestart] = useState(curService.restart || "");
  useCustomEffect(
    setServices,
    services,
    serviceKey,
    restart,
    [restart],
    "restart",
    ["restart"]
  );
  return (
    <Stack sx={{ pl: 3 }} spacing={1} direction="column">
      <CustomOptions
        getter={restart}
        setter={setRestart}
        options={restartOptions}
        label={"restart"}
      />
    </Stack>
  );
};

const restartOptions = [
  {
    name: "",
    short: "empty",
    desc: "항목을 없앱니다.",
  },
  {
    name: '"no"',
    short: "no",
    desc: "재시작되지 않습니다. 기본옵션",
  },
  {
    name: "always",
    short: "always",
    desc: "컨테이너가 삭제되기 전까지 재시작됩니다.",
  },
  {
    name: "on-failure",
    short: "failure",
    desc: "컨테이너가 오류로 종료되면 재시작됩니다.",
  },
  {
    name: "unless-stopped",
    short: "unless",
    desc: "컨테이너가 종료되거나 삭제되기 전까지 재시작됩니다.",
  },
];
