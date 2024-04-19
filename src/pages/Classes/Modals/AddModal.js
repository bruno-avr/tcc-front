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
import ClassAPI from "../../../services/API/ClassAPI";
import ClassEditor from "../../../components/ClassEditor";

export default function AddModal({ getData, classes }) {
  const { isAddModalOpen, closeAddModal } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [newClass, setNewClass] = useState(null);

  const handleAddGrade = async () => {
    setLoading(true);
    try {
      if (!newClass?.grade) throw new Error("Escolha uma série");
      if (!newClass?.section) throw new Error("Digite o código da turma");
      const classApi = new ClassAPI(requester);
      await classApi.addClass(newClass);
      await getData();
      closeAddModal();
      toast.success("Nova turma adicionada com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={isAddModalOpen} onClose={closeAddModal} fullWidth>
      <DialogTitle>Adicionar Turma</DialogTitle>
      <DialogContent>
        <ClassEditor
          isOpen={isAddModalOpen}
          setNewClass={setNewClass}
          classes={classes}
        />
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
