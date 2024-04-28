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
      <DialogContent></DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
