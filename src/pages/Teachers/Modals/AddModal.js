import React, { useContext, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import requester from "../../../services/Requester/Requester";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../../../context/AppContext";
import TeacherAPI from "../../../services/API/TeacherAPI";
import TeacherEditor from "../../../components/TeacherEditor";

export default function AddModal({ getData }) {
  const { isAddModalOpen, closeAddModal } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [newTeacher, setNewTeacher] = useState({});

  const handleAddTeacher = async () => {
    setLoading(true);
    try {
      if (!newTeacher?.name)
        throw new Error("Informe um nome para o professor.");
      if (newTeacher.timeSlots.find(timeSlot => timeSlot.start === null || timeSlot.end === null)) {
        throw new Error("Selecione todos os horários criados.");
      }
      const teacherApi = new TeacherAPI(requester);
      await teacherApi.addTeacher(newTeacher);
      await getData();
      closeAddModal();
      toast.success("Novo professor adicionado com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={isAddModalOpen} onClose={closeAddModal} fullWidth>
      <DialogTitle>Adicionar Professor</DialogTitle>
      <DialogContent>
        <TeacherEditor isOpen={isAddModalOpen} setNewTeacher={setNewTeacher} />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAddModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleAddTeacher}
          variant="contained"
          color="success"
          loading={loading}
          startIcon={<AddIcon />}
        >
          Adicionar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
