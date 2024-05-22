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
import CalculateIcon from "@mui/icons-material/Calculate";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  position: "sticky",
  top: "auto",
  bottom: 0,
  backgroundColor: theme.palette.grey[100],
}));

const Footer = ({
  isFeasible,
  score,
  setShowTeachers,
  getData,
  changesDetected,
  resetToDefault,
  hasSelectedCells,
}) => {
  function getStatus() {
    if (changesDetected)
      return (
        <>
          <Tooltip title="Desfazer mudanças">
            <IconButton
              color="warning"
              onClick={resetToDefault}
              variant="contained"
              fullWidth
            >
              <ReplayIcon />
            </IconButton>
          </Tooltip>
          <Typography
            textAlign="center"
            variant="h6"
            component="div"
            color="warning.main"
          >
            Mudança detectada
          </Typography>
        </>
      );
    return (
      <>
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
      </>
    );
  }
  return (
    <StyledAppBar>
      <Divider />
      <Toolbar>
        {getStatus()}
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
        {!!hasSelectedCells && (
          <Tooltip title="Recalcula todo o horário, exceto as aulas selecionadas.">
            <Button
              // onClick={() => }
              startIcon={<CalculateIcon />}
              variant="contained"
              color="warning"
              sx={{ ml: 2 }}
            >
              Recalculo Fixado
            </Button>
          </Tooltip>
        )}
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
