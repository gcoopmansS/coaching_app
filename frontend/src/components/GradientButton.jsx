import { Button } from "@mui/material";
import theme from "../theme/theme";

export default function GradientButton({
  children,
  variant = "contained",
  ...props
}) {
  const baseStyles = {
    textTransform: "none",
    fontWeight: 500,
    borderRadius: theme.borderRadius.md,
    fontSize: "0.95rem",
  };

  const gradientStyles =
    variant === "contained"
      ? {
          background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
          color: "#fff",
          "&:hover": {
            background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            opacity: 0.9,
          },
        }
      : {
          border: `1px solid ${theme.colors.primary}`,
          color: theme.colors.primary,
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#f1faff",
          },
        };

  return (
    <Button
      variant="text"
      {...props}
      sx={{ ...baseStyles, ...gradientStyles, ...props.sx }}
    >
      {children}
    </Button>
  );
}
