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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import LibraryAddIcon from "@mui/icons-material/KeyboardTab";
import ClassAPI from "../../../services/API/ClassAPI";
import requester from "../../../services/Requester/Requester";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import GradeAPI from "../../../services/API/GradeAPI";
import {
  daysOfWeekDict,
  numberToTime,
  numbersToWeeklySchedule,
} from "../../../utils/time";
import { LESSON_LENGTH } from "../../../utils/constants";

const minutesInADay = 1440;

export default function EditModal({
  modalOpen,
  setModalOpen,
  selectedClass,
  getData,
}) {
  const [addTimeModalOpen, setAddTimeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState({});
  const [section, setSection] = useState(null);
  const [grades, setGrades] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [currWeekDay, setCurrWeekDay] = useState(0);
  const [currTimeSlots, setCurrTimeSlots] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  async function getNames() {
    try {
      const gradeApi = new GradeAPI(requester);
      const response = await gradeApi.getNames();
      setGrades(response);
      setSection(selectedClass.section);
      setAvailableTimeSlots(selectedClass.availableTimeSlots);
      setSelectedGrade(
        response.find((el) => el.name === selectedClass.grade?.name) || {}
      );
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (modalOpen === "edit") {
      getNames();
    }
  }, [selectedClass, modalOpen]);

  useEffect(() => {
    if (addTimeModalOpen) {
      setMinutes(0);
      setHours(0);
    }
  }, [addTimeModalOpen]);

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeAddTimeModal = () => {
    setAddTimeModalOpen(false);
  };

  const handleEditClass = async () => {
    setLoading(true);
    try {
      const classApi = new ClassAPI(requester);
      await classApi.editClass(selectedClass.id);
      await getData();
      closeModal();
      toast.success("Turma alterada com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  function getClassName() {
    let className = "";
    if (selectedGrade.name) className += selectedGrade.name;
    if (selectedGrade.name && section) className += " - ";
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
    console.log("adding", thisTime);
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

  function addTime() {
    const thisTime = hours * 60 + minutes;
    const error = getAddTimeSlotError(currTimeSlots, thisTime);
    if (error) {
      toast.error(error);
    } else {
      addTimeSlot(currWeekDay, thisTime);
      setAddTimeModalOpen(false);
    }
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

  return (
    <>
      <Dialog open={modalOpen === "edit"} onClose={closeModal} fullWidth>
        <DialogTitle>Editar Turma</DialogTitle>
        <DialogContent>
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
                id="section"
                label="Nome da Turma (preenchido automáticamente)"
                type="text"
                fullWidth
                value={getClassName()}
                onChange={(e) => setSection(e.target.value)}
                disabled
              />
            </Grid>
          </Grid>
          {numbersToWeeklySchedule(availableTimeSlots).map(
            (timeSlots, weekDay) => (
              <Box key={weekDay}>
                <Divider sx={{ my: 2 }} />
                <Typography gutterBottom variant="h6" component="div">
                  {daysOfWeekDict[weekDay]}
                </Typography>
                <Grid container spacing={2}>
                  {timeSlots.map((timeSlot) => (
                    <Grid key={timeSlot} item xs={12} md={6}>
                      <Time
                        time={timeSlot}
                        timeSlots={timeSlots}
                        weekDay={weekDay}
                      />
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
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancelar</Button>
          <LoadingButton
            onClick={handleEditClass}
            variant="contained"
            color="primary"
            loading={loading}
            startIcon={<EditIcon />}
          >
            Editar
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog open={addTimeModalOpen} onClose={closeAddTimeModal} fullWidth>
        <DialogTitle>
          Adicionar horário ({daysOfWeekDict[currWeekDay].toLowerCase()})
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Hora"
                value={hours}
                onChange={(e) => {
                  setHours(parseInt(e.target.value));
                }}
                inputProps={{ min: 0, max: 23 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Minutos"
                value={minutes}
                onChange={(e) => {
                  setMinutes(parseInt(e.target.value));
                }}
                inputProps={{ min: 0, max: 59 }}
                fullWidth
              />
            </Grid>
          </Grid>
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
    </>
  );
}
