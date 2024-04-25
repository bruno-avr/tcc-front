import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SubjectAPI from "../../../services/API/SubjectAPI";
import requester from "../../../services/Requester/Requester";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

export default function DeleteModal({
  modalOpen,
  setModalOpen,
  selectedSubject,
  getData,
}) {
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const subjectApi = new SubjectAPI(requester);
      await subjectApi.deleteSubject(selectedSubject.id);
      await getData();
      closeModal();
      toast.success("Disciplina excluída com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={modalOpen === "delete"} onClose={closeModal}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        Tem certeza que deseja excluir a disciplina {selectedSubject?.name}?
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
