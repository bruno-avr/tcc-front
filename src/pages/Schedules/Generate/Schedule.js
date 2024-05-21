import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import {
  Avatar,
  Chip,
  Divider,
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
import ClassIcon from "@mui/icons-material/Class";

const minutesInADay = 1440;

const StyledTableCell = styled(TableCell)(({ theme, gray, white }) => ({
  textAlign: "center",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.common.white,
    borderColor: theme.palette.text.disabled,
    // border: 0,
    ...(white
      ? {
          backgroundColor: theme.palette.text.primary,
          // backgroundColor: theme.palette.primary.dark,
          color: theme.palette.common.white,
        }
      : {}),
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    ...(gray
      ? {
          backgroundColor: theme.palette.text.primary,
          color: theme.palette.common.white,
          borderColor: theme.palette.text.disabled,
        }
      : {}),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
      <Grid container>
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
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell white>
              <Chip
                avatar={
                  <Avatar>
                    <ClassIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                }
                // icon={<ClassIcon />}
                color="primary"
                label={schedule.className}
              />
            </StyledTableCell>
            {Object.keys(weekSchedule).map((weekDay) => (
              <StyledTableCell key={weekDay}>
                {daysOfWeekDict[weekDay]}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from(times).map((time) => (
            <StyledTableRow key={time}>
              <StyledTableCell gray component="th" scope="row">
                {numberToTime(time)}
              </StyledTableCell>
              {Object.keys(weekSchedule).map((weekDay) => (
                <StyledTableCell>
                  {getLessonStr(weekSchedule[weekDay][time])}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Schedule;
