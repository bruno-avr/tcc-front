import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import WaitLoading from "./WaitLoading";
import SubjectAPI from "../services/API/SubjectAPI";
import { toast } from "react-toastify";
import requester from "../services/Requester/Requester";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { daysOfWeekDict, intervalsToWeeklySchedule, numberToTime } from "../utils/time";
import { v4 as uuidv4 } from 'uuid';
import { StaticTimePicker } from "@mui/x-date-pickers";
import { LESSON_LENGTH } from "../utils/constants";
import dayjs from "dayjs";

const minutesInADay = 1440;

export default function TeacherEditor({
  selectedTeacher,
  isOpen,
  setNewTeacher,
}) {
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState({});
  const [addTimeModalOpen, setAddTimeModalOpen] = useState(false);
  const [currWeekDay, setCurrWeekDay] = useState(0);
  const [currTimeSlotId, setCurrTimeSlotId] = useState(0);
  const [currTimeSlotType, setCurrTimeSlotType] = useState(0);
  const [currTimeSlot, setCurrTimeSlot] = useState(0);
  const [currTime, setCurrTime] = useState(null);
  const [intervals, setIntervals] = useState([]);

  function getIntervalsFromTimeSlots(timeSlots) {
    if (!timeSlots) return [];
    return timeSlots.map(timeSlot => ({
      start: timeSlot.start,
      end: timeSlot.end,
      id: uuidv4()
    }));
  }

  function getTimeSlotsFromIntervals(_intervals) {
    return _intervals.map(interval => ({
      start: interval.start,
      end: interval.end
    }));
  }

  const sortFunction = (a, b) => {
    if (a.start === null && b.start !== null) return 1;
    if (a.start !== null && b.start === null) return -1;
    if (a.start !== null && b.start !== null) {
      if (a.start !== b.start) return a.start - b.start;
    }
    return (a.end === null && b.end !== null) ? 1 :
            (a.end !== null && b.end === null) ? -1 :
            (a.end !== null && b.end !== null) ? a.end - b.end : 0;
  };

  async function getData() {
    setLoading(true);
    try {
      const subjectApi = new SubjectAPI(requester);
      const response = await subjectApi.getSubjectsPerClass();
      setSubjects(response);
      setTeacherName(selectedTeacher?.name || "");
      setIntervals(getIntervalsFromTimeSlots(selectedTeacher?.timeSlots).sort(sortFunction));

      const aux = {};
      for (const key in selectedTeacher?.selectedClasses || {}) {
        aux[key] = [];
        selectedTeacher.selectedClasses[key].forEach((el) => {
          const subject = response.find((s) => s.id === key);
          const _class = subject.classes.find(
            (c) =>
              c.id === el.id &&
              c.name === el.name &&
              c.subjectPerGradeId === el.subjectPerGradeId
          );
          aux[key].push(_class);
        });
      }
      setSelectedClasses(aux);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isOpen) getData();
  }, [selectedTeacher]);

  useEffect(() => {
    const allValues = [];
    for (const key in selectedClasses) {
      allValues.push(...selectedClasses[key]);
    }
    setNewTeacher({
      name: teacherName,
      classes: allValues,
      timeSlots: getTimeSlotsFromIntervals(intervals),
    });
  }, [teacherName, selectedClasses, intervals]);

  function addNewTimeSlot(weekDay) {
    setIntervals((prevIntervals) => {
      const newIntervals = [...prevIntervals];
      newIntervals.push({ start: null, end: null, weekDay, id: uuidv4() });
      return newIntervals.sort(sortFunction);
    });
  }

  function removeTimeSlot(id) {
    console.log(id)
    setIntervals((prevIntervals) => {
      const newIntervals = prevIntervals.filter((interval) => 
        !(interval.id === id)
      );
      return newIntervals.sort(sortFunction);
    });
  }

  function editTimeSlot(time) {
    const thisTime = time + currWeekDay * minutesInADay;
    setIntervals((prevIntervals) => {
      const newIntervals = prevIntervals.map((interval) => {
        if (interval.id === currTimeSlotId) {
          if (currTimeSlotType === "start") interval.start = thisTime;
          else interval.end = thisTime;
        } 
        return interval
        }
      );
      return newIntervals.sort(sortFunction);
    });
  }

  const SingleTime = ({time, onAdd}) => {
    if (time === null) return (
      <Tooltip title="Adicionar horário">
        <Button
          variant="outlined"
          color="success"
          sx={{ minWidth: 0, px: 1 }}
          onClick={onAdd}
        >
          <AddIcon />
        </Button>
      </Tooltip>
    );
    return (
      <Button
        onClick={() => onAdd(time)}
        variant="text"
        color="inherit"
      >
        {numberToTime(time)}
      </Button>
    );
  }

  const closeAddTimeModal = () => {
    setAddTimeModalOpen(false);
  };

  function hasOverlap(start, end) {
    const newStart = start + currWeekDay * minutesInADay;
    const newEnd = end + currWeekDay * minutesInADay;

    for (const interval of intervals) {
      if (interval.id === currTimeSlotId) continue;
      if (interval.start === null || interval.end === null) continue;
      if (
        (start != null && newStart <= interval.end && newStart >= interval.start) ||
        (end != null && newEnd <= interval.end && newEnd >= interval.start) ||
        (start != null && end != null && newStart <= interval.end && newEnd >= interval.start) ||
        (start != null && end != null && newEnd >= interval.start && newStart <= interval.end)
      ) {
        return true;
      }
    }
    return false;
  }

  function getAddTimeSlotError(newTime) {
    if (currTimeSlotType === "start") {
      if (hasOverlap(newTime, currTimeSlot.end)) {
        return "O novo intervalo se sobrepõe a um intervalo existente.";
      }
      if (currTimeSlot.end !== null) {
        const duration = currTimeSlot.end - newTime + 1;
        if (duration < LESSON_LENGTH) {
          return `O intervalo entre o início e o fim deve ser de pelo menos ${LESSON_LENGTH} minutos.`
        }
      }
    } else if (currTimeSlotType === "end") {
      if (hasOverlap(currTimeSlot.start, newTime)) {
        return "O novo intervalo se sobrepõe a um intervalo existente.";
      }
      if (currTimeSlot.start !== null) {
        const duration = newTime - currTimeSlot.start + 1;
        if (duration < LESSON_LENGTH) {
          return `O intervalo entre o início e o fim deve ser de pelo menos ${LESSON_LENGTH} minutos.`
        }
      }
    }
    return null;
  }

  const AddTimeModal = ({open, onClose}) => {
    const [time, setTime] = useState(null);

    useEffect(() => {
      if (currTime === null) return;
      const hours = Math.floor(currTime / 60);
      const minutes = currTime % 60;
      setTime(dayjs().set('hour', hours).set('minute', minutes).set('second', 0));
    }, [currTime])

    function addTime() {
      if (!time) {
        toast.error("Nenhum horário foi escolhido.");
        return;
      }

      const thisTime = time.hour() * 60 + time.minute();
      const error = getAddTimeSlotError(thisTime);
      if (error) {
        toast.error(error);
      } else {
        editTimeSlot(thisTime);
        onClose();
      }
      onClose();
    }

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          Adicionar horário ({daysOfWeekDict[currWeekDay].toLowerCase()})
        </DialogTitle>
        <DialogContent>
          <StaticTimePicker
            ampm={false}
            localeText={{
              timePickerToolbarTitle: "Escolha o horário de início",
            }}
            slotProps={{
              actionBar: { actions: [] },
            }}
            value={time}
            onChange={(newValue) => setTime(newValue)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={addTime}
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  function handleAddClick(weekDay, id, type, timeSlot, time) {
    setCurrWeekDay(weekDay);
    setCurrTimeSlotId(id);
    setCurrTimeSlotType(type);
    setCurrTimeSlot(timeSlot);
    setCurrTime(time);
    setAddTimeModalOpen(true);
  }

  return (
    <WaitLoading loading={loading}>
      <TextField
        autoFocus
        margin="dense"
        id="teacherName"
        label="Nome do Professor"
        type="text"
        fullWidth
        value={teacherName}
        onChange={(e) => setTeacherName(e.target.value)}
        required
      />
      <Divider sx={{ my: 2 }} />
      <Typography textAlign="center" variant="h5" component="div">
        Disciplinas
      </Typography>
      <Divider sx={{ mt: 2 }} />
      {subjects.map((subject) => (
        <FormControl
          id={`${subject.id}-chip-label`}
          key={subject.id}
          fullWidth
          sx={{ mt: 2 }}
        >
          <InputLabel>{subject.name}</InputLabel>
          <Select
            labelId={`${subject.id}-chip-label`}
            id={`${subject.id}-chip`}
            multiple
            value={selectedClasses[subject.id] || []}
            onChange={(e) => {
              setSelectedClasses((curr) => {
                const copy = { ...curr };
                if (!e.target.value?.length) {
                  delete copy[subject.id];
                } else {
                  copy[subject.id] = e.target.value;
                }
                return copy;
              });
            }}
            input={
              <OutlinedInput
                id={`${subject.id}-select-chip`}
                label={subject.name}
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value.id} label={value.name} />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {subject.classes.map((el) => (
              <MenuItem key={el.id} value={el}>
                {el.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <Divider sx={{ my: 2 }} />
      <Typography textAlign="center" variant="h5" component="div">
        Intervalos de preferência para as aulas
      </Typography>
      <Divider sx={{ my: 2 }} />
      {intervalsToWeeklySchedule(intervals).map((timeSlots, weekDay) => (
        <Box key={weekDay}>
          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom variant="h6" component="div" mb={2}>
            {daysOfWeekDict[weekDay]}
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ border: '1px solid #ddd', borderRadius: '4px' }}
            elevation={0}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Horário inicial</TableCell>
                  <TableCell align="center">Horário Final</TableCell>
                  <TableCell align="center">Excluir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((timeSlot) => (
                  <TableRow key={timeSlot.id}>
                    <TableCell align="center">
                      <SingleTime time={timeSlot.start} onAdd={(time) => handleAddClick(weekDay, timeSlot.id, "start", timeSlot, time)} />
                    </TableCell>
                    <TableCell align="center">
                      <SingleTime time={timeSlot.end} onAdd={(time) => handleAddClick(weekDay, timeSlot.id, "end", timeSlot, time)} />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        color="error"
                        sx={{ minWidth: 0, px: 0 }}
                        onClick={() => removeTimeSlot(timeSlot.id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => addNewTimeSlot(weekDay)}
                    >
                      Adicionar novo intervalo
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
      <AddTimeModal open={addTimeModalOpen} onClose={closeAddTimeModal} />
    </WaitLoading>
  );
}
