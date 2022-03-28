import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

export default (props) => {
  const { getter, setter, options, label } = props;
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label || "Options"}</InputLabel>
      <Select
        value={getter}
        onChange={(e) => {
          setter(e.target.value);
        }}
      >
        {options.map((item, idx) => {
          return (
            <MenuItem key={item.name + idx} value={item.name}>
              <Tooltip title={item.desc}>
                <Typography>{item.short}</Typography>
              </Tooltip>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
