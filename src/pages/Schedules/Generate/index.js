import { useEffect, useState } from "react";
import ScheduleAPI from "../../../services/API/ScheduleAPI";
import WaitLoading from "../../../components/WaitLoading";
import { toast } from "react-toastify";
import requester from "../../../services/Requester/Requester";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { daysOfWeekDict, numberToTime } from "../../../utils/time";

const minutesInADay = 1440;

const Generate = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);

  async function getData() {
    setLoading(true);
    try {
      const scheduleApi = new ScheduleAPI(requester);
      const response = await scheduleApi.generateSchedule();
      console.log(response);
      setSchedules(response?.schedules || []);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  const Schedule = ({ schedule, showTeachers }) => {
    const weekSchedule = {};
    const times = new Set();

    schedule.lessons.forEach((lesson) => {
      const dayOfWeek =
        (lesson.startingTime - (lesson.startingTime % minutesInADay)) /
        minutesInADay;
      const startingTime = lesson.startingTime - dayOfWeek * minutesInADay;
      times.add(startingTime);

      if (!weekSchedule[dayOfWeek]) weekSchedule[dayOfWeek] = {};
      weekSchedule[dayOfWeek][startingTime] = lesson;
    });

    function getLessonStr(lesson) {
      if (!lesson || lesson.empty) return "-";

      return (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {lesson.subject?.name || "-"}
          </Grid>
          {showTeachers && (
            <Grid item xs={12}>
              <Divider />
            </Grid>
          )}
          {showTeachers && (
            <Grid item xs={12}>
              {lesson.teacher?.name || "-"}
            </Grid>
          )}
        </Grid>
      );
    }

    return (
      <TableContainer sx={{ mb: 3 }} component={Paper}>
        <Table size={showTeachers ? "medium" : "small"}>
          <TableHead>
            <TableRow>
              <TableCell>{schedule.className}</TableCell>
              {Object.keys(weekSchedule).map((weekDay) => (
                <TableCell key={weekDay} align="center">
                  {daysOfWeekDict[weekDay]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(times).map((time) => (
              <TableRow
                key={time}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {numberToTime(time)}
                </TableCell>
                {Object.keys(weekSchedule).map((weekDay) => (
                  <TableCell align="center">
                    {getLessonStr(weekSchedule[weekDay][time])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <WaitLoading loading={loading}>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          label="Vizualizar professores"
          onChange={(e) => setShowTeachers(e.target.checked)}
        />
      </FormGroup>
      {schedules.map((schedule) => (
        <Schedule schedule={schedule} showTeachers={showTeachers} />
      ))}
    </WaitLoading>
  );
};

export default Generate;
