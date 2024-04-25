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
  selectedSubject,
  setSelectedSubject,
}) {
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setModalOpen("edit");
  };

  const handleDelete = (subject) => {
    setSelectedSubject(subject);
    setModalOpen("delete");
  };

  return (
    <Dialog open={modalOpen === "view"} onClose={closeModal} fullWidth>
      <DialogTitle>
        <Typography gutterBottom variant="h4" component="div">
          {selectedSubject.name}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "inherit",
          }}
        >
          <IconButton onClick={() => handleEdit(selectedSubject)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(selectedSubject)}>
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
