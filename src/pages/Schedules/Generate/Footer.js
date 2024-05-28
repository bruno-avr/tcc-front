import { styled } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
  InputBase,
  LinearProgress,
  ListSubheader,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ReplayIcon from "@mui/icons-material/Replay";
import CalculateIcon from "@mui/icons-material/Calculate";
import { formatDate } from "../../../utils/time";
import { METAHEURISTIC_DICT } from "../../../utils/constants";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  position: "sticky",
  top: "auto",
  bottom: 0,
  backgroundColor: theme.palette.grey[100],
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.15)",
    },
  },
}));

const Footer = ({
  isFeasible,
  score,
  setShowTeachers,
  getData,
  changesDetected,
  resetToDefault,
  hasSelectedCells,
  fixedRecalculation,
  saveSchedule,
  createdAt,
  metaheuristic,
  setMetaheuristic,
  loadingScore,
}) => {
  function getStatus() {
    if (loadingScore)
      return (
        <Box sx={{ width: "280px" }} color="text.disabled">
          <LinearProgress color="inherit" />
        </Box>
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
        {!!changesDetected && (
          <Tooltip title="Desfazer mudanças">
            <IconButton
              color="text.primary"
              onClick={resetToDefault}
              variant="contained"
              fullWidth
            >
              <ReplayIcon />
            </IconButton>
          </Tooltip>
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

        {createdAt ? (
          <Typography
            textAlign="center"
            variant="body2"
            component="div"
            color="text.secondary"
            sx={{ mr: 3 }}
          >
            {`Criado ${
              metaheuristic ? `usando ${METAHEURISTIC_DICT[metaheuristic]}` : ""
            } em ${formatDate(createdAt)}`}
          </Typography>
        ) : (
          <FormControl sx={{ minWidth: 120, mr: 1 }} size="small">
            <Select
              value={metaheuristic}
              onChange={(e) => {
                setMetaheuristic(e.target.value);
              }}
              input={<BootstrapInput />}
            >
              <ListSubheader sx={{ mb: 1 }}>Metaheurística</ListSubheader>
              {Object.keys(METAHEURISTIC_DICT).map((m) => (
                <MenuItem key={m} value={m}>
                  {METAHEURISTIC_DICT[m]}
                </MenuItem>
              ))}
              <Box sx={{ mb: 1 }} />
            </Select>
          </FormControl>
        )}

        <Tooltip title="Vizualizar professores">
          <Checkbox
            icon={<PeopleOutlinedIcon />}
            checkedIcon={<PeopleIcon />}
            onChange={(e) => setShowTeachers(e.target.checked)}
          />
        </Tooltip>

        {!createdAt && (
          <>
            <Tooltip title="Recalcular">
              <IconButton onClick={getData} variant="contained" fullWidth>
                <ReplayIcon />
              </IconButton>
            </Tooltip>
            {!!hasSelectedCells && (
              <Tooltip title="Recalcula todo o horário, exceto as aulas selecionadas.">
                <Button
                  onClick={fixedRecalculation}
                  startIcon={<CalculateIcon />}
                  variant="contained"
                  color="secondary"
                  sx={{ ml: 2 }}
                >
                  Recalculo Fixado
                </Button>
              </Tooltip>
            )}
            <Button
              onClick={saveSchedule}
              startIcon={<BookmarkIcon />}
              variant="contained"
              color="success"
              sx={{ ml: 2 }}
            >
              Salvar
            </Button>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Footer;
