import React from "react";

import {
  Grid,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ViewModal({
  modalOpen,
  setModalOpen,
  selectedGrade,
  setSelectedGrade,
}) {
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEdit = (grade) => {
    setSelectedGrade(grade);
    setModalOpen("edit");
  };

  const handleDelete = (grade) => {
    setSelectedGrade(grade);
    setModalOpen("delete");
  };

  return (
    <Dialog open={modalOpen === "view"} onClose={closeModal} fullWidth>
      <DialogTitle>
        <Typography gutterBottom variant="h4" component="div">
          {selectedGrade.name}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "inherit",
          }}
        >
          <IconButton onClick={() => handleEdit(selectedGrade)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(selectedGrade)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        <Divider />
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Disciplinas:
        </Typography>
        {selectedGrade.subjects?.length ? (
          <Grid container spacing={2}>
            {selectedGrade.subjects.map((subject, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Typography variant="body1" gutterBottom>
                  {subject.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Aulas por semana: {subject.numWeeklyLessons}
                </Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Nenhuma disciplina foi cadastrada nessa série.
          </Typography>
        )}

        <Typography variant="h6" gutterBottom mt={2}>
          Turmas:
        </Typography>
        {selectedGrade.classes?.length ? (
          <Grid container spacing={2}>
            {selectedGrade.classes.map((_class, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Typography variant="body1" gutterBottom>
                  {_class.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Nenhuma turma foi cadastrada nessa série.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
