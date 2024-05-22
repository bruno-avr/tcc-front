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
import { useState } from "react";

const minutesInADay = 1440;

const StyledTableCell = styled(TableCell)(
  ({ theme, gray, selected, darkRow, draggable, hovered }) => ({
    textAlign: "center",
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.common.white,
      borderColor: theme.palette.text.primary,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      ...(gray
        ? {
            backgroundColor: theme.palette.grey[900],
            color: theme.palette.common.white,
            borderColor: theme.palette.text.primary,
            fontWeight: "bold",
          }
        : {}),
      ...(selected
        ? {
            backgroundColor: darkRow
              ? "rgba(237, 108, 2, 0.55)"
              : "rgba(237, 108, 2, 0.40)",
            borderColor: "rgba(237, 108, 2, 0.30)",
          }
        : {}),
      ...(draggable
        ? {
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: selected
                ? darkRow
                  ? "rgba(237, 108, 2, 0.65)"
                  : "rgba(237, 108, 2, 0.5)"
                : "rgba(173, 216, 230, 0.7)",
              border: 0,
            },
          }
        : {}),
      ...(hovered
        ? {
            backgroundColor: "rgba(173, 216, 230, 0.7)",
          }
        : {}),
    },
  })
);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Schedule = ({
  schedule,
  showTeachers,
  draggedLesson,
  setDraggedLesson,
  swapLessons,
  selectLesson,
}) => {
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

  const [hoveredLesson, setHoveredLesson] = useState({});

  const handleDragStart = (className, lesson) => {
    setDraggedLesson({ className, lesson });
  };

  const handleDragLeave = () => {
    setHoveredLesson({});
  };

  const handleDragOver = (event, className, lesson) => {
    event.preventDefault();
    if (className === draggedLesson.className) {
      setHoveredLesson(lesson);
    }
  };

  const handleDrop = (event, className, lesson) => {
    event.preventDefault();
    const droppedLesson = { className, lesson };

    if (droppedLesson.className === draggedLesson.className) {
      if (
        droppedLesson.lesson.subject?.name !==
        draggedLesson.lesson.subject?.name
      ) {
        swapLessons(draggedLesson.lesson, droppedLesson.lesson);
      }
    }
    setDraggedLesson(null);
    setHoveredLesson({});
  };

  return (
    <TableContainer sx={{ mb: 3 }} component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ px: 0 }}>
              <Chip
                avatar={
                  <Avatar>
                    <ClassIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                }
                color="primary"
                label={schedule.className}
                sx={{ fontSize: 14 }}
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
          {Array.from(times).map((time, rowIndex) => (
            <StyledTableRow key={time}>
              <StyledTableCell gray component="th" scope="row">
                {numberToTime(time)}
              </StyledTableCell>
              {Object.keys(weekSchedule).map((weekDay, colIndex) => (
                <StyledTableCell
                  key={colIndex}
                  selected={weekSchedule[weekDay][time].isSelected}
                  darkRow={rowIndex % 2}
                  hovered={
                    hoveredLesson.startingTime ===
                    weekSchedule[weekDay][time].startingTime
                  }
                  draggable
                  onDragStart={() =>
                    handleDragStart(
                      schedule.className,
                      weekSchedule[weekDay][time]
                    )
                  }
                  onDragOver={(event) =>
                    handleDragOver(
                      event,
                      schedule.className,
                      weekSchedule[weekDay][time]
                    )
                  }
                  onDragLeave={handleDragLeave}
                  onDrop={(event) =>
                    handleDrop(
                      event,
                      schedule.className,
                      weekSchedule[weekDay][time]
                    )
                  }
                  onClick={() => selectLesson(weekSchedule[weekDay][time])}
                >
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
