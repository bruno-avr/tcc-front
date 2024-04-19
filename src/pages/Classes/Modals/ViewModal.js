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
  Paper,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  daysOfWeekDict,
  numberToTime,
  numbersToWeeklySchedule,
} from "../../../utils/time";

export default function ViewModal({
  modalOpen,
  setModalOpen,
  selectedClass,
  setSelectedClass,
}) {
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEdit = (_class) => {
    setSelectedClass(_class);
    setModalOpen("edit");
  };

  const handleDelete = (_class) => {
    setSelectedClass(_class);
    setModalOpen("delete");
  };

  const Time = ({ time }) => (
    <Paper
      variant="outlined"
      elevation={4}
      sx={{ padding: "8px", textAlign: "center" }}
    >
      {`${numberToTime(time)} - ${numberToTime(time + 50)}`}
    </Paper>
  );

  return (
    <Dialog open={modalOpen === "view"} onClose={closeModal} fullWidth>
      <DialogTitle>
        <Typography gutterBottom variant="h4" component="div">
          {`${selectedClass.grade?.name} - ${selectedClass.section}`}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "inherit",
          }}
        >
          <IconButton onClick={() => handleEdit(selectedClass)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(selectedClass)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        <Divider />
      </DialogTitle>
      <DialogContent>
        {numbersToWeeklySchedule(selectedClass.availableTimeSlots).map(
          (timeSlots, weekDay) => (
            <Box key={weekDay}>
              <Typography gutterBottom variant="h6" component="div">
                {daysOfWeekDict[weekDay]}
              </Typography>
              {timeSlots.length ? (
                <Grid container spacing={2}>
                  {timeSlots.map((timeSlot) => (
                    <Grid key={timeSlot} item xs={12} sm={6} md={4}>
                      <Time time={timeSlot} />
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
