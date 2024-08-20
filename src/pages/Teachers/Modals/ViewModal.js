import React from "react";

import {
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { daysOfWeekDict, intervalsToWeeklySchedule, numberToTime } from "../../../utils/time";

export default function ViewModal({
  modalOpen,
  setModalOpen,
  selectedTeacher,
  setSelectedTeacher,
}) {
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen("edit");
  };

  const handleDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen("delete");
  };

  const Time = ({ start, end }) => (
    <Paper
      variant="outlined"
      elevation={4}
      sx={{ padding: "8px", textAlign: "center" }}
    >
      {`${numberToTime(start)} - ${numberToTime(end)}`}
    </Paper>
  );

  return (
    <Dialog open={modalOpen === "view"} onClose={closeModal} fullWidth>
      <DialogTitle>
        <Typography gutterBottom variant="h4" component="div">
          {selectedTeacher.name}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "inherit",
          }}
        >
          <IconButton onClick={() => handleEdit(selectedTeacher)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(selectedTeacher)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        <Divider />
      </DialogTitle>
      <DialogContent>
        {selectedTeacher?.classesPerSubject?.length ? (
          <>
            <Typography textAlign="center" variant="h5" component="div">
              Disciplinas cadastradas
            </Typography>
            <Divider sx={{ my: 2 }} />
            {selectedTeacher?.classesPerSubject?.map((subject, index) => (
              <Box key={index}>
                <Typography gutterBottom variant="h6" component="div">
                  {subject.name}
                </Typography>
                <Grid container spacing={2}>
                  {subject.classes.map((className, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4}>
                      <Paper
                        variant="outlined"
                        elevation={4}
                        sx={{ padding: "8px", textAlign: "center" }}
                      >
                        {className}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </>
        ) : (
          <Typography
            gutterBottom
            textAlign="center"
            variant="h5"
            component="div"
          >
            Nenhuma disciplina cadastrada
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography textAlign="center" variant="h5" component="div">
          Intervalos de preferência para as aulas
        </Typography>
        <Divider sx={{ my: 2 }} />
        {intervalsToWeeklySchedule(selectedTeacher?.timeSlots).map(
          (timeSlots, weekDay) => (
            <Box key={weekDay}>
              <Typography gutterBottom variant="h6" component="div">
                {daysOfWeekDict[weekDay]}
              </Typography>
              {timeSlots.length ? (
                <Grid container spacing={2}>
                  {timeSlots.map((timeSlot) => (
                    <Grid key={timeSlot} item xs={12} sm={6} md={4}>
                      <Time start={timeSlot.start} end={timeSlot.end} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography gutterBottom variant="body2" component="div">
                  Nenhum horário cadastrado.
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
            </Box>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
