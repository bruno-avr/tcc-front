import { useEffect, useState } from "react";
import ScheduleAPI from "../../../services/API/ScheduleAPI";
import WaitLoading from "../../../components/WaitLoading";
import { toast } from "react-toastify";
import requester from "../../../services/Requester/Requester";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/time";
import { METAHEURISTIC_DICT } from "../../../utils/constants";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:hover": {
    backgroundColor: "rgba(173, 216, 230, 0.4)",
    cursor: "pointer",
    border: 0,
  },
}));

const View = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);

  async function getData() {
    setLoading(true);
    try {
      const scheduleApi = new ScheduleAPI(requester);
      const response = await scheduleApi.getSchedules();
      setSchedules(response || []);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  function getStatus(schedule) {
    if (schedule.isFeasible) {
      return (
        <Chip color="success" label="Factível" sx={{ fontWeight: "bold" }} />
      );
    }
    return (
      <Chip color="error" label="Infactível" sx={{ fontWeight: "bold" }} />
    );
  }

  return (
    <WaitLoading loading={loading}>
      {!schedules.length ? (
        <Typography textAlign="center" variant="h5">
          Nenhum horário cadastrado.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "rgba(44, 59, 69, 0.9)",
                }}
              >
                <TableCell sx={{ color: "common.white" }} align="center">
                  Criado em
                </TableCell>
                <TableCell sx={{ color: "common.white" }} align="center">
                  Status
                </TableCell>
                <TableCell sx={{ color: "common.white" }} align="center">
                  Metaheurística
                </TableCell>
                <TableCell sx={{ color: "common.white" }} align="center">
                  Pontuação
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <StyledTableRow
                  key={schedule.id}
                  onClick={() => navigate(`/schedules/view/${schedule.id}`)}
                >
                  <TableCell align="center">
                    {formatDate(schedule.createdAt)}
                  </TableCell>
                  <TableCell align="center">{getStatus(schedule)}</TableCell>
                  <TableCell align="center">
                    {schedule.metaheuristic
                      ? METAHEURISTIC_DICT[schedule.metaheuristic]
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {!schedule.score && schedule.score !== 0
                      ? "-"
                      : schedule.score}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </WaitLoading>
  );
};

export default View;
