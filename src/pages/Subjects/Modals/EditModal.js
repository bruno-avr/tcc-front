import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import requester from "../../../services/Requester/Requester";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import SubjectEditor from "../../../components/SubjectEditor";
import SubjectAPI from "../../../services/API/SubjectAPI";

export default function EditModal({
  modalOpen,
  setModalOpen,
  selectedSubject,
  getData,
}) {
  const [newSubject, setNewSubject] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEditSubject = async () => {
    setLoading(true);
    try {
      if (!newSubject?.name)
        throw new Error("Informe um nome para a disciplina.");
      const subjectApi = new SubjectAPI(requester);
      await subjectApi.editSubject(selectedSubject.id, newSubject);
      await getData();
      closeModal();
      toast.success("Disciplina alterada com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={modalOpen === "edit"} onClose={closeModal} fullWidth>
      <DialogTitle>Editar Turma</DialogTitle>
      <DialogContent>
        <SubjectEditor
          selectedSubject={selectedSubject}
          isOpen={modalOpen === "edit"}
          setNewSubject={setNewSubject}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleEditSubject}
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
