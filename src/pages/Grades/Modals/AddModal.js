import React, { useContext, useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import GradeAPI from "../../../services/API/GradeAPI";
import requester from "../../../services/Requester/Requester";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../../../context/AppContext";

export default function AddModal({ getGrades }) {
  const { isAddModalOpen, closeAddModal } = useContext(AppContext);
  const [newGradeName, setNewGradeName] = useState("");

  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    setNewGradeName("");
  }, [isAddModalOpen]);

  const handleAddGrade = async () => {
    setLoadingAction(true);
    try {
      const gradeApi = new GradeAPI(requester);
      await gradeApi.addGrade(newGradeName);
      await getGrades();
      closeAddModal();
      setNewGradeName("");
      toast.success("Nova série adicionada com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoadingAction(false);
  };

  return (
    <Dialog open={isAddModalOpen} onClose={closeAddModal} fullWidth>
      <DialogTitle>Adicionar Série</DialogTitle>
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
        <Button onClick={closeAddModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleAddGrade}
          variant="contained"
          color="success"
          loading={loadingAction}
          startIcon={<AddIcon />}
        >
          Adicionar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
