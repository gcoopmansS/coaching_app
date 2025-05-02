// src/theme/theme.js

const theme = {
  colors: {
    // Block type colors
    warmup: "#EF9A9A", // Soft red
    run: "#64B5F6", // Sky blue
    rest: "#BDBDBD", // Light gray
    cooldown: "#81C784", // Mint green
    repeat: "#A1887F", // Soft brown

    // Core theme colors
    primary: "#64B5F6", // Primary action color
    secondary: "#81C784", // Secondary (confirmation)
    background: "#F9F9F9", // Page background
    paper: "#FFFFFF", // Card background
    text: "#1E1E1E", // Main text
    mutedText: "#666666", // Secondary text
    divider: "#E0E0E0", // Borders
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },

  typography: {
    fontFamily: `"Inter", sans-serif`,

    heading: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    subheading: {
      fontWeight: 500,
      fontSize: "1.1rem",
    },
    body: {
      fontWeight: 400,
      fontSize: "1rem",
    },
    caption: {
      fontSize: "0.75rem",
      color: "#666666",
    },
  },
};

export default theme;
