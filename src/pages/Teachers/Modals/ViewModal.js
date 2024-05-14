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
            Nenhuma disciplina cadastrada.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
