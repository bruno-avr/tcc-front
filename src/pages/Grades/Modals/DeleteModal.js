import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GradeAPI from "../../../services/API/GradeAPI";
import requester from "../../../services/Requester/Requester";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

export default function DeleteModal({
  modalOpen,
  setModalOpen,
  selectedGrade,
  getData,
}) {
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const gradeApi = new GradeAPI(requester);
      await gradeApi.deleteGrade(selectedGrade.id);
      await getData();
      closeModal();
      toast.success("Série excluída com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={modalOpen === "delete"} onClose={closeModal}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        Tem certeza que deseja excluir a série{" "}
        {selectedGrade && selectedGrade.name}?
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleConfirmDelete}
          variant="contained"
          color="error"
          loading={loading}
          startIcon={<DeleteIcon />}
        >
          Excluir
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
