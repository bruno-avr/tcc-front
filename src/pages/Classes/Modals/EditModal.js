import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClassAPI from "../../../services/API/ClassAPI";
import requester from "../../../services/Requester/Requester";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import ClassEditor from "../../../components/ClassEditor";

export default function EditModal({
  modalOpen,
  setModalOpen,
  selectedClass,
  getData,
}) {
  const [newClass, setNewClass] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEditClass = async () => {
    setLoading(true);
    try {
      if (!newClass?.grade) throw new Error("Escolha uma série");
      if (!newClass?.section) throw new Error("Digite o código da turma");
      const classApi = new ClassAPI(requester);
      await classApi.editClass(selectedClass.id, newClass);
      await getData();
      closeModal();
      toast.success("Turma alterada com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={modalOpen === "edit"} onClose={closeModal} fullWidth>
      <DialogTitle>Editar Turma</DialogTitle>
      <DialogContent>
        <ClassEditor
          selectedClass={selectedClass}
          isOpen={modalOpen === "edit"}
          setNewClass={setNewClass}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleEditClass}
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
