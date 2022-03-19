import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      //   main: '#556cd6',
      main: "#fff0f5",
    },
    secondary: {
      main: "#1fcecb",
      // main: '#19857b',
      //rgba(223, 249, 255, 0.89);
    },
    third: {
      main: "#dff9ff",
      // main: '#19857b',
      //rgba(223, 249, 255, 0.89);
    },
    transparent: {
      main: "#ffffff00",
    },
    white: {
      main: "ffffff",
    },
    black: {
      main: "#000000",
    },
    gray: {
      main: "#808080",
    },
    error: {
      main: red.A400,
    },
    selected: {
      main: "#1fcecb",
    },
  },
  components: {
    BottomNavigation: {
      styleOverrides: {
        root: {
          color: "#1fcecb",
        },
        selected: {
          color: "#1fcecb",
        },
      },
    },
  },
});

export default theme;
