import { styled } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ReplayIcon from "@mui/icons-material/Replay";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  position: "sticky",
  top: "auto",
  bottom: 0,
  backgroundColor: theme.palette.grey[100],
}));

const Footer = ({ isFeasible, score, setShowTeachers, getData }) => {
  return (
    <StyledAppBar>
      <Divider />
      <Toolbar>
        <Typography
          textAlign="center"
          variant="h6"
          component="div"
          color={isFeasible ? "success.main" : "error.main"}
        >
          {isFeasible ? "Factível" : "Infactível"}
        </Typography>
        {!!isFeasible && (
          <Typography
            textAlign="center"
            variant="h6"
            component="div"
            color="text.primary"
            sx={{ ml: 1 }}
          >
            {` - Pontuação: ${score}`}
          </Typography>
        )}
        <Box flexGrow={1} />
        <Tooltip title="Vizualizar professores">
          <Checkbox
            icon={<PeopleOutlinedIcon />}
            checkedIcon={<PeopleIcon />}
            onChange={(e) => setShowTeachers(e.target.checked)}
          />
        </Tooltip>
        <Tooltip title="Recalcular">
          <IconButton onClick={getData} variant="contained" fullWidth>
            <ReplayIcon />
          </IconButton>
        </Tooltip>
        <Button
          // onClick={() => }
          startIcon={<BookmarkIcon />}
          variant="contained"
          color="success"
          sx={{ ml: 2 }}
        >
          Salvar
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Footer;
