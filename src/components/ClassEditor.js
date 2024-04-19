import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import LibraryAddIcon from "@mui/icons-material/KeyboardTab";
import requester from "../services/Requester/Requester";
import { toast } from "react-toastify";
import GradeAPI from "../services/API/GradeAPI";
import {
  daysOfWeekDict,
  numberToTime,
  numbersToWeeklySchedule,
} from "../utils/time";
import { LESSON_LENGTH } from "../utils/constants";
import WaitLoading from "./WaitLoading";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";

const minutesInADay = 1440;

export default function ClassEditor({
  selectedClass,
  isOpen,
  setNewClass,
  classes,
}) {
  const [loading, setLoading] = useState(false);
  const [addTimeModalOpen, setAddTimeModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [section, setSection] = useState(null);
  const [grades, setGrades] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [currWeekDay, setCurrWeekDay] = useState(0);
  const [currTimeSlots, setCurrTimeSlots] = useState(0);

  async function getNames() {
    setLoading(true);
    try {
      const gradeApi = new GradeAPI(requester);
      const response = await gradeApi.getNames();
      setGrades(response);
      setSection(selectedClass?.section || null);
      setAvailableTimeSlots(selectedClass?.availableTimeSlots || []);
      setSelectedGrade(
        response.find((el) => el.name === selectedClass?.grade?.name) || ""
      );
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isOpen) getNames();
  }, [selectedClass]);

  useEffect(() => {
    setNewClass({
      section,
      grade: selectedGrade,
      availableTimeSlots,
    });
  }, [availableTimeSlots, selectedGrade, section]);

  const closeAddTimeModal = () => {
    setAddTimeModalOpen(false);
  };

  const closeCopyModal = () => {
    setCopyModalOpen(false);
  };

  function getClassName() {
    let className = "";
    if (selectedGrade?.name) className += selectedGrade.name;
    if (selectedGrade?.name && section) className += " - ";
    if (section) className += section;
    return className;
  }

  function deleteTimeSlot(weekDay, time) {
    const thisTime = time + weekDay * minutesInADay;
    setAvailableTimeSlots(
      availableTimeSlots.filter((timeSlot) => timeSlot !== thisTime)
    );
  }

  function addTimeSlot(weekDay, time) {
    const thisTime = time + weekDay * minutesInADay;
    setAvailableTimeSlots((currState) =>
      [...currState, thisTime].sort((a, b) => a - b)
    );
  }

  function getAddTimeSlotError(arr, k) {
    // if ends in another day
    if (k + LESSON_LENGTH >= minutesInADay)
      return "O horário criado deve iniciar e terminar no mesmo dia.";

    // binary search to check if finds an element in [k - (LESSON_LENGTH-1), k + (LESSON_LENGTH-1)]
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] < k - (LESSON_LENGTH - 1)) {
        left = mid + 1;
      } else if (arr[mid] > k + (LESSON_LENGTH - 1)) {
        right = mid - 1;
      } else {
        return (
          "O horário fornecido entra em conflito com um dos horários cadastrados: " +
          `${numberToTime(arr[mid])} - ${numberToTime(
            arr[mid] + LESSON_LENGTH
          )}`
        ); // found a value in the range
      }
    }

    return null; // no value found in the range
  }

  function handleAddClick(weekDay, timeSlots) {
    setAddTimeModalOpen(true);
    setCurrWeekDay(weekDay);
    setCurrTimeSlots(timeSlots);
  }

  function copyTimeSlots(_class) {
    setAvailableTimeSlots([...(_class?.availableTimeSlots || [])]);
    toast.success(
      `Horários copiados da turma: ${_class?.grade?.name} - ${_class?.section}`
    );
    closeCopyModal();
  }

  const Time = ({ time, timeSlots, weekDay }) => (
    <Paper elevation={4} sx={{ textAlign: "center" }}>
      <Grid container alignItems="center">
        <Grid item xs={2} textAlign="center">
          <Tooltip title="Excluir">
            <Button
              onClick={() => deleteTimeSlot(weekDay, time)}
              variant="text"
              color="error"
              fullWidth
              sx={{ minWidth: 0, px: 0 }}
            >
              <CloseIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={8}>
          {`${numberToTime(time)} - ${numberToTime(time + LESSON_LENGTH)}`}
        </Grid>
        {!getAddTimeSlotError(timeSlots, time + LESSON_LENGTH) && (
          <Grid item xs={2} textAlign="center">
            <Tooltip title="Adicionar horário consecutivo">
              <Button
                onClick={() => addTimeSlot(weekDay, time + LESSON_LENGTH)}
                variant="text"
                color="primary"
                fullWidth
                sx={{ minWidth: 0, px: 0 }}
              >
                <LibraryAddIcon />
              </Button>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Paper>
  );

  const AddTimeModal = () => {
    const [time, setTime] = useState(null);

    function addTime() {
      if (!time) {
        toast.error("Nenhum horário foi escolhido.");
        return;
      }

      const thisTime = time.hour() * 60 + time.minute();
      const error = getAddTimeSlotError(currTimeSlots, thisTime);
      if (error) {
        toast.error(error);
      } else {
        addTimeSlot(currWeekDay, thisTime);
        closeAddTimeModal();
      }
    }

    return (
      <Dialog open={addTimeModalOpen} onClose={closeAddTimeModal}>
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
          <Button onClick={closeAddTimeModal}>Cancelar</Button>
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

  const CopyModal = () => (
    <Dialog open={copyModalOpen} onClose={closeCopyModal}>
      <DialogTitle>Copiar horários de uma turma</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {classes.map((_class, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                onClick={() => copyTimeSlots(_class)}
                fullWidth
                startIcon={<ContentCopyIcon />}
                color="inherit"
              >
                {`${_class.grade.name} - ${_class.section}`}
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeCopyModal}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <WaitLoading loading={loading}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl required fullWidth sx={{ mt: 1 }}>
            <InputLabel id="grade-label">Série</InputLabel>
            <Select
              labelId="grade-label"
              id="grade"
              value={selectedGrade}
              label="Série"
              onChange={(e) => {
                setSelectedGrade(e.target.value);
              }}
            >
              {grades.map((grade) => (
                <MenuItem key={grade.name} value={grade}>
                  {grade.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="dense"
            id="section"
            label="Código da Turma"
            type="text"
            fullWidth
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            label="Nome da Turma (preenchido automáticamente)"
            type="text"
            fullWidth
            value={getClassName()}
            disabled
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Typography textAlign="center" variant="h5" component="div">
          Horários disponíveis
        </Typography>
        <Box
          sx={{
            position: "absolute",
            right: 0,
            color: "inherit",
          }}
        >
          <Tooltip title="Copiar horários de uma turma">
            <IconButton
              onClick={() => setCopyModalOpen(true)}
              variant="contained"
              fullWidth
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {numbersToWeeklySchedule(availableTimeSlots).map((timeSlots, weekDay) => (
        <Box key={weekDay}>
          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom variant="h6" component="div">
            {daysOfWeekDict[weekDay]}
          </Typography>
          <Grid container spacing={2}>
            {timeSlots.map((timeSlot) => (
              <Grid key={timeSlot} item xs={12} md={6}>
                <Time time={timeSlot} timeSlots={timeSlots} weekDay={weekDay} />
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ textAlign: "center" }}>
                <Grid container alignItems="center">
                  <Grid item xs={12} textAlign="center">
                    <Button
                      onClick={() => handleAddClick(weekDay, timeSlots)}
                      variant="contained"
                      color="success"
                      startIcon={<AddIcon />}
                      fullWidth
                    >
                      Adicionar horário
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ))}
      <AddTimeModal />
      <CopyModal />
    </WaitLoading>
  );
}
