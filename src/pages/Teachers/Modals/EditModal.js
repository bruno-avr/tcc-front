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
import TeacherAPI from "../../../services/API/TeacherAPI";
import TeacherEditor from "../../../components/TeacherEditor";

export default function EditModal({
  modalOpen,
  setModalOpen,
  selectedTeacher,
  getData,
}) {
  const [newTeacher, setNewTeacher] = useState({});
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEditTeacher = async () => {
    setLoading(true);
    try {
      if (!newTeacher?.name)
        throw new Error("Informe um nome para o professor.");
      if (newTeacher.timeSlots.find(timeSlot => timeSlot.start === null || timeSlot.end === null)) {
        throw new Error("Selecione todos os horários criados.");
      }
      const teacherApi = new TeacherAPI(requester);
      await teacherApi.editTeacher(selectedTeacher.id, newTeacher);
      await getData();
      closeModal();
      toast.success("Professor alterado com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={modalOpen === "edit"} onClose={closeModal} fullWidth>
      <DialogTitle>Editar Professor</DialogTitle>
      <DialogContent>
        <TeacherEditor
          selectedTeacher={selectedTeacher}
          isOpen={modalOpen === "edit"}
          setNewTeacher={setNewTeacher}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleEditTeacher}
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
