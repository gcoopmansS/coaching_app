import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const gradients = {
  primary: "linear-gradient(45deg, #ff6b6b, #f06595)", // main pink-red
  secondary: "linear-gradient(45deg, #ffa94d, #ff6b6b)", // orange to soft red
  success: "linear-gradient(45deg, #69db7c, #38d9a9)", // minty green
  neutral: "linear-gradient(45deg, #e0e0e0, #ced4da)", // light gray
};

const GradientButton = styled(Button)(({ color = "primary" }) => ({
  background: gradients[color],
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    opacity: 0.9,
    background: gradients[color],
  },
}));

export default GradientButton;
