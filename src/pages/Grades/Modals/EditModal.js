import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GradeAPI from "../../../services/API/GradeAPI";
import requester from "../../../services/Requester/Requester";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

export default function EditModal({
  modalOpen,
  setModalOpen,
  selectedGrade,
  getData,
}) {
  const [loading, setLoading] = useState(false);
  const [newGradeName, setNewGradeName] = useState("");

  useEffect(() => {
    if (modalOpen === "edit" && selectedGrade.name)
      setNewGradeName(selectedGrade.name);
  }, [selectedGrade, modalOpen]);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEditGrade = async () => {
    setLoading(true);
    try {
      const gradeApi = new GradeAPI(requester);
      await gradeApi.editGrade(selectedGrade.id, newGradeName);
      await getData();
      closeModal();
      toast.success("Série alterada com sucesso!");
      setNewGradeName("");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={modalOpen === "edit"} onClose={closeModal} fullWidth>
      <DialogTitle>Editar Série</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="newGradeName"
          label="Nome da Série"
          type="text"
          fullWidth
          value={newGradeName}
          onChange={(e) => setNewGradeName(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleEditGrade}
          variant="contained"
          color="primary"
          loading={loading}
          startIcon={<EditIcon />}
        >
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
