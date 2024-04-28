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
import SubjectEditor from "../../../components/SubjectEditor";
import SubjectAPI from "../../../services/API/SubjectAPI";

export default function AddModal({ getData }) {
  const { isAddModalOpen, closeAddModal } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [newSubject, setNewSubject] = useState(false);

  const handleAddGrade = async () => {
    setLoading(true);
    try {
      if (!newSubject?.name)
        throw new Error("Informe um nome para a disciplina.");
      const subjectApi = new SubjectAPI(requester);
      await subjectApi.addSubject(newSubject);
      await getData();
      closeAddModal();
      toast.success("Nova disciplina adicionada com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={isAddModalOpen} onClose={closeAddModal} fullWidth>
      <DialogTitle>Adicionar Disciplina</DialogTitle>
      <DialogContent>
        <SubjectEditor isOpen={isAddModalOpen} setNewSubject={setNewSubject} />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAddModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleAddGrade}
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
