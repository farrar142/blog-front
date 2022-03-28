import { TextField, Button, Tooltip } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { objRemover } from "../../../pages/composerator";
const filter = createFilterOptions();
export default (props) => {
  const {
    getter,
    setter,
    options,
    optionsSetter,
    optionsRemover,
    label,
    Tag,
    subLabel = "",
  } = props;
  const SubLabelRenderer = (option) => {
    if (subLabel) {
      return <div style={{ width: "60%" }}>{option[subLabel]}</div>;
    } else {
      return;
    }
  };
  return (
    <Autocomplete
      sx={{ width: "100%" }}
      disablePortal
      value={getter}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setter(newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          const result = optionsSetter({
            [label]: newValue.inputValue,
            [subLabel]: newValue[subLabel],
          });
          if (result) {
            setter(newValue.inputValue);
          }
        } else {
          try {
            setter(newValue[label]);
          } catch {
            setter(newValue);
          }
        }
      }}
      isOptionEqualToValue={() => true}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue.toLowerCase() === option[label].toLowerCase()
        );
        if (inputValue !== "" && !isExisting) {
          const tempLabel = subLabel ? { [subLabel]: "" } : {};
          filtered.push({
            inputValue,
            [label]: `Add "${inputValue}"`,
            ...tempLabel,
          });
        }

        return filtered;
      }}
      label={Tag}
      size="small"
      options={options}
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
        return option[label];
      }}
      renderOption={(props, option) => {
        const onClick = props.onClick;
        delete props.onClick;
        // delete parentProps.onClick;
        return (
          <li {...props}>
            <Tooltip title={option.desc || "choose"}>
              <div
                data-option-index={props["data-option-index"]}
                onClick={onClick}
                style={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <div style={{ width: "40%" }}>{option[label]}</div>
                {SubLabelRenderer(option)}
              </div>
            </Tooltip>
            {optionsRemover ? (
              <Button
                size="small"
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  const targetIdx = props["data-option-index"];
                  optionsRemover(targetIdx);
                }}
              >
                Delete
              </Button>
            ) : (
              false
            )}
          </li>
        );
      }}
      renderInput={(params) => <TextField {...params} label={Tag} />}
    />
  );
};
