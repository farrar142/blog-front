import {
  Box,
  Button,
  Checkbox,
  Chip,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { CustomAutoComplete, CustomOptions } from "..";
import { isEmpty } from "../../../src/functions";

export default (props) => {
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
    ownOptions,
    originState,
  } = props;
  const RightRender = () => {
    if (!isEmpty(setRight)) {
      return (
        <TextField
          label={names.right}
          value={right}
          onChange={(e) => setRight(e.target.value)}
          size="small"
          sx={{ width: "100%" }}
        />
      );
    } else {
      return <></>;
    }
  };
  const EnvDivider = () => {
    if (names.main === "Depends_On") {
      return (
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
            label={"name"}
            Tag={names.left}
          />
          <CustomOptions
            getter={right}
            setter={setRight}
            options={ownOptions}
          />
          <Button variant="contained" onClick={onClickHandler}>
            추가
          </Button>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            display: toggle ? "flex" : "none",
          }}
        >
          <TextField
            label={names.left}
            value={left}
            onChange={(e) => {
              e.preventDefault();
              setLeft(e.target.value);
            }}
            size="small"
            sx={{ width: "100%" }}
          />
          {RightRender()}
          <Button variant="contained" onClick={onClickHandler}>
            추가
          </Button>
        </Box>
      );
    }
  };
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
            <Tooltip key={(path, +idx)} title="Delete">
              <Chip
                sx={{ m: 0.5 }}
                label={path}
                onClick={() =>
                  onRemoveHandler(idx, arrSetter, originState, path)
                }
              ></Chip>
            </Tooltip>
          );
        })}
      </Box>
      <Box>{EnvDivider()}</Box>
    </Box>
  );
};
